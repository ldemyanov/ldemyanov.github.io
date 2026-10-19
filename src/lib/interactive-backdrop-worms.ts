/** Двумерное аффинное преобразование: матрица поворота/масштаба и перенос tx, ty. */
type Matrix = { a: number; b: number; c: number; d: number; tx: number; ty: number };

/**
 * Один растущий след: две его кромки, опорные точки кривых и шаг движения.
 * `count` ограничивает число кадров, а `angle` задаёт направление поворота.
 */
export type Worm = {
  c1x: number; c1y: number; c2x: number; c2y: number;
  p1x: number; p1y: number; p2x: number; p2y: number;
  width: number; angle: number; count: number;
  transform: Matrix; step: Matrix;
};

/**
 * Создаёт начальное преобразование без поворота и смещения.
 * @returns Единичная матрица для нового следа.
 */
function identity(): Matrix {
  return { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
}

/**
 * Поворачивает существующую матрицу на заданный угол без выделения новой.
 * @param matrix Матрица, коэффициенты которой нужно изменить.
 * @param angle Угол поворота в радианах.
 * @returns Ничего; изменяет переданную матрицу.
 */
function rotate(matrix: Matrix, angle: number): void {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const a = cos * matrix.a + sin * matrix.c;
  const b = cos * matrix.b + sin * matrix.d;
  const c = -sin * matrix.a + cos * matrix.c;
  const d = -sin * matrix.b + cos * matrix.d;
  matrix.a = a;
  matrix.b = b;
  matrix.c = c;
  matrix.d = d;
}

/**
 * Применяет локальный шаг движения к текущему положению следа.
 * Масштаб в `step` постепенно укорачивает шаг; поворот меняет траекторию.
 * @param matrix Текущее положение и ориентация следа.
 * @param step Преобразование одного кадра.
 * @returns Ничего; обновляет `matrix` на месте.
 */
function prepend(matrix: Matrix, step: Matrix): void {
  const a = step.a * matrix.a + step.b * matrix.c;
  const b = step.a * matrix.b + step.b * matrix.d;
  const c = step.c * matrix.a + step.d * matrix.c;
  const d = step.c * matrix.b + step.d * matrix.d;
  const tx = step.tx * matrix.a + step.ty * matrix.c + matrix.tx;
  const ty = step.tx * matrix.b + step.ty * matrix.d + matrix.ty;
  matrix.a = a;
  matrix.b = b;
  matrix.c = c;
  matrix.d = d;
  matrix.tx = tx;
  matrix.ty = ty;
}

/**
 * Добавляет след в точке движения указателя. Направление берётся из вектора
 * движения, а небольшой случайный угол делает траекторию живой.
 * @param worms Активные следы, в которые добавляется новый.
 * @param x Горизонтальная координата указателя на canvas.
 * @param y Вертикальная координата указателя с учётом прокрутки.
 * @param vx Горизонтальная составляющая движения указателя.
 * @param vy Вертикальная составляющая движения указателя.
 * @param distance Длина движения, определяющая начальную ширину следа.
 * @returns Ничего; добавляет след и ограничивает список сотней элементов.
 */
export function createWorm(worms: Worm[], x: number, y: number, vx: number, vy: number, distance: number): void {
  const transform = identity();
  rotate(transform, -Math.atan2(vx, vy));
  transform.tx = x;
  transform.ty = y;

  const step: Matrix = { a: 0.95, b: 0, c: 0, d: 0.95, tx: 12, ty: 0 };
  const halfWidth = 0.5;
  const edge1x = -halfWidth * transform.c + transform.tx;
  const edge1y = -halfWidth * transform.d + transform.ty;
  const edge2x = halfWidth * transform.c + transform.tx;
  const edge2y = halfWidth * transform.d + transform.ty;
  const randomAngle = Math.PI / 64 + Math.random() * (Math.PI / 6 - Math.PI / 64);

  worms.push({
    c1x: edge1x, c1y: edge1y, c2x: edge2x, c2y: edge2y,
    p1x: edge1x, p1y: edge1y, p2x: edge2x, p2y: edge2y,
    width: distance / 20,
    angle: Math.random() > 0.5 ? randomAngle : -randomAngle,
    count: 0,
    transform,
    step,
  });

  if (worms.length > 100) worms.shift();
}

/**
 * Продвигает след на один шаг и закрашивает ленту между его двумя кромками.
 * Квадратичные кривые сглаживают стыки кадров; новые точки станут опорными
 * для следующего кадра. Иногда угол меняет знак, образуя извилистый рисунок.
 * @param context Контекст canvas, на котором рисуется след.
 * @param worm Изменяемое состояние одного следа.
 * @returns Ничего; рисует сегмент и обновляет точки следа.
 */
export function drawWorm(context: CanvasRenderingContext2D, worm: Worm): void {
  if (Math.random() > 0.9) {
    rotate(worm.step, -worm.angle * 2);
    worm.angle *= -1;
  }
  prepend(worm.transform, worm.step);

  const edge1x = -worm.width * worm.transform.c + worm.transform.tx;
  const edge1y = -worm.width * worm.transform.d + worm.transform.ty;
  const mid1x = (worm.c1x + edge1x) / 2;
  const mid1y = (worm.c1y + edge1y) / 2;
  const edge2x = worm.width * worm.transform.c + worm.transform.tx;
  const edge2y = worm.width * worm.transform.d + worm.transform.ty;
  const mid2x = (worm.c2x + edge2x) / 2;
  const mid2y = (worm.c2y + edge2y) / 2;

  context.beginPath();
  context.moveTo(worm.p1x, worm.p1y);
  context.quadraticCurveTo(worm.c1x, worm.c1y, mid1x, mid1y);
  context.lineTo(mid2x, mid2y);
  context.quadraticCurveTo(worm.c2x, worm.c2y, worm.p2x, worm.p2y);
  context.closePath();
  context.fill();

  worm.c1x = edge1x;
  worm.c1y = edge1y;
  worm.p1x = mid1x;
  worm.p1y = mid1y;
  worm.c2x = edge2x;
  worm.c2y = edge2y;
  worm.p2x = mid2x;
  worm.p2y = mid2y;
}
