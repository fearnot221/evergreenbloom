import { useEffect, useRef, useState } from 'react';
import { geoToCampus, pairToGeo } from '../geo/coordinates';
import type { CampusDataset } from '../geo/types';
import { CAMPUS_URL } from '../map/map-data';

type Sketch = { buildings: string[]; water: string[]; paths: string[] };

function toSketch(data: CampusDataset): Sketch {
  const point = (p: number[]) => {
    const q = geoToCampus(pairToGeo(p));
    return `${q.x.toFixed(1)},${(-q.y).toFixed(1)}`;
  };
  const sketch: Sketch = { buildings: [], water: [], paths: [] };
  for (const f of data.features) {
    const g = f.geometry;
    if (g.type === 'Point') continue;
    if (g.type === 'LineString') {
      if (f.type === 'Road') sketch.paths.push(`M${g.coordinates.map(point).join('L')}`);
      continue;
    }
    const rings = (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).flat();
    const d = rings.map((r) => `M${r.map(point).join('L')}Z`).join('');
    if (f.type === 'Building') sketch.buildings.push(d);
    else if (f.tags.natural === 'water') sketch.water.push(d);
  }
  return sketch;
}

/**
 * A line drawing of the real campus (OpenStreetMap), drawn stroke by stroke as it
 * scrolls into view. Data loads only when the section approaches the viewport.
 */
export function CampusSketch() {
  const ref = useRef<HTMLDivElement>(null);
  const [sketch, setSketch] = useState<Sketch | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const abort = new AbortController();
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        fetch(CAMPUS_URL, { signal: abort.signal })
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error('campus'))))
          .then((data: CampusDataset) => setSketch(toSketch(data)))
          .catch(() => {});
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      abort.abort();
    };
  }, []);

  return (
    <div className="campus-sketch" ref={ref}>
      {sketch && (
        <svg viewBox="-760 -470 1520 940" role="img" aria-label="中央大學校園線稿，北方朝上">
          {sketch.water.map((d) => (
            <path key={d} d={d} className="sketch-water" />
          ))}
          {sketch.paths.map((d) => (
            <path key={d} d={d} pathLength={1} className="sketch-road" />
          ))}
          {sketch.buildings.map((d) => (
            <path key={d} d={d} pathLength={1} className="sketch-building" />
          ))}
        </svg>
      )}
    </div>
  );
}
