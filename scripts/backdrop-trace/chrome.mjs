import { spawn } from 'node:child_process';
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const candidates = [
  process.env.CHROME_PATH,
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

/**
 * Находит Brave или другой Chromium-браузер по явному пути либо в типовых каталогах.
 * @param {string | undefined} explicit Путь из аргумента --chrome.
 * @returns {Promise<string>} Путь к браузеру.
 */
async function findChrome(explicit) {
  for (const candidate of explicit ? [explicit] : candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch { /* Проверяем следующий путь. */ }
  }
  throw new Error('Brave или другой Chromium-браузер не найден. Передайте --chrome /путь/к/браузеру или задайте CHROME_PATH.');
}

/**
 * Делает короткую паузу между попытками подключения к Chrome.
 * @param {number} ms Длительность паузы.
 * @returns {Promise<void>} Пауза завершена.
 */
function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Запускает изолированный Chrome и получает адрес CDP его первой вкладки.
 * @param {{chrome?: string, width: number, height: number}} options Путь и размер окна.
 * @returns {Promise<{webSocketUrl: string, version: string, close: Function}>} Сеанс Chrome.
 */
export async function launchChrome(options) {
  const executable = await findChrome(options.chrome);
  const profile = await mkdtemp(join(tmpdir(), 'backdrop-trace-'));
  const child = spawn(executable, [
    '--headless=new', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-background-networking',
    '--disable-features=Translate', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, `--window-size=${options.width},${options.height}`,
    'about:blank',
  ], { stdio: 'ignore' });
  let spawnError;
  child.on('error', (error) => { spawnError = error; });

  /**
   * Завершает Chrome и удаляет временный профиль.
   * @returns {Promise<void>} Ресурсы браузера освобождены.
   */
  async function close() {
    if (child.exitCode === null) {
      child.kill('SIGTERM');
      await Promise.race([new Promise((resolve) => child.once('exit', resolve)), pause(3000)]);
      if (child.exitCode === null) child.kill('SIGKILL');
    }
    await rm(profile, { recursive: true, force: true });
  }

  try {
    let port;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      if (spawnError) throw new Error(`Не удалось запустить Chrome: ${spawnError.message}`);
      if (child.exitCode !== null) throw new Error(`Chrome завершился с кодом ${child.exitCode}.`);
      try {
        port = Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]);
        break;
      } catch { await pause(100); }
    }
    if (!port) throw new Error('Chrome не открыл порт отладки за 10 секунд.');
    const endpoint = `http://127.0.0.1:${port}`;
    const version = await (await fetch(`${endpoint}/json/version`)).json();
    const pages = await (await fetch(`${endpoint}/json/list`)).json();
    const page = pages.find((entry) => entry.type === 'page');
    if (!page) throw new Error('Chrome не создал вкладку для трассировки.');
    return { webSocketUrl: page.webSocketDebuggerUrl, version: version.Browser, close };
  } catch (error) {
    await close();
    throw error;
  }
}
