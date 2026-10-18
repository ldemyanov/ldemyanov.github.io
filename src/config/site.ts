import type { SiteConfig } from '~/types';

/** Общие сведения о сайте, авторе и способах связи. */
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
    // Web3Forms browser-side access key. Configure it as
    // PUBLIC_WEB3FORMS_ACCESS_KEY in the build environment.
    web3FormsAccessKey: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ?? '',
  },

  social: [
    { label: 'GitHub', href: 'https://github.com/ldemyanov', icon: 'github' },
  ],

  about: 'Fullstack-разработчик из Астаны. Создаю сайты и веб-приложения, настраиваю интеграции и автоматизирую процессы с помощью ИИ. В работе ценю продуманные решения, понятный код и результат, который помогает продукту расти.',

  copyrightHolder: 'Леонид Демьянов',
};

export default siteConfig;
