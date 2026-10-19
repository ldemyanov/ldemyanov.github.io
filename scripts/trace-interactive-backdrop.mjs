#!/usr/bin/env node
import { createWriteStream } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { once } from 'node:events';
import { join, resolve } from 'node:path';
import { launchChrome } from './backdrop-trace/chrome.mjs';
import { connectCdp } from './backdrop-trace/cdp.mjs';
import { evaluate, preparePage, runBenchmark, warmUp } from './backdrop-trace/benchmark.mjs';
import { ensurePreview } from './backdrop-trace/preview.mjs';

const categories = [
  'devtools.timeline', 'blink.user_timing', 'v8',
  'disabled-by-default-devtools.timeline',
  'disabled-by-default-v8.cpu_profiler',
  'disabled-by-default-v8.cpu_profiler.hires',
].join(',');

/**
 * Разбирает аргументы командной строки и проверяет адрес локального сайта.
 * @param {string[]} args Аргументы после имени скрипта.
 * @returns {{url: string, label: string, chrome?: string, width: number, height: number, dpr: number}} Настройки прогона.
 */
function parseOptions(args) {
  const options = {
    url: 'http://127.0.0.1:4322/', label: 'run', width: 1440, height: 900, dpr: 1,
  };
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!value || !['--url', '--label', '--chrome', '--width', '--height', '--dpr'].includes(key)) {
      throw new Error(`Неверный аргумент ${key ?? ''}. Используйте --url, --label, --chrome, --width, --height, --dpr.`);
    }
    options[key.slice(2)] = value;
  }
  const url = new URL(options.url);
  if (!['127.0.0.1', 'localhost'].includes(url.hostname) || url.protocol !== 'http:') {
    throw new Error('Для воспроизводимого замера --url должен указывать на локальный HTTP preview.');
  }
  for (const key of ['width', 'height']) {
    options[key] = Number(options[key]);
    if (!Number.isInteger(options[key]) || options[key] < 320 || options[key] > 4096) {
      throw new Error(`${key} должен быть целым числом от 320 до 4096.`);
    }
  }
  options.dpr = Number(options.dpr);
  if (!Number.isFinite(options.dpr) || options.dpr < 1 || options.dpr > 3) {
    throw new Error('dpr должен быть числом от 1 до 3.');
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(options.label)) throw new Error('--label допускает только латинские буквы, цифры, _ и -.');
  return { ...options, url: url.href };
}

/**
 * Сохраняет gzip-поток CDP без загрузки всей трассы в память.
 * @param {object} cdp Клиент Chrome DevTools Protocol.
 * @param {string} handle Идентификатор потока события tracingComplete.
 * @param {string} path Путь файла .json.gz.
 * @returns {Promise<void>} Трасса записана и поток закрыт.
 */
async function saveTrace(cdp, handle, path) {
  const output = createWriteStream(path);
  try {
    let eof = false;
    while (!eof) {
      const chunk = await cdp.send('IO.read', { handle, size: 1024 * 1024 });
      const data = Buffer.from(chunk.data ?? '', chunk.base64Encoded ? 'base64' : 'utf8');
      if (!output.write(data)) await once(output, 'drain');
      eof = chunk.eof === true;
    }
    output.end();
    await once(output, 'finish');
  } catch (error) {
    output.destroy();
    throw error;
  } finally {
    await cdp.send('IO.close', { handle });
  }
}

/**
 * Запускает локальную запись производительности и сохраняет трассу с метаданными.
 * @param {ReturnType<typeof parseOptions>} options Настройки прогона.
 * @returns {Promise<void>} Отчёт сохранён либо выдана ошибка.
 */
async function main(options) {
  const reports = resolve('reports');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = join(reports, `backdrop-${options.label}-${stamp}`);
  let chrome;
  let cdp;
  let preview;
  let traceStarted = false;
  try {
    preview = await ensurePreview(options.url);
    if (preview.started) console.log(`Preview запущен: ${options.url}`);
    chrome = await launchChrome(options);
    cdp = await connectCdp(chrome.webSocketUrl);
    await preparePage(cdp, options.url, options.width, options.height, options.dpr);
    await warmUp(cdp, options.width, options.height);
    const canvas = await evaluate(cdp, `(() => {
      const element = document.querySelector('#interactive-backdrop');
      return {
        bufferWidth: element.width,
        bufferHeight: element.height,
        cssWidth: parseFloat(element.style.width),
        cssHeight: parseFloat(element.style.height),
        browserDpr: window.devicePixelRatio,
      };
    })()`);
    console.log(`Записываю 300 движений: ${options.url}`);
    await cdp.send('Tracing.start', {
      categories, transferMode: 'ReturnAsStream', streamFormat: 'json', streamCompression: 'gzip',
    });
    traceStarted = true;
    const benchmark = await runBenchmark(cdp, options.width, options.height);
    // Последний кадр должен успеть завершиться до остановки трассы.
    await new Promise((resolve) => setTimeout(resolve, 500));
    const complete = cdp.waitFor('Tracing.tracingComplete', 60000);
    await cdp.send('Tracing.end');
    const { stream } = await complete;
    traceStarted = false;
    if (!stream) throw new Error('Chrome завершил трассу без потока данных.');
    await mkdir(reports, { recursive: true });
    await saveTrace(cdp, stream, `${base}.json.gz`);
    await writeFile(`${base}.meta.json`, JSON.stringify({
      label: options.label,
      url: options.url,
      chrome: chrome.version,
      viewport: { width: options.width, height: options.height, devicePixelRatio: options.dpr },
      canvas,
      ...benchmark,
      traceFile: `${base}.json.gz`,
    }, null, 2) + '\n');
    console.log(`Трасса: ${base}.json.gz`);
    console.log(`Параметры: ${base}.meta.json`);
    console.log(`Событий: ${benchmark.events}; длительность: ${benchmark.durationMs} мс; максимальное опоздание: ${benchmark.maxScheduleLagMs} мс.`);
  } catch (error) {
    await rm(`${base}.json.gz`, { force: true });
    await rm(`${base}.meta.json`, { force: true });
    throw error;
  } finally {
    if (traceStarted && cdp) {
      try { await cdp.send('Tracing.end'); } catch { /* Соединение могло уже закрыться. */ }
    }
    cdp?.close();
    await chrome?.close();
    await preview?.close();
  }
}

Promise.resolve().then(() => main(parseOptions(process.argv.slice(2)))).catch((error) => {
  console.error(`Ошибка трассировки: ${error.message}`);
  process.exitCode = 1;
});
