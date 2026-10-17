import type { Award } from '~/types';

export const awards: Award[] = [
  { year: '2026', title: 'Независимый специалист года', detail: 'Ежегодная премия Design Council, арт-дирекшн', tag: 'Победитель' },
  { year: '2025', title: 'Интерфейс месяца', detail: 'Обновление отчётности Petrichor', tag: 'Отметили' },
  { year: '2025', title: 'За доступность', detail: 'Аудит оформления заказа Undergrove по WCAG 2.2 AA', tag: 'Награда' },
  { year: '2024', title: 'Ребрендинг года', detail: 'Региональная премия Regional Brand Awards, короткий список из 410 работ', tag: 'Финалист' },
  { year: '2023', title: 'Спикер: Type & Interface', detail: 'Доклад о состояниях интерфейса, которые редко попадают на скриншоты', tag: 'Доклад' },
];

export const awardsHeading = {
  eyebrow: 'Признание',
  title: 'Работы, которые заметили.',
};
