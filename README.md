# 松櫻祭 · Festival Web App prototype

React / TypeScript / Vite, with the chosen Bloom opening and a shared multi-page
shell. This is a functional prototype, not a published official festival website.
Official assets, upcoming dates/program, organizer identities and surveyed campus
data remain TBD. Icons are temporary digital artwork, not an official logo.

```sh
npm install
npm run dev -- --port 5173 --strictPort
```

Development: http://127.0.0.1:5173/ (service worker intentionally disabled).

```sh
npm run build
npm run preview -- --port 4173 --strictPort
```

**Full PWA preview:** http://127.0.0.1:4173/ . Build before preview. The build generates
`dist/sw.js` from the Vite dependency manifest. HTTPS or localhost is required for
service workers. Deployment must serve SPA routes with the application's HTML and
serve `sw.js` with update-friendly cache headers; the domain/hosting are not chosen.

Routes: `/`, `/about`, `/program`, `/events`, `/events/:id`, `/map`, `/news`,
`/news/:id`, `/team`, `/visit`. `/e` is a compatibility redirect to `/`.
`/motion` remains a development reference; A/B/C/D and the old index remain removed.

Try `/program?day=demo-a&category=activity` → “在地圖查看”, or open
`/map?location=lake-plaza`. The map uses arbitrary prototype geometry and no real
geographic coordinates. It supports selection, camera controls and an equivalent
location list. No pedestrian routing, GPS permission, AR or accessibility claim.

Content maintenance:

- `src/content.ts`: existing festival story and historical context.
- `src/data/model.ts`: domain entities and future routing contracts.
- `src/data/festival.ts`: a single typed, revisioned prototype content snapshot.
- `src/map/map-data.ts`: replaceable visual geometry and coordinate-frame metadata.
- `src/map/engine.ts`: lazy Three.js visualization, separate from domain/routing data.

To test offline, open the production preview online, expand “應用程式／離線”, and
select “儲存核心頁面”. Wait for successful confirmation, then go offline and reload
`/program`, an event detail, `/map`, or `/visit`. Unvisited core routes are included.
Three.js/map rendering modules and `/motion` are excluded; offline map selection
and event links work through the text list. Without a completed save, the installed
worker supplies a small offline fallback. A first-ever offline visit cannot work.

The service worker does not force activation or reload visitors. Updates wait for
old clients to close; the UI notes pending updates. After an update, save the new
core version again. Saved content is a build snapshot, not live event information;
browser storage may be cleared. Native installation depends on platform support.

See [prototype notes](docs/PROTOTYPE-NOTES.md) for current validation and limitations,
and [architecture](docs/ARCHITECTURE.md) for implemented boundaries versus future
navigation work. Final `DESIGN.md` and official branding are still open.
