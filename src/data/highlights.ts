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
    alt: 'Портрет Леонида Демьянова на нейтральном фоне',
    width: 960,
    height: 1210,
  },
  aside: {
    roleLine: ['Разрабатываю сайты и ПО с 2018 года.', '4 года опыта работы в найме'],
    title: ['Fullstack Typescript', 'Developer'],
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
  badge: 'Независимый разработчик с 2011 года',
  ctaLabel: 'Обсудить проект',
  ctaHref: '/contact/',
  /**
   * The staggered pair beside the copy. Swap these for the bundled SVG
   * mockups (`BookletMock`, `TabletMock` in src/components/art/) if you would
   * rather show artwork than photography — see the README.
   */
  images: [
    {
      src: '/photo/SpaceCraft.webp',
      alt: 'Коллеги обсуждают работу за планшетом в светлом офисе',
      width: 760,
      height: 760,
    },
    {
      src: '/photo/Meeting.webp',
      alt: 'Коллеги обсуждают проект за ноутбуком',
      width: 760,
      height: 760,
    },
  ],
};

export const about = {
  eyebrow: 'Обо мне',
  title: 'Могу усилить команду или взять проект целиком.',
  body: 'В приоритете — работа в продуктовой команде. Также готов подключаться к задачам малого бизнеса и самостоятельно разрабатывать веб-проекты под ключ. Работаю на территории работодателя или удалённо из Астаны.',
  points: [
    'Ищу возможность развивать продукт вместе с командой.',
    'Готов работать на территории работодателя или удалённо из Астаны.',
    'Могу самостоятельно реализовать веб-проект под ключ.',
  ],
  image: {
    src: '/images/about-studio.webp',
    alt: 'Дизайнеры раскладывают стикеры и макеты на рабочем столе',
    width: 900,
    height: 954,
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
  title: 'Разработка для бизнеса и продуктовых команд.',
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
