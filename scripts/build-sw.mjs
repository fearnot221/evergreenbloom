import crypto from 'node:crypto';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('dist/.vite/manifest.json', 'utf8'));
const core = new Set([
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/data/ncu-campus.json',
  '/data/LICENSE.txt',
  '/fonts/songying-serif.woff2',
  '/fonts/songying-poster.woff2',
]);
const visited = new Set();
function walk(key) {
  if (visited.has(key) || /src\/map\/(engine|RoutingDebug)\.(ts|tsx)$/.test(key)) return;
  visited.add(key);
  const item = manifest[key];
  if (!item) return;
  core.add(`/${item.file}`);
  for (const file of item.css || []) core.add(`/${file}`);
  for (const dep of item.imports || []) walk(dep);
  for (const dep of item.dynamicImports || []) walk(dep);
}
walk('index.html');
// Three.js is reachable only through the excluded renderer modules, never precached.
const urls = [...core];
const version = crypto
  .createHash('sha256')
  .update(JSON.stringify(urls))
  .update(fs.readFileSync('dist/data/ncu-campus.json'))
  .update(fs.readFileSync('dist/data/LICENSE.txt'))
  .update(fs.readFileSync('dist/fonts/songying-serif.woff2'))
  .update(fs.readFileSync('dist/fonts/songying-poster.woff2'))
  .digest('hex')
  .slice(0, 12);
const worker =
  `const VERSION=${JSON.stringify(version)},CORE='songying-core-'+VERSION,SHELL='songying-shell-'+VERSION;\nconst URLS=${JSON.stringify(urls)};\n` +
  fs.readFileSync('scripts/sw-template.js', 'utf8');
fs.writeFileSync('dist/sw.js', worker);
fs.writeFileSync('dist/offline-core.json', JSON.stringify({ version, urls }, null, 2));
console.log('PWA core:', urls.length, 'files, version', version);
