# 松櫻祭 · 官網

Public information and the campus-map prototype. React / TypeScript / Vite; static
GitHub Pages deployment only. Game PWA: https://github.com/fearnot221/evergreenbloom-pwa
(separate build, Docker deployment). Content and official-brand boundaries remain
prototype/TBD; this is not yet the official university website.

## Develop and validate

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

No application server, database or game service is required to read the website.
The public 3D map still loads on demand. Known route entry HTML is generated during
build, so Pages can serve direct links; this does not prerender React content.

## GitHub Pages

Repository Settings → Pages → Source: **GitHub Actions**. `.github/workflows/pages.yml`
checks, builds, uploads `dist` and deploys on main pushes or manual dispatch. Its
`configure-pages` output selects the correct base for either project Pages or a custom
domain. Default address: https://fearnot221.github.io/evergreenbloom/

Optional repository Actions variable `VITE_PWA_URL`: the game's public HTTPS origin,
for example `https://play.example.org` (example only, not an assigned address).
Leave empty until hosting is ready: `/play` displays that the URL is not announced.
After setting it, rerun the Pages deployment. QR claims arriving via the old
`/game` or `/stamp/:spot?k=...` entry are forwarded to the game when configured;
unknown paths use Pages' `404.html` and therefore retain HTTP 404 status.
Use the new game origin for all newly printed QR codes.

Local build settings are listed in `.env.example`:

```sh
VITE_BASE_PATH=/evergreenbloom/ npm run build
```

Both direct map-data downloads and JS fetches honor this base. Assets referenced
by CSS/HTML are rewritten by Vite. A custom domain needs its own DNS/Pages settings.

## Retiring the former combined PWA

`public/sw.js` unregisters the previous worker and removes only its festival offline
caches on activation. It does not delete localStorage. Existing offline installations
must reconnect to receive this change. Stamps saved under the old origin cannot be
read at the new game origin; this split does not migrate those prototype records.
Users should install the game from its new URL. Do not delete the retirement worker
until old installations are no longer supported.

## Maintenance

Design: [DESIGN.md](docs/DESIGN.md). Product: [PRODUCT.md](docs/PRODUCT.md).
Architecture: [ARCHITECTURE.md](docs/ARCHITECTURE.md). Checks and limitations:
[PROTOTYPE-NOTES.md](docs/PROTOTYPE-NOTES.md). Map sources and regeneration:
[MAP-DATA.md](docs/MAP-DATA.md). Display copy remains in `src/data/display-copy.ts`;
run `npm run fonts` with the required source font when adding display glyphs.
