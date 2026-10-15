// Builds the two self-hosted display subsets (SIL OFL 1.1, see public/fonts/OFL.txt):
//   songying-serif.woff2  Noto Serif TC Black, editorial titles and statements
//   songying-poster.woff2 Noto Sans TC Black, wordmark and official-post lettering
//
// Usage: node scripts/fonts/build-display-font.mjs <NotoSerifTC-Black.ttf> <NotoSansTC-Black.ttf>
// Sources: google/fonts ofl/notoseriftc and ofl/notosanstc variable fonts, instanced at
// wght=900 with `fonttools varLib.instancer <font> wght=900`. Requires fonttools with
// brotli; set PYFTSUBSET to use a specific pyftsubset binary.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { collectCharacters, subsets } from './characters.mjs';

const [serif, sans] = process.argv.slice(2);
const sources = { 'songying-serif': serif, 'songying-poster': sans };
for (const [name, source] of Object.entries(sources)) {
  if (!source || !fs.existsSync(source)) {
    console.error('Usage: build-display-font.mjs <NotoSerifTC-Black.ttf> <NotoSansTC-Black.ttf>');
    process.exit(1);
  }
  const chars = collectCharacters(subsets[name]);
  const textFile = `public/fonts/${name}.chars.txt`;
  fs.writeFileSync(textFile, chars);
  execFileSync(process.env.PYFTSUBSET || 'pyftsubset', [
    source,
    `--text-file=${textFile}`,
    '--flavor=woff2',
    // Proportional and vertical forms: palt for horizontal headlines, vert/vrt2/vpal/vkrn
    // for vertical-rl titles so punctuation rotates and sits correctly.
    '--layout-features=kern,palt,halt,vert,vrt2,vpal,vkrn,vhal',
    '--no-hinting',
    '--desubroutinize',
    `--output-file=public/fonts/${name}.woff2`,
  ]);
  const size = fs.statSync(`public/fonts/${name}.woff2`).size;
  console.log(`${name}: ${[...chars].length} characters, ${(size / 1024).toFixed(1)} KiB`);
}
