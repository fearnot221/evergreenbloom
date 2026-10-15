import { display } from '../data/display-copy';

export type NavItem = { to: keyof typeof display.nav; label: string; en: string };

/** All destinations, in reading order. Labels come from the serif display copy. */
export const primaryNav: NavItem[] = [
  { to: '/', label: display.nav['/'], en: 'Home' },
  { to: '/about', label: display.nav['/about'], en: 'Story' },
  { to: '/news', label: display.nav['/news'], en: 'News' },
  { to: '/program', label: display.nav['/program'], en: 'Program' },
  { to: '/events', label: display.nav['/events'], en: 'Events' },
  { to: '/map', label: display.nav['/map'], en: 'Campus' },
  { to: '/visit', label: display.nav['/visit'], en: 'Visit' },
  { to: '/team', label: display.nav['/team'], en: 'Team' },
];

/** The three task destinations shown inline in the desktop header. */
export const quickNav = primaryNav.filter((item) =>
  ['/news', '/program', '/map'].includes(item.to),
);
