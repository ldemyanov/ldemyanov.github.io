import { spawn } from 'node:child_process';

/**
 * Проверяет, отвечает ли локальный сайт по заданному адресу.
 * @param {string} url Адрес preview.
 * @returns {Promise<boolean>} Истина, если сервер ответил успешным HTTP-кодом.
 */
async function isReady(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Делает паузу между попытками подключения к локальному preview.
 * @param {number} ms Длительность паузы.
 * @returns {Promise<void>} Пауза завершена.
 */
function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Подключается к запущенному preview или запускает его для стандартного адреса.
 * @param {string} url Адрес страницы для записи.
 * @returns {Promise<{close: () => Promise<void>, started: boolean}>} Управление запущенным сервером.
 */
export async function ensurePreview(url) {
  if (await isReady(url)) return { close: async () => {}, started: false };

  const target = new URL(url);
  if (target.pathname !== '/' || target.search || target.hash) {
    throw new Error(`Сайт не отвечает по адресу ${url}. Запустите нужную версию сайта перед записью.`);
  }

  const child = spawn('npm', [
    'run', 'preview', '--', '--host', target.hostname, '--port', target.port || '80', '--ignore-lock',
  ], {
    stdio: 'ignore', detached: true,
    env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: '0' },
  });
  let spawnError;
  child.on('error', (error) => { spawnError = error; });

  /**
   * Завершает только запущенную этим скриптом группу процессов preview.
   * @returns {Promise<void>} Сервер завершён.
   */
  async function close() {
    if (child.pid && child.exitCode === null) {
      try { process.kill(-child.pid, 'SIGTERM'); } catch { /* Сервер уже завершился. */ }
      await Promise.race([new Promise((resolve) => child.once('exit', resolve)), pause(3000)]);
      if (child.exitCode === null) {
        try { process.kill(-child.pid, 'SIGKILL'); } catch { /* Сервер уже завершился. */ }
      }
    }
  }

  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (spawnError || child.exitCode !== null) break;
    if (await isReady(url)) return { close, started: true };
    await pause(100);
  }
  await close();
  throw new Error(`Preview не запустился по адресу ${url}. Проверьте, что выполнена сборка npm run build.${spawnError ? ` ${spawnError.message}` : ''}`);
}
