import type { SiteConfig } from '~/types';

/**
 * ============================================================
 *  ЕДИНСТВЕННЫЙ ФАЙЛ, КОТОРЫЙ НУЖНО ИЗМЕНИТЬ СНАЧАЛА
 * ============================================================
 *
 * Здесь собран демонстрационный контент. Замените его своим — и данные
 * в шапке, подвале, первом экране, на странице контактов, в метаданных,
 * структурированных данных, RSS-ленте и карте сайта обновятся автоматически.
 *
 * Канонический URL задаётся в `astro.config.mjs` (параметр `site`), а сюда
 * передаётся через `import.meta.env.SITE`.
 */
export const siteConfig: SiteConfig = {
  name: 'Fullstack Typescript Developer | Демьянов Леонид | Портфолио',

  logo: {
    header: { src: '/images/header-logo.webp', width: 164, height: 58 },
    footer: { src: '/images/footer-logo.webp', width: 164, height: 58 },
  },

  author: 'Демьянов Леоинид',
  role: 'Fullstack Typescript Developer',
  title: 'Fullstack Typescript Developer Portfolio',
  description: 'Портфолио Леонида Демьянова, Fullstack-разработчика из Астаны. Создаю сайты, веб-приложения, интеграции и AI-автоматизации для цифровых продуктов и бизнеса.',
  url: import.meta.env.SITE ?? 'https://swp-freelancer-portfolio.vercel.app',
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
    { label: 'Dribbble', href: 'https://dribbble.com/', icon: 'dribbble' },
    { label: 'Behance', href: 'https://www.behance.net/', icon: 'behance' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
  ],

  about: 'Fullstack-разработчик из Астаны. Создаю сайты и веб-приложения, настраиваю интеграции и автоматизирую процессы с помощью AI. В работе ценю продуманные решения, понятный код и результат, который помогает продукту расти.',

  copyrightHolder: 'Fullstack Typescript Developer Portfolio',
};

export default siteConfig;
