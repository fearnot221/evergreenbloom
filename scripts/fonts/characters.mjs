import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(tsx?|json)$/.test(entry.name) ? [full] : [];
  });
}

/** Every non-ASCII character in src plus printable ASCII, sorted and de-duplicated. */
export function collectCharacters(root = 'src') {
  const set = new Set();
  for (let c = 0x20; c < 0x7f; c++) set.add(String.fromCharCode(c));
  for (const file of walk(root)) {
    for (const ch of fs.readFileSync(file, 'utf8')) {
      if (ch.codePointAt(0) > 0x7f && !/\s/u.test(ch)) set.add(ch);
    }
  }
  return [...set].sort().join('');
}
