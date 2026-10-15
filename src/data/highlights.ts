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
    src: '/photo/LeonidDemyanov.webp',
    alt: 'Robin Vale, art director, photographed against a plain studio wall',
    width: 960,
    height: 1210,
  },
  aside: {
    roleLine: ['Разрабатываю сайты и ПО с 2018 года.', '4 года опыта работы в найме'],
    title: ['Fullstack', 'Typescript Developer'],
    /** Small avatar stack — decorative, so the images carry empty alt text. */
    stack: ['/images/avatar-02.webp', '/images/avatar-01.webp', '/images/avatar-03.webp'],
    stackBadge: undefined as string | undefined,
    kpi: undefined as string | undefined,
    kpiLabel: undefined as string | undefined,
    note: undefined as string | undefined,
  },
};

export const collaborate = {
  eyebrow: 'Поработаем вместе?',
  title: 'Помогаю команде справляться со сложными задачами — от идеи до готового решения.',
  body: 'Готов подключиться к командной разработке или самостоятельно реализовать проект под ключ — от идеи до запуска.',
  badge: 'Independent since 2011',
  ctaLabel: 'Send me the brief',
  ctaHref: '/contact/',
  /**
   * The staggered pair beside the copy. Swap these for the bundled SVG
   * mockups (`BookletMock`, `TabletMock` in src/components/art/) if you would
   * rather show artwork than photography — see the README.
   */
  images: [
    {
      src: '/photo/SpaceCraft.webp',
      alt: 'Two colleagues standing in a bright office, reviewing work together on a tablet',
      width: 760,
      height: 760,
    },
    {
      src: '/photo/Meeting.webp',
      alt: 'Two colleagues talking over an open laptop at a meeting table',
      width: 760,
      height: 760,
    },
  ],
};

export const about = {
  eyebrow: 'Обо мне',
  title: 'Могу усилить команду или взять проект целиком.',
  body: 'В приоритете — работа в продуктовой команде. Также готов подключаться к задачам малого бизнеса и самостоятельно разрабатывать веб-проекты под ключ. Работаю в офисе в Астане или удалённо.',
  points: [
    'Ищу возможность развивать продукт вместе с командой.',
    'Готов к офисной работе в Астане или удалённому формату.',
    'Могу самостоятельно реализовать веб-проект под ключ.',
  ],
  image: {
    src: '/images/about-studio.webp',
    alt: 'Designers arranging sticky notes and printed layouts across a studio table',
    width: 900,
    height: 954,
  },
  badge: {
    value: 'Fullstack',
    label: 'От интерфейса и API до баз данных, интеграций и автоматизации.',
  },
  ctaLabel: 'Мои проекты',
  ctaHref: '/work/',
};

export const servicesHeading = {
  eyebrow: 'Услуги',
  title: 'Разработка для бизнеса и продуктовых команд.',
  ctaLabel: 'Обсудить задачу',
  ctaHref: '/contact/',
};

export const workHeading = {
  eyebrow: 'Selected work',
  title: 'Six projects, six different arguments.',
};

export const journalHeading = {
  eyebrow: 'Notebook',
  title: 'Things I keep having to explain.',
  ctaLabel: 'Every article',
  ctaHref: '/journal/',
};

export const cta = {
  title: 'Have you got something that deserves doing properly?',
  body: 'Tell me what is broken, who it is breaking for, and what happens if it stays that way. That is enough for me to come back with a scope and a number.',
  primaryLabel: 'Send the brief',
};
