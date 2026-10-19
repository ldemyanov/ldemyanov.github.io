import type { ToolkitItem } from '~/types';

export const toolkit: ToolkitItem[] = [
  { icon: 'code', title: 'Языки и разметка', detail: 'HTML · CSS · JavaScript · TypeScript' },
  { icon: 'device', title: 'Фреймворки', detail: 'React · Next.js · Svelte · Vue' },
  { icon: 'workflow', title: 'Управление состоянием и данными', detail: 'Redux · MobX · Zustand · TanStack Query' },
  { icon: 'server-cog', title: 'Серверная часть и ORM', detail: 'NestJS · Sequelize · Prisma' },
  { icon: 'chart', title: 'Базы данных и очереди', detail: 'PostgreSQL · MongoDB · RabbitMQ' },
  { icon: 'database-search', title: 'Поиск логов и аналитика', detail: 'Elasticsearch · Kibana' },
  { icon: 'grid', title: 'Сборка и микрофронтенды', detail: 'Webpack · Module Federation · Vite · Rollup' },
  { icon: 'flag', title: 'Контейнеризация', detail: 'Docker' },
];

export const toolkitHeading = {
  eyebrow: 'Технический стек',
  title: 'Инструменты для разработки продукта целиком.',
  intro: 'От пользовательского интерфейса и серверной логики до хранения данных, интеграций и сборки приложений.',
};
