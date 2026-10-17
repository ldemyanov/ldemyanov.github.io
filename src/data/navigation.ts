import type { NavItem } from '~/types';

/**
 * Primary navigation.
 *
 * `anchor` is used only on the homepage: when the visitor is already on
 * `/`, the link jumps to that section instead of reloading the page.
 */
export const primaryNav: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Обо мне', href: '/about/', anchor: '#about' },
  { label: 'Услуги', href: '/services/', anchor: '#services' },
  { label: 'Работы', href: '/work/', anchor: '#work' },
  { label: 'Контакты', href: '/contact/' },
];

/** Extra links shown only in the mobile drawer. */
export const mobileExtraNav: NavItem[] = [
  { label: 'Технологии', href: '/about/#toolkit' },
];

export const footerNav = {
  explore: [
    { label: 'Обо мне', href: '/about/' },
    { label: 'Услуги', href: '/services/' },
    { label: 'Проекты', href: '/work/' },
    { label: 'Контакты', href: '/contact/' },
  ] satisfies NavItem[],
  legal: [
    { label: 'Конфиденциальность', href: '/privacy/' },
    { label: 'Условия', href: '/terms/' },
    { label: 'RSS', href: '/rss.xml' },
  ] satisfies NavItem[],
};
