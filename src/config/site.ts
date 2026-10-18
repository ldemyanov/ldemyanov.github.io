import type { SiteConfig } from '~/types';

/**
 * ============================================================
 *  ЕДИНСТВЕННЫЙ ФАЙЛ, КОТОРЫЙ НУЖНО ИЗМЕНИТЬ СНАЧАЛА
 * ============================================================
 *
 * Здесь собран демонстрационный контент. Замените его своим — и данные
 * в шапке, подвале, первом экране, на странице контактов, в метаданных,
 * структурированных данных и карте сайта обновятся автоматически.
 *
 * Канонический URL задаётся в `astro.config.mjs` (параметр `site`), а сюда
 * передаётся через `import.meta.env.SITE`.
 */
export const siteConfig: SiteConfig = {
  name: 'Портфолио Леонида Демьянова',

  author: 'Демьянов Леонид',
  role: 'Fullstack-разработчик на TypeScript',
  title: 'Портфолио Fullstack-разработчика',
  description: 'Портфолио Леонида Демьянова, Fullstack-разработчика из Астаны. Создаю сайты, веб-приложения, интеграции и решения на основе ИИ для цифровых продуктов и бизнеса.',
  url: import.meta.env.SITE ?? 'https://ldemyanov.github.io',
  ogImage: '/og-default.png',
  locale: 'ru',
  themeColor: '#c8f14d',

  contact: {
    email: 'leonidemyanov@gmail.com',
    phone: '+7 (778) 813-1612',
    phoneHref: '+77788131612',
    location: 'Астана',
    availability: 'Доступен для работы на фрилансе и в штате',
    // Paste a Formspree / Web3Forms / Netlify endpoint here to make the
    // contact form live. See "Contact form" in the README.
    formEndpoint: '',
  },

  social: [
    { label: 'GitHub', href: 'https://github.com/ldemyanov', icon: 'github' },
  ],

  about: 'Fullstack-разработчик из Астаны. Создаю сайты и веб-приложения, настраиваю интеграции и автоматизирую процессы с помощью ИИ. В работе ценю продуманные решения, понятный код и результат, который помогает продукту расти.',

  copyrightHolder: 'Леонид Демьянов',
};

export default siteConfig;
