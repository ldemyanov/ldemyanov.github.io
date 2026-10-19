/**
 * Copy blocks for the homepage sections that are one-of-a-kind.
 * Longer, repeating content lives in its own data file or content
 * collection instead.
 */

export const hero = {
  greeting: 'Привет. Меня зовут',
  /** Rendered on two lines. */
  nameLines: ['Демьянов', 'Леонид'],
  intro:
    'Разрабатываю сайты и веб-приложения для продуктовых команд и бизнеса — от идеи и архитектуры до готового решения.',
  ctaLabel: 'Связаться со мной',
  ctaHref: '/contact/',
  photo: {
    src: '/images/hero/leonid-demyanov.webp',
    srcSet: '/images/hero/leonid-demyanov-520.webp 520w, /images/hero/leonid-demyanov-680.webp 680w, /images/hero/leonid-demyanov-800.webp 800w, /images/hero/leonid-demyanov-900.webp 900w, /images/hero/leonid-demyanov.webp 1025w',
    alt: 'Портрет Леонида Демьянова на нейтральном фоне',
    width: 1025,
    height: 1024,
  },
  aside: {
    roleLine: ['Разрабатываю сайты и ПО с 2021 года.', 'Более 2 лет разрабатывал крупный продукт в команде'],
    title: ['Fullstack Typescript', 'Developer'],
    kpi: undefined as string | undefined,
    kpiLabel: undefined as string | undefined,
    note: undefined as string | undefined,
  },
};

export const collaborate = {
  eyebrow: 'Поработаем вместе?',
  title: 'Помогаю команде справляться со сложными задачами — от идеи до готового решения.',
  body: 'Готов подключиться к командной разработке или самостоятельно реализовать проект под ключ — от идеи до запуска.',
  badge: '4 года коммерческого опыта',
  ctaLabel: 'Обсудить проект',
  ctaHref: '/contact/',
  images: [
    {
      src: '/images/hero/spacecraft.webp',
      srcSet: '/images/hero/spacecraft-400.webp 400w, /images/hero/spacecraft-620.webp 620w, /images/hero/spacecraft-1000.webp 1000w, /images/hero/spacecraft.webp 2233w',
      alt: 'Коллеги обсуждают работу за планшетом в светлом офисе',
      width: 760,
      height: 760,
    },
    {
      src: '/images/hero/meeting.webp',
      srcSet: '/images/hero/meeting-400.webp 400w, /images/hero/meeting-620.webp 620w, /images/hero/meeting-1000.webp 1000w, /images/hero/meeting.webp 1812w',
      alt: 'Коллеги обсуждают проект за ноутбуком',
      width: 760,
      height: 760,
    },
  ],
};

export const about = {
  eyebrow: 'Обо мне',
  title: 'Могу усилить команду или взять проект целиком.',
  body: 'Как fullstack-разработчик, рассматриваю задачу целиком: от интерфейса и серверной логики до интеграций и запуска.',
  points: [
    'Более двух лет развивал крупный продукт вместе с командой.',
    'Готов работать на территории работодателя или удалённо из Астаны.',
    'Могу самостоятельно реализовать веб-проект под ключ.',
  ],
  image: {
    src: '/images/about/architecture.webp',
    srcSet: '/images/about/architecture-850.webp 850w, /images/about/architecture.webp 1200w',
    alt: 'Иллюстрация архитектуры веб-продукта: интерфейс, база данных, очередь и API',
    width: 1200,
    height: 896,
  },
  badge: {
    value: 'Полный цикл',
    label: 'От интерфейса и API до баз данных, интеграций и автоматизации.',
  },
  ctaLabel: 'Мои проекты',
  ctaHref: '/work/',
};

export const servicesHeading = {
  eyebrow: 'Услуги',
  title: 'Разработка в фриланс формате.',
  ctaLabel: 'Обсудить задачу',
  ctaHref: '/contact/',
};

export const workHeading = {
  eyebrow: 'Избранные проекты',
  title: 'Проекты, над которыми я работал.',
};

export const cta = {
  title: 'Есть задача, которую нужно решить качественно?',
  body: 'Расскажите, что нужно сделать, для кого и какой результат ожидаете. Этого достаточно, чтобы обсудить объём работы и стоимость.',
  primaryLabel: 'Обсудить проект',
};
