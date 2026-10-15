import fs from 'node:fs';
import zlib from 'node:zlib';
import { distance, ORIGIN, pairToGeo } from '../../src/geo/coordinates.ts';
import { route } from '../../src/geo/routing.ts';

const data = JSON.parse(fs.readFileSync('data/campus/normalized.json'));
if (
  JSON.stringify(data.origin) !==
  JSON.stringify({ longitude: ORIGIN.longitude, latitude: ORIGIN.latitude })
)
  throw Error('Projection origin/version needs review');
const keys = [
  'height',
  'width',
  'building:levels',
  'building',
  'highway',
  'natural',
  'water',
  'landuse',
  'leisure',
  'sport',
  'surface',
  'access',
  'foot',
  'wheelchair',
  'stairs',
  'incline',
  'indoor',
  'layer',
  'bridge',
  'tunnel',
  'oneway:foot',
  'entrance',
  'barrier',
];
const features = data.features.map((f) => ({
  ...f,
  tags: Object.fromEntries(Object.entries(f.tags).filter(([key]) => keys.includes(key))),
}));
const application = { ...data, features: features.map(({ nodeMetadata, ...f }) => f) };
fs.mkdirSync('public/data', { recursive: true });
fs.writeFileSync('public/data/ncu-campus.json', JSON.stringify(application));
const nodes = new Map(),
  edges = [];
for (const f of features) {
  if (
    !['Road', 'Walkway'].includes(f.type) ||
    (f.tags.highway === 'cycleway' && !['yes', 'designated', 'permissive'].includes(f.tags.foot))
  )
    continue;
  const t = f.tags;
  f.nodeIds.forEach((id, i) => {
    const meta = f.nodeMetadata?.[id] ?? {};
    nodes.set(id, {
      id,
      geographic: pairToGeo(f.geometry.coordinates[i]),
      barrier: meta.barrier ?? null,
      access: meta.access ?? null,
      foot: meta.foot ?? null,
    });
  });
  for (let i = 1; i < f.nodeIds.length; i++) {
    const from = f.nodeIds[i - 1],
      to = f.nodeIds[i],
      length = distance(nodes.get(from).geographic, nodes.get(to).geographic);
    if (from === to || length < 0.01) continue;
    edges.push({
      id: `${f.id}:${i - 1}`,
      from,
      to,
      distanceMeters: Math.round(length * 100) / 100,
      sourceFeatureId: f.id,
      pathType: t.highway,
      foot: t.foot ?? null,
      access: t.access ?? null,
      stairs: t.highway === 'steps' ? true : null,
      indoor: t.indoor === 'yes' ? true : t.indoor === 'no' ? false : null,
      wheelchair: t.wheelchair ?? null,
      incline: t.incline ?? null,
      layer: t.layer ?? null,
      bridge: t.bridge ?? null,
      tunnel: t.tunnel ?? null,
      onewayFoot: t['oneway:foot'] ?? null,
      temporaryAvailability: 'unknown',
    });
  }
}
const graph = {
  revision: data.revision,
  nodes: [...nodes.values()],
  edges,
  warnings: [
    'Community topology only; unverified pedestrian access. No snapping across gaps/intersections.',
  ],
};
const adj = new Map(graph.nodes.map((n) => [n.id, []]));
for (const e of graph.edges) {
  adj.get(e.from).push(e.to);
  adj.get(e.to).push(e.from);
}
const todo = new Set(adj.keys()),
  components = [];
while (todo.size) {
  const queue = [todo.values().next().value],
    found = [];
  todo.delete(queue[0]);
  while (queue.length) {
    const n = queue.pop();
    found.push(n);
    for (const next of adj.get(n)) if (todo.delete(next)) queue.push(next);
  }
  components.push(found);
}
components.sort((a, b) => b.length - a.length);
const start = components[0]?.[0];
let best;
for (const n of components[0] ?? []) {
  const r = route(graph, start, n);
  if (r.status === 'found' && (!best || r.distanceMeters > best.distanceMeters)) best = r;
}
graph.debugExample = best ? { start, end: best.nodeIds.at(-1) } : null;
fs.writeFileSync(
  'data/campus/connectivity.json',
  `${JSON.stringify(
    {
      components: components.map((c) => c.length),
      experimentStart: start,
      experimentEnd: best?.nodeIds.at(-1),
    },
    null,
    2,
  )}\n`,
);
fs.writeFileSync('public/data/ncu-graph.json', JSON.stringify(graph));
// Small shared Location catalogue, not the full campus geometry in the app entry.
const ids = [
  ['lake-plaza', 'relation/7211880', '中大湖・區域參考', 'landmark'],
  ['ncu-library', 'way/202806573', '總圖書館', 'building'],
  ['ncu-admin', 'way/270806669', '行政大樓', 'building'],
  ['ncu-engineering-1', 'way/268841451', '工程一館', 'building'],
  ['ncu-track', 'relation/5951533', '操場', 'landmark'],
  ['ncu-gate', 'node/346111198', '校門管制點（OSM）', 'entrance'],
];
const locations = ids.map(([id, featureId, name, poiType]) => {
  const f = features.find((f) => f.id === featureId);
  if (!f) throw Error(`Missing location feature ${featureId}`);
  const ring =
    f.geometry.type === 'MultiPolygon'
      ? f.geometry.coordinates[0][0]
      : f.geometry.type === 'Polygon'
        ? f.geometry.coordinates[0]
        : [f.geometry.coordinates];
  const pts = ring.length > 1 ? ring.slice(0, -1) : ring;
  const geographic = pairToGeo(
    [0, 1].map((i) => pts.reduce((sum, p) => sum + p[i], 0) / pts.length),
  );
  return {
    id,
    name,
    aliases: [f.name].filter(Boolean),
    description: '位置依 OSM 來源幾何取得，僅作區域標示，不是已驗證入口、活動場地或導航終點。',
    poiType,
    status: 'historical',
    geographic,
    geographicStatus: 'community-maintained',
    anchorMethod: pts.length === 1 ? 'source-point' : 'vertex-mean-label-anchor',
    relatedFeatureId: featureId,
    relatedBuildingId: f.type === 'Building' ? featureId : null,
    entranceIds: [],
    navigationNodeIds: [],
    accessibility: 'unknown',
    source: `© OpenStreetMap contributors / ${f.source.id}`,
  };
});
fs.writeFileSync('src/data/campus-locations.json', `${JSON.stringify(locations, null, 2)}\n`);
const stats = {
  revision: data.revision,
  counts: Object.fromEntries(
    [...new Set(features.map((f) => f.type))].map((t) => [
      t,
      features.filter((f) => f.type === t).length,
    ]),
  ),
  nodes: nodes.size,
  edges: edges.length,
  bytes: fs.statSync('public/data/ncu-campus.json').size,
  gzipBytes: zlib.gzipSync(fs.readFileSync('public/data/ncu-campus.json')).length,
  graphBytes: fs.statSync('public/data/ncu-graph.json').size,
  graphGzipBytes: zlib.gzipSync(fs.readFileSync('public/data/ncu-graph.json')).length,
};
fs.writeFileSync('data/campus/stats.json', `${JSON.stringify(stats, null, 2)}\n`);
console.log(stats);
