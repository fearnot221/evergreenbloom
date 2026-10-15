// Builds the self-hosted display font: a Noto Sans TC Black (OFL-1.1) subset that
// contains only the characters used in the application source.
//
// Usage: node scripts/fonts/build-display-font.mjs <path-to-NotoSansTC-Black.ttf>
// Source: https://github.com/google/fonts/tree/main/ofl/notosanstc (variable font,
// instanced at wght=900 with `fonttools varLib.instancer NotoSansTC[wght].ttf wght=900`).
// Requires fonttools with brotli; set PYFTSUBSET to use a specific pyftsubset binary.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { collectCharacters } from './characters.mjs';

const source = process.argv[2];
if (!source || !fs.existsSync(source)) {
  console.error('Pass the path to NotoSansTC-Black.ttf (see header comment).');
  process.exit(1);
}
const chars = collectCharacters();
fs.mkdirSync('public/fonts', { recursive: true });
const textFile = path.join('public/fonts', 'songying-display.chars.txt');
fs.writeFileSync(textFile, chars);
execFileSync(process.env.PYFTSUBSET || 'pyftsubset', [
  source,
  `--text-file=${textFile}`,
  '--flavor=woff2',
  '--layout-features=kern,palt,vpal,halt',
  '--no-hinting',
  '--desubroutinize',
  '--output-file=public/fonts/songying-display.woff2',
]);
const size = fs.statSync('public/fonts/songying-display.woff2').size;
console.log(`Display font: ${[...chars].length} characters, ${(size / 1024).toFixed(1)} KiB`);
