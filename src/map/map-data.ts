import type { CampusFeature, FestivalLayer } from '../geo/types';
export const CAMPUS_URL = '/data/ncu-campus.json';
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
 * Map colour tokens. Three.js cannot parse OKLCH, so the spring-sky and night-sky
 * palettes are mirrored here as hex. Keep them in step with src/styles/tokens.css.
 */
const lightPalette = {
  clear: '#cfd4f6',
  campus: '#f8eff7',
  building: '#fffafd',
  edge: '#a690b4',
  water: '#a3b9ef',
  green: '#ddd7f3',
  sport: '#f2cadd',
  road: '#cdb9d7',
  walk: '#ab7aa3',
  marker: '#a33a6e',
  seed: '#e07aa8',
  label: '#4a3150',
  ambient: '#ffffff',
  sun: '#fff6fa',
} as const;
const darkPalette = {
  clear: '#25244a',
  campus: '#312d55',
  building: '#4a4372',
  edge: '#8b80b6',
  water: '#3d4f90',
  green: '#3a3764',
  sport: '#5a3a5f',
  road: '#5d507f',
  walk: '#c48ab8',
  marker: '#f0a3c6',
  seed: '#ff9cc6',
  label: '#f3e9f4',
  ambient: '#d9d4ff',
  sun: '#ffe9f4',
} as const;
export type MapPalette = { [K in keyof typeof lightPalette]: string };
export function mapPalette(): MapPalette {
  return matchMedia('(prefers-color-scheme: dark)').matches ? darkPalette : lightPalette;
}
