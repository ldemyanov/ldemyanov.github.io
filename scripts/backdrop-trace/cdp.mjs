/**
 * Открывает соединение с целью Chrome DevTools Protocol и сопоставляет ответы запросам.
 * @param {string} url Адрес WebSocket страницы Chrome.
 * @returns {Promise<{send: Function, waitFor: Function, close: Function}>} Клиент CDP.
 */
export async function connectCdp(url) {
  const socket = new WebSocket(url);
  const pending = new Map();
  const listeners = new Map();
  let nextId = 1;

  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  /**
   * Передаёт ответ ожидающему запросу или событие подписчику.
   * @param {MessageEvent} event Сообщение WebSocket.
   * @returns {void} Обновляет ожидающие операции.
   */
  function receive(event) {
    const message = JSON.parse(event.data);
    if (message.id) {
      const entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id);
      if (message.error) entry.reject(new Error(`${entry.method}: ${message.error.message}`));
      else entry.resolve(message.result ?? {});
      return;
    }
    const entries = listeners.get(message.method) ?? [];
    listeners.delete(message.method);
    for (const entry of entries) {
      clearTimeout(entry.timer);
      entry.resolve(message.params ?? {});
    }
  }

  socket.addEventListener('message', receive);
  socket.addEventListener('close', () => {
    for (const entry of pending.values()) entry.reject(new Error('Chrome закрыл соединение CDP.'));
    pending.clear();
    for (const entries of listeners.values()) {
      for (const entry of entries) {
        clearTimeout(entry.timer);
        entry.reject(new Error('Chrome закрыл соединение CDP.'));
      }
    }
    listeners.clear();
  });

  /**
   * Вызывает метод Chrome DevTools Protocol.
   * @param {string} method Имя метода CDP.
   * @param {object} [params={}] Параметры метода.
   * @returns {Promise<object>} Ответ Chrome.
   */
  function send(method, params = {}) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { method, resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  /**
   * Ожидает следующее событие CDP, регистрируя ожидание до команды, которая его вызывает.
   * @param {string} method Имя события CDP.
   * @param {number} [timeoutMs=30000] Предельное время ожидания.
   * @returns {Promise<object>} Параметры события.
   */
  function waitFor(method, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
      const entry = {
        resolve,
        reject,
        timer: setTimeout(() => {
          listeners.set(method, (listeners.get(method) ?? []).filter((item) => item !== entry));
          reject(new Error(`Нет события CDP ${method} за ${timeoutMs} мс.`));
        }, timeoutMs),
      };
      listeners.set(method, [...(listeners.get(method) ?? []), entry]);
    });
  }

  /**
   * Закрывает соединение с Chrome.
   * @returns {void} Соединение закрыто или уже закрывается.
   */
  function close() {
    if (socket.readyState === WebSocket.OPEN) socket.close();
  }

  return { send, waitFor, close };
}
