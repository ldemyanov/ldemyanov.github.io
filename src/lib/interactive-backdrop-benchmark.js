// В dev-режиме компонент главной страницы загружает этот модуль автоматически.
// Нажмите Option/Alt + Shift + B на странице или вызовите window.runBackdropBenchmark().

let benchmarkRunning = false;

/**
 * Запускает повторяемую пятитисекундную траекторию для сравнения обработчика
 * указателя и отрисовки фона в разных версиях сайта. Первый тестовый импульс
 * выполняется до измеряемого интервала, чтобы не смешивать его с созданием canvas.
 * @returns {void} Результат выводится в консоль после завершения прогона.
 */
window.runBackdropBenchmark = function startBackdropBenchmark() {
  if (benchmarkRunning) return;
  benchmarkRunning = true;
  const events = 300;
  const intervalMs = 1000 / 60;
  const startDelayMs = 6000;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const radiusX = Math.min(window.innerWidth * 0.22, 260);
  const radiusY = Math.min(window.innerHeight * 0.22, 160);
  let index = 0;
  let firstEventAt = 0;
  let lastEventAt = 0;
  let maxScheduleLagMs = 0;

  performance.clearMarks('backdrop-benchmark-queued');
  performance.clearMarks('backdrop-benchmark-start');
  performance.clearMarks('backdrop-benchmark-end');
  performance.clearMeasures('backdrop-benchmark');
  performance.mark('backdrop-benchmark-queued');

  // Прогрев запускает отложенное создание canvas до метки начала теста.
  window.dispatchEvent(new PointerEvent('pointermove', {
    pointerType: 'mouse', pointerId: 1, isPrimary: true,
    clientX: centerX, clientY: centerY, bubbles: true,
  }));

  const scheduledStart = performance.now() + startDelayMs;

  /**
   * Помечает окончание измеряемого интервала и выводит параметры прогона.
   * Отдельное имя функции остаётся в стеке метки конца в Performance.
   * @returns {void} Результат выводится в консоль и сохраняется в User Timing.
   */
  function finishBackdropBenchmark() {
    performance.mark('backdrop-benchmark-end');
    performance.measure('backdrop-benchmark', 'backdrop-benchmark-start', 'backdrop-benchmark-end');
    benchmarkRunning = false;
    console.table({
      events,
      actualDurationMs: Math.round(lastEventAt - firstEventAt),
      maxScheduleLagMs: Math.round(maxScheduleLagMs * 10) / 10,
      viewport: `${window.innerWidth} × ${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
    });
  }

  /**
   * Посылает следующую точку фиксированной траектории и назначает следующую
   * отправку относительно исходного времени, чтобы не накапливать дрейф.
   * @returns {void} После последней точки вызывает завершение прогона.
   */
  function emitBackdropPointer() {
    const now = performance.now();
    maxScheduleLagMs = Math.max(maxScheduleLagMs, now - (scheduledStart + index * intervalMs));

    const progress = index / (events - 1);
    const x = centerX + radiusX * Math.sin(progress * Math.PI * 4);
    const y = centerY + radiusY * Math.sin(progress * Math.PI * 6);
    window.dispatchEvent(new PointerEvent('pointermove', {
      pointerType: 'mouse', pointerId: 1, isPrimary: true,
      clientX: x, clientY: y, bubbles: true,
    }));
    lastEventAt = performance.now();
    index += 1;

    if (index < events) {
      window.setTimeout(emitBackdropPointer, Math.max(0, scheduledStart + index * intervalMs - performance.now()));
      return;
    }

    finishBackdropBenchmark();
  }

  /**
   * Ставит метку начала непосредственно перед первым измеряемым событием.
   * Отдельное имя функции остаётся в стеке метки начала в Performance.
   * @returns {void} Запускает отправку точек после шестисекундной подготовки.
   */
  function beginBackdropBenchmark() {
    firstEventAt = performance.now();
    performance.mark('backdrop-benchmark-start');
    emitBackdropPointer();
  }

  console.info('Прогрев выполнен. Тест начнётся через 6 секунд.');
  window.setTimeout(beginBackdropBenchmark, startDelayMs);
};

/**
 * Запускает бенчмарк по Option/Alt + Shift + B, когда фокус находится на странице.
 * Повторные события удерживаемых клавиш не запускают второй прогон.
 * @param {KeyboardEvent} event Событие нажатия клавиш в окне страницы.
 * @returns {void} Запускает тест только при точном совпадении сочетания.
 */
function handleBackdropBenchmarkShortcut(event) {
  if (event.code !== 'KeyB' || !event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey || event.repeat) return;
  event.preventDefault();
  window.runBackdropBenchmark();
}

window.addEventListener('keydown', handleBackdropBenchmarkShortcut);

export {};
