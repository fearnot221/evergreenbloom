import type {CampusFeature,FestivalLayer} from '../geo/types';
export const CAMPUS_URL='/data/ncu-campus.json';
export const festivalLayer:FestivalLayer={editionId:'upcoming-tbd',revision:'empty-1',zones:[],closures:[]};
/** Rendering assumptions are deliberately not baked into the geographic dataset. */
export function buildingHeight(feature:CampusFeature){const h=feature.tags.height,levels=feature.tags['building:levels'];if(h&&/^\d+(\.\d+)?\s*(m)?$/.test(h)){const meters=parseFloat(h);if(meters>0&&meters<200)return {meters,basis:'OSM height (not surveyed)' as const};}if(levels&&/^\d+(\.\d+)?$/.test(levels)){const count=Number(levels);if(count>0&&count<60)return {meters:count*3.2,basis:'OSM levels × assumed 3.2 m' as const};}return {meters:12,basis:'visual default 12 m' as const};}
export function pathWidth(feature:CampusFeature){const width=Number(feature.tags.width);return width>0&&width<40?width:feature.type==='Road'?7:2.5;}
