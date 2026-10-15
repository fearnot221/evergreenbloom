# 松櫻祭 · Festival Web App prototype

React 19 / TypeScript / Vite 8 multi-page app for the second edition (第二屆) of
松櫻祭 at National Central University. It is a functional prototype, not the official
festival website. Upcoming dates, program, venues and organizer identities remain TBD;
events and program slots are clearly labelled fictional test data.

```sh
npm install
npm run dev -- --port 5173 --strictPort
```

Development: http://127.0.0.1:5173/ (service worker intentionally disabled).

```sh
npm run build
npm run preview -- --port 4173 --strictPort
```

Full PWA preview: http://127.0.0.1:4173/ (build first). The build generates `dist/sw.js`
from the Vite manifest. HTTPS or localhost is required for service workers. Deployment
must serve SPA routes with the application HTML and serve `sw.js` with update-friendly
cache headers; domain and hosting are not chosen.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` / `build` / `preview` | Vite dev server, production build + service worker, local preview |
| `npm run lint` / `npm run format` | Biome lint + format check / apply safe fixes |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (content, source hygiene, route rendering) + geo/routing node tests |
| `npm run check` | lint, typecheck and tests together (what CI runs before `build`) |
| `npm run fonts -- <NotoSansTC-Black.ttf>` | Rebuild the display-font subset after adding new copy |
| `npm run map:fetch` / `map:data` / `map:test` | Campus data pipeline, see [MAP-DATA.md](docs/MAP-DATA.md) |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests and build on pushes to `main`
and on pull requests.

## Routes

`/`, `/about`, `/news`, `/news/:id`, `/program`, `/events`, `/events/:id`, `/map`,
`/visit`, `/team`. `/e` redirects to `/`. Unknown paths render a not-found page.
Every page is its own lazy chunk.

Try `/program?day=demo-a&category=activity`, then 在地圖查看, or open
`/map?location=lake-plaza`. The map renders OpenStreetMap campus geometry (not surveyed);
there is no public pedestrian routing, GPS permission request, AR or accessibility claim.

## Source layout

| Path | Owns |
| --- | --- |
| `src/app/` | Shell: header, routes, mobile tab bar and 更多 sheet, footer, route focus/scroll |
| `src/pages/` | One component per route |
| `src/components/` | Page header, cards, announcement triptych, motifs, icon re-exports |
| `src/styles/` | `tokens.css` (all design tokens), `base`, `shell`, `components`, `home`, `pages` |
| `src/data/` | `content.ts` (story copy), `festival.ts` (typed snapshot), `model.ts` (domain types) |
| `src/map/`, `src/geo/` | Lazy Three.js renderer, flat SVG fallback, coordinate frames, dev routing |
| `src/pwa/` | Service-worker registration and the explicit offline-save panel |

Design direction and tokens: [DESIGN.md](docs/DESIGN.md). Architecture and boundaries:
[ARCHITECTURE.md](docs/ARCHITECTURE.md). Latest verification:
[PROTOTYPE-NOTES.md](docs/PROTOTYPE-NOTES.md).

## Display font

Headlines use a self-hosted subset of Noto Sans TC Black (SIL OFL 1.1, license in
`public/fonts/OFL.txt`) that contains only characters present in `src/`. A test fails
when new copy introduces a character the subset lacks; rebuild with:

```sh
npm run fonts -- path/to/NotoSansTC-Black.ttf
```

The source is the Noto Sans TC variable font from google/fonts, instanced at `wght=900`
with `fonttools varLib.instancer`. `pyftsubset` needs Brotli; set `PYFTSUBSET` to a
specific binary if the default one lacks it.

## Offline

Open the production preview online and use 應用程式與離線閱讀 in the footer (or the
更多 sheet on mobile) to save core pages. After a successful save you can go offline and
reload `/program`, an event detail, `/map` (flat plan and list) or `/visit`. Three.js is
never precached. Without a save the worker serves a small offline page; a first-ever
offline visit cannot work. Updates wait for old tabs to close; save again afterwards.
