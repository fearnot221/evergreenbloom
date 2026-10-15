import { geoToCampus, pairToGeo } from '../geo/coordinates';
import type { CampusDataset, CampusFeature } from '../geo/types';
import { mapPalette } from './map-data';

/** Static SVG plan of the same geographic data; shown while 3D loads or if it fails. */
export function FlatMap({ data }: { data: CampusDataset }) {
  const palette = mapPalette();
  const point = (p: number[]) => {
    const q = geoToCampus(pairToGeo(p));
    return `${q.x},${-q.y}`;
  };
  const fillFor = (f: CampusFeature) =>
    f.type === 'CampusBoundary'
      ? palette.campus
      : f.type === 'Building'
        ? palette.building
        : f.tags.natural === 'water'
          ? palette.water
          : palette.green;
  return (
    <svg
      className="flat-campus"
      viewBox="-760 -470 1520 940"
      role="img"
      aria-label="中央大學地理平面圖，北方朝上；地點資訊可由清單選取"
      style={{ background: palette.clear }}
    >
      <title>OpenStreetMap 中央大學校園輪廓</title>
      {data.features.map((f) => {
        const g = f.geometry;
        if (g.type === 'Point') return null;
        if (g.type === 'LineString')
          return (
            <polyline
              key={f.id}
              points={g.coordinates.map(point).join(' ')}
              fill="none"
              stroke={f.type === 'Road' ? palette.road : palette.walk}
              strokeWidth={f.type === 'Road' ? 7 : 2.5}
            />
          );
        const polygons = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
        return (
          <path
            key={f.id}
            d={polygons.map((p) => p.map((r) => `M${r.map(point).join('L')}Z`).join('')).join('')}
            fillRule="evenodd"
            fill={fillFor(f)}
            stroke={f.type === 'Building' ? palette.edge : 'none'}
            strokeWidth="1"
          />
        );
      })}
      <text x="-700" y="-390" fontSize="30" fontWeight="700" fill={palette.label}>
        北
      </text>
    </svg>
  );
}
