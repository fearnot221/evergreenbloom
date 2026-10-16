import { snapshot } from '../data/festival';

/** Static host entry files; page contents still render with React in the browser. */
export const sitePaths = [
  '/',
  '/e',
  '/about',
  '/program',
  '/events',
  '/map',
  '/visit',
  '/team',
  '/play',
  '/partners',
  '/donate',
  '/news',
  '/game',
  ...snapshot.events.map((event) => `/events/${event.id}`),
  ...snapshot.announcements.map((item) => `/news/${item.id}`),
];
