import { performance } from 'node:perf_hooks';

const count = 300;
const intervalMs = 1000 / 60;

/**
 * Задерживает выполнение до заданного момента монотонных часов Node.js.
 * @param {number} targetTime Целевой момент performance.now().
 * @returns {Promise<void>} Ожидание завершено.
 */
async function waitUntil(targetTime) {
  const remaining = targetTime - performance.now();
  if (remaining > 1) await new Promise((resolve) => setTimeout(resolve, remaining));
}

/**
 * Выполняет выражение в странице и возвращает его результат или понятную ошибку.
 * @param {object} cdp Клиент Chrome DevTools Protocol.
 * @param {string} expression JavaScript выражение страницы.
 * @param {boolean} [awaitPromise=false] Нужно ли дождаться Promise.
 * @returns {Promise<unknown>} Значение выражения.
 */
export async function evaluate(cdp, expression, awaitPromise = false) {
  const result = await cdp.send('Runtime.evaluate', {
    expression, awaitPromise, returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(`Ошибка в странице: ${result.exceptionDetails.text}`);
  }
  return result.result?.value;
}

/**
 * Загружает страницу, дожидается ресурсов и проверяет наличие фона на главной.
 * @param {object} cdp Клиент Chrome DevTools Protocol.
 * @param {string} url Адрес сайта для записи.
 * @param {number} width Ширина viewport в CSS-пикселях.
 * @param {number} height Высота viewport в CSS-пикселях.
 * @returns {Promise<void>} Страница подготовлена для записи.
 */
export async function preparePage(cdp, url, width, height) {
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: false,
  });
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  const loaded = cdp.waitFor('Page.loadEventFired');
  await cdp.send('Page.navigate', { url });
  await loaded;
  const ready = await evaluate(cdp, `Promise.race([
    Promise.all([document.fonts.ready, ...Array.from(document.images, image => image.decode().catch(() => {}))])
      .then(() => true),
    new Promise(resolve => setTimeout(() => resolve(false), 20000))
  ])`, true);
  if (!ready) throw new Error('Шрифты или изображения не загрузились за 20 секунд.');
  const available = await evaluate(cdp, `(() => {
    window.scrollTo(0, 0);
    return Boolean(document.querySelector('#interactive-backdrop'))
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  })()`);
  if (!available) throw new Error('На открытой странице нет активного #interactive-backdrop. Укажите главную страницу.');
  await new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Прогревает отложенное создание canvas до начала измерения.
 * @param {object} cdp Клиент Chrome DevTools Protocol.
 * @param {number} width Ширина viewport.
 * @param {number} height Высота viewport.
 * @returns {Promise<void>} Прогрев завершён.
 */
export async function warmUp(cdp, width, height) {
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mouseMoved', x: width / 2, y: height / 2, pointerType: 'mouse',
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

/**
 * Отправляет 300 движений указателя по фиксированной траектории за пять секунд.
 * @param {object} cdp Клиент Chrome DevTools Protocol.
 * @param {number} width Ширина viewport.
 * @param {number} height Высота viewport.
 * @returns {Promise<{events: number, durationMs: number, maxScheduleLagMs: number}>} Параметры фактического прогона.
 */
export async function runBenchmark(cdp, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = Math.min(width * 0.22, 260);
  const radiusY = Math.min(height * 0.22, 160);
  const scheduledStart = performance.now() + 100;
  let firstEventAt = 0;
  let lastEventAt = 0;
  let maxScheduleLagMs = 0;

  for (let index = 0; index < count; index += 1) {
    await waitUntil(scheduledStart + index * intervalMs);
    const now = performance.now();
    maxScheduleLagMs = Math.max(maxScheduleLagMs, now - (scheduledStart + index * intervalMs));
    if (index === 0) {
      firstEventAt = now;
      await evaluate(cdp, `performance.mark('backdrop-benchmark-start')`);
    }
    const progress = index / (count - 1);
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: centerX + radiusX * Math.sin(progress * Math.PI * 4),
      y: centerY + radiusY * Math.sin(progress * Math.PI * 6),
      pointerType: 'mouse',
    });
    lastEventAt = performance.now();
  }
  await evaluate(cdp, `performance.mark('backdrop-benchmark-end'); performance.measure('backdrop-benchmark', 'backdrop-benchmark-start', 'backdrop-benchmark-end')`);
  return {
    events: count,
    durationMs: Math.round(lastEventAt - firstEventAt),
    maxScheduleLagMs: Math.round(maxScheduleLagMs * 10) / 10,
  };
}
