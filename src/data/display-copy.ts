/**
 * Every string set in the editorial serif (Noto Serif TC Black subset). Pages take
 * their titles and statements from here so the font subset stays small and complete.
 * Run `npm run fonts` after editing; a test fails if a character is missing.
 */
export const display = {
  home: {
    statement: ['讓春天，', '成為中央的日常。'],
    news: '第二屆，開始了。',
    edition: { numeral: '貳', status: '籌備中' },
    events: '春天裡，可以做什麼？',
    campus: ['走進', '中央'],
  },
  closing: ['在中央，', '等一個春天。'],
  nav: {
    '/': '首頁',
    '/about': '故事',
    '/news': '消息',
    '/program': '節目',
    '/events': '活動',
    '/map': '地圖',
    '/visit': '來訪',
    '/team': '團隊',
  },
  pages: {
    about: '祭典故事',
    news: '最新消息',
    program: '春日節目表',
    events: '活動一覽',
    map: '校園地圖',
    visit: '來訪須知',
    team: '一起，才成祭典',
    notFound: '迷路了嗎',
    error: '暫時打不開',
  },
  sections: {
    official: '官方社群公告',
    site: '本站說明',
    places: '祭典生長的地方',
    firstEdition: '第一個春天',
    before: '參與之前',
    faq: '常見問題',
    join: '想加入工作人員？',
    partners: '合作與贊助',
    about: '關於這個活動',
    more: '更多頁面',
    pick: '選一個地點',
  },
} as const;
