import fs from 'node:fs';

/** Printable ASCII plus every non-ASCII, non-space character in the given files. */
export function collectCharacters(files) {
  const set = new Set();
  for (let c = 0x20; c < 0x7f; c++) set.add(String.fromCharCode(c));
  for (const file of files) {
    for (const ch of fs.readFileSync(file, 'utf8')) {
      if (ch.codePointAt(0) > 0x7f && !/\s/u.test(ch)) set.add(ch);
    }
  }
  return [...set].sort().join('');
}

/** Which source files feed which subset. Shared by the build script and tests. */
export const subsets = {
  'songying-serif': ['src/data/display-copy.ts', 'src/data/content.ts'],
  'songying-poster': ['src/data/poster-copy.ts'],
};
