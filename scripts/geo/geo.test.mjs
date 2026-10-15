import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { campusToGeo, geoToCampus, geoToWorld, ORIGIN } from '../../src/geo/coordinates.ts';
import { gpsCandidates, route } from '../../src/geo/routing.ts';

const data = JSON.parse(fs.readFileSync('public/data/ncu-campus.json')),
  graph = JSON.parse(fs.readFileSync('public/data/ncu-graph.json'));
test('WGS84 origin, cardinal metric scale and round trip across campus', () => {
  assert.ok(Object.values(geoToCampus(ORIGIN)).every((v) => Math.abs(v) < 1e-9));
  // Independent ellipsoidal meridian/parallel length at 25°: ~110.77 m / 100.96 m per .001°.
  const n = geoToCampus({ ...ORIGIN, latitude: ORIGIN.latitude + 0.001 }),
    e = geoToCampus({ ...ORIGIN, longitude: ORIGIN.longitude + 0.001 });
  assert.ok(Math.abs(n.y - 110.77) < 0.1);
  assert.ok(Math.abs(e.x - 100.96) < 0.1);
  assert.ok(Math.abs(n.x) < 0.001);
  assert.ok(geoToWorld({ ...ORIGIN, latitude: ORIGIN.latitude + 0.001 }).z < 0);
  for (const longitude of [data.bbox[0], ORIGIN.longitude, data.bbox[2]])
    for (const latitude of [data.bbox[1], ORIGIN.latitude, data.bbox[3]]) {
      const r = campusToGeo(geoToCampus({ longitude, latitude }));
      assert.ok(Math.abs(r.latitude - latitude) < 1e-9);
      assert.ok(Math.abs(r.longitude - longitude) < 1e-9);
      assert.ok(Math.abs(r.altitude) < 1e-5);
    }
  assert.throws(() => geoToCampus({ latitude: NaN, longitude: 121 }));
  assert.throws(() => geoToCampus({ latitude: 91, longitude: 121 }));
});
test('Dataset retains source geometry, holes and no fabricated locations', () => {
  const lake = data.features.find((f) => f.id === 'relation/7211880');
  assert.equal(lake.geometry.coordinates[0].length, 2);
  for (const f of data.features) {
    assert.equal(f.source.classification, 'community-maintained');
    assert.ok(f.source.id);
    const polygons =
      f.geometry.type === 'Polygon'
        ? [f.geometry.coordinates]
        : f.geometry.type === 'MultiPolygon'
          ? f.geometry.coordinates
          : [];
    for (const p of polygons)
      for (const ring of p) {
        assert.deepEqual(ring[0], ring.at(-1));
        assert.ok(ring.length >= 4);
      }
    if (f.geometry.type === 'LineString')
      assert.equal(f.nodeIds.length, f.geometry.coordinates.length);
  }
  const loc = JSON.parse(fs.readFileSync('src/data/campus-locations.json'));
  assert.ok(
    loc.every(
      (l) =>
        !('world' in l) && l.geographic && data.features.some((f) => f.id === l.relatedFeatureId),
    ),
  );
});
test('Graph uses original path node adjacency, finite metric weights', () => {
  const ids = new Set(graph.nodes.map((n) => n.id));
  assert.equal(ids.size, graph.nodes.length);
  for (const e of graph.edges) {
    assert.ok(ids.has(e.from) && ids.has(e.to));
    assert.ok(e.distanceMeters > 0 && Number.isFinite(e.distanceMeters));
    const f = data.features.find((f) => f.id === e.sourceFeatureId);
    assert.ok(f.nodeIds.some((id, i) => id === e.from && f.nodeIds[i + 1] === e.to));
  }
  assert.ok(graph.edges.some((e) => e.wheelchair === null));
});
const node = (id, x) => ({
  id,
  geographic: campusToGeo({ x, y: 0 }),
  barrier: null,
  access: null,
  foot: null,
});
const edge = (id, from, to, distanceMeters) => ({
  id,
  from,
  to,
  distanceMeters,
  foot: null,
  access: null,
  temporaryAvailability: 'unknown',
  onewayFoot: null,
});
const fixture = {
  nodes: [node('a', 0), node('b', 10), node('c', 20), node('d', 200)],
  edges: [edge('ab', 'a', 'b', 10), edge('bc', 'b', 'c', 10), edge('ac', 'a', 'c', 50)],
  warnings: [],
};
test('Dijkstra picks shortest chain; closures, one-way, barriers and disconnected states', () => {
  assert.deepEqual(route(fixture, 'a', 'c').edgeIds, ['ab', 'bc']);
  assert.deepEqual(route(fixture, 'a', 'c', new Set(['bc'])).edgeIds, ['ac']);
  assert.equal(route(fixture, 'a', 'd').status, 'unreachable');
  assert.equal(route(fixture, 'missing', 'd').status, 'invalid');
  assert.deepEqual(route(fixture, 'a', 'a').nodeIds, ['a']);
  const restricted = structuredClone(fixture);
  restricted.edges.forEach((e) => {
    e.onewayFoot = 'yes';
  });
  assert.equal(route(restricted, 'c', 'a').status, 'unreachable');
  restricted.edges.forEach((e) => {
    e.foot = 'private';
  });
  assert.equal(route(restricted, 'a', 'c').status, 'unreachable');
  const blocked = structuredClone(fixture);
  blocked.nodes[2].barrier = 'wall';
  assert.equal(route(blocked, 'a', 'c').status, 'unreachable');
});
test('Real graph yields a multi-edge source-topology route', () => {
  let best = null;
  const start = JSON.parse(fs.readFileSync('data/campus/connectivity.json')).experimentStart;
  for (const n of graph.nodes) {
    const r = route(graph, start, n.id);
    if (r.status === 'found' && (!best || r.distanceMeters > best.distanceMeters)) best = r;
  }
  assert.ok(best && best.edgeIds.length > 10);
  console.log(
    'Real graph experiment',
    JSON.stringify({
      start,
      end: best.nodeIds.at(-1),
      edges: best.edgeIds.length,
      meters: best.distanceMeters,
    }),
  );
  fs.writeFileSync('data/campus/route-experiment.json', `${JSON.stringify(best, null, 2)}\n`);
});
test('GPS candidates honor uncertainty and access; no automatic permission', () => {
  assert.equal(gpsCandidates(fixture, ORIGIN, 200).status, 'unreliable');
  assert.equal(gpsCandidates(fixture, { latitude: 25.1, longitude: 121.5 }, 5).status, 'outside');
  assert.equal(gpsCandidates(fixture, campusToGeo({ x: 5, y: 0 }), 15).status, 'ambiguous');
  const privateGraph = structuredClone(fixture);
  privateGraph.edges.forEach((e) => {
    e.foot = 'private';
  });
  assert.equal(gpsCandidates(privateGraph, ORIGIN, 15).status, 'outside');
});
