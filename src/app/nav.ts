import { display } from '../data/display-copy';

export type NavItem = { to: keyof typeof display.nav; label: string; en: string };

const item = (to: NavItem['to'], en: string): NavItem => ({ to, label: display.nav[to], en });

/** The site outline from the 松櫻季官網規劃 brief, in its order. */
export const primaryNav: NavItem[] = [
  item('/', 'Home'),
  item('/about', 'About'),
  item('/program', 'Schedule'),
  item('/events', 'Events'),
  item('/map', 'Map'),
  item('/play', 'Stamp Rally'),
  item('/partners', 'Partners'),
  item('/team', 'Team'),
  item('/donate', 'Donate'),
];

/** Pages outside the outline; linked from the footer only. */
export const secondaryNav: NavItem[] = [item('/news', 'News'), item('/visit', 'Visit')];

/** Shown inline in the desktop header; everything else lives in the menu. */
export const quickNav = primaryNav.filter((entry) =>
  ['/about', '/program', '/events', '/map', '/play', '/donate'].includes(entry.to),
);
