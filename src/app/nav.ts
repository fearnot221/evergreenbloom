export type NavItem = { to: string; label: string };

/** Primary destinations, in reading order. Labels stay short enough for one line. */
export const primaryNav: NavItem[] = [
  { to: '/', label: '首頁' },
  { to: '/about', label: '故事' },
  { to: '/news', label: '消息' },
  { to: '/program', label: '節目' },
  { to: '/events', label: '活動' },
  { to: '/map', label: '地圖' },
  { to: '/visit', label: '來訪' },
  { to: '/team', label: '團隊' },
];

/** Destinations shown in the mobile "更多" sheet (the rest live in the tab bar). */
export const sheetNav = primaryNav.filter((item) =>
  ['/about', '/events', '/visit', '/team'].includes(item.to),
);
