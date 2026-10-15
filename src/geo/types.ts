import type { GeoCoordinate } from './coordinates';
export type FeatureType =
  | 'CampusBoundary'
  | 'Building'
  | 'Walkway'
  | 'Road'
  | 'OpenSpace'
  | 'Entrance'
  | 'POI'
  | 'FestivalZone';
export type Geometry =
  | { type: 'Point'; coordinates: number[] }
  | { type: 'LineString'; coordinates: number[][] }
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] };
export interface CampusFeature {
  id: string;
  type: FeatureType;
  name: string;
  geometry: Geometry;
  tags: Record<string, string>;
  nodeIds?: string[];
  source: {
    id: string;
    version: number;
    timestamp?: string;
    classification: 'community-maintained' | 'authoritative' | 'estimated' | 'prototype';
  };
}
export interface CampusDataset {
  id: string;
  revision: string;
  origin: GeoCoordinate;
  bbox: number[];
  source: {
    source: string;
    retrievedAt: string;
    license: string;
    attribution: string;
    licenseUrl: string;
  };
  features: CampusFeature[];
}
export interface FestivalLayer {
  editionId: string;
  revision: string;
  zones: CampusFeature[];
  closures: {
    edgeId: string;
    reason: string;
    from: string | null;
    until: string | null;
    verified: boolean;
  }[];
}
export interface NavigationNode {
  id: string;
  geographic: GeoCoordinate;
  barrier: string | null;
  access: string | null;
  foot: string | null;
}
export interface NavigationEdge {
  id: string;
  from: string;
  to: string;
  distanceMeters: number;
  sourceFeatureId: string;
  pathType: string;
  foot: string | null;
  access: string | null;
  stairs: boolean | null;
  indoor: boolean | null;
  wheelchair: string | null;
  incline: string | null;
  layer: string | null;
  bridge: string | null;
  tunnel: string | null;
  onewayFoot: string | null;
  temporaryAvailability: 'unknown' | 'closed' | 'open';
}
export interface PedestrianGraph {
  revision: string;
  nodes: NavigationNode[];
  edges: NavigationEdge[];
  warnings: string[];
  debugExample?: { start: string; end: string } | null;
}
export interface DebugRoute {
  status: 'found' | 'unreachable' | 'invalid';
  nodeIds: string[];
  edgeIds: string[];
  distanceMeters: number;
  warnings: string[];
}
