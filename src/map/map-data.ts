import type { CampusFeature, FestivalLayer } from '../geo/types';
export const CAMPUS_URL = `${import.meta.env.BASE_URL}data/ncu-campus.json`;
export const festivalLayer: FestivalLayer = {
  editionId: 'upcoming-tbd',
  revision: 'empty-1',
  zones: [],
  closures: [],
};
/** Rendering assumptions are deliberately not baked into the geographic dataset. */
export function buildingHeight(feature: CampusFeature) {
  const h = feature.tags.height,
    levels = feature.tags['building:levels'];
  if (h && /^\d+(\.\d+)?\s*(m)?$/.test(h)) {
    const meters = parseFloat(h);
    if (meters > 0 && meters < 200) return { meters, basis: 'OSM height (not surveyed)' as const };
  }
  if (levels && /^\d+(\.\d+)?$/.test(levels)) {
    const count = Number(levels);
    if (count > 0 && count < 60)
      return { meters: count * 3.2, basis: 'OSM levels × assumed 3.2 m' as const };
  }
  return { meters: 12, basis: 'visual default 12 m' as const };
}
export function pathWidth(feature: CampusFeature) {
  const width = Number(feature.tags.width);
  return width > 0 && width < 40 ? width : feature.type === 'Road' ? 7 : 2.5;
}

/**
 * Map colour tokens, v5 「櫻吹雪」. Three.js cannot parse OKLCH, so the roles are mirrored
 * here as hex. Keep them in step with src/styles/tokens.css: sakura pink is the field
 * (--bg, --bg-2, --sakura), pine-green ink the structure (--fg, --pine), and the hot rose
 * (--accent) marks only the selected location; other markers use --sakura-deep.
 */
const lightPalette = {
  clear: '#fddce7',
  campus: '#ffeff4',
  building: '#fff5f9',
  edge: '#05261a',
  water: '#f8bcd2',
  green: '#bbdac8',
  sport: '#f9cfdd',
  road: '#e9d4db',
  walk: '#69887c',
  marker: '#c1195a',
  seed: '#e993b2',
  label: '#05261a',
  ambient: '#ffffff',
  sun: '#fff5f9',
} as const;
const darkPalette = {
  clear: '#210c16',
  campus: '#2d131f',
  building: '#492a38',
  edge: '#ba9ba6',
  water: '#55263b',
  green: '#0e2a1f',
  sport: '#452030',
  road: '#402832',
  walk: '#aa8793',
  marker: '#fea6c5',
  seed: '#d97d9f',
  label: '#fde8ef',
  ambient: '#f4e3e8',
  sun: '#fef1f5',
} as const;
export type MapPalette = { [K in keyof typeof lightPalette]: string };
export function mapPalette(): MapPalette {
  return matchMedia('(prefers-color-scheme: dark)').matches ? darkPalette : lightPalette;
}
