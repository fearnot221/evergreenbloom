/**
 * Strings set in the poster face (Noto Sans TC Black subset): the wordmark and the
 * official-post lettering. Keep this list short; every character here ships in
 * public/fonts/songying-poster.woff2. Run `npm run fonts` after editing.
 */
export const poster = {
  wordmark: '松櫻祭',
  school: '國立中央大學',
  edition: '第二屆',
  topics: {
    briefing: ['活動', '說明會'],
    'crew-recruitment': ['工人', '招募'],
    'partner-shops': ['特約', '商店'],
  },
} as const;
