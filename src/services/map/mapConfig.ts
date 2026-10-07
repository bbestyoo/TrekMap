/**
 * MapLibre GL JS configuration and style definitions.
 * Uses MapLibre GL JS v4+ named exports exclusively.
 *
 * Attribution:
 *   - Basemap tiles: © OpenStreetMap contributors, © OpenMapTiles / OpenFreeMap
 *   - DEM: © Mapzen / Amazon Web Services Terrain Tiles (public domain)
 *   - Trek data: OpenStreetMap contributors (ODbL)
 */

import { type MapOptions } from 'maplibre-gl';

// ─── Public tile endpoints (no API key required) ──────────────────────────────

// OpenFreeMap — production-grade OSM vector tiles, completely free
export const VECTOR_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

// AWS Terrain Tiles — Mapzen terrarium encoding, free and public
export const DEM_SOURCE_URL =
  'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

// ─── Nepal geographic constants ───────────────────────────────────────────────

export const NEPAL_CENTER: [number, number] = [84.124, 28.394];
export const NEPAL_ZOOM    = 6.8;
export const NEPAL_PITCH   = 45;
export const NEPAL_BEARING = 0;

export const WORLD_CENTER: [number, number] = [84.124, 28.394];
export const WORLD_ZOOM = 6.5;

// Zoom thresholds for automatic terrain and projection switching
export const TERRAIN_ACTIVATE_ZOOM  = 8;
export const GLOBE_TO_MERCATOR_ZOOM = 5;

// ─── Route colours per trek ───────────────────────────────────────────────────

export const TREK_ROUTE_COLORS: Record<string, string> = {
  ebc:  '#00E5FF',   // cyan       — Everest Base Camp
  ac:   '#FFD700',   // gold       — Annapurna Circuit
  abc:  '#00FF88',   // green      — Annapurna Base Camp
  lv:   '#FF6B35',   // orange     — Langtang Valley
  mc:   '#C77DFF',   // purple     — Manaslu Circuit
  um:   '#FF4B8B',   // pink       — Upper Mustang
  mh:   '#FFC300',   // amber      — Mardi Himal
  pp:   '#48CAE4',   // sky-blue   — Panchpokhari
  nabc: '#B5EAD7',   // mint       — North Annapurna Base Camp
};

export const DEFAULT_ROUTE_COLOR = '#52B788';

export const getRouteColor = (trekId: string): string =>
  TREK_ROUTE_COLORS[trekId] ?? DEFAULT_ROUTE_COLOR;

// ─── Map initialisation options ───────────────────────────────────────────────

export const getInitialMapOptions = (
  container: HTMLElement
): Omit<MapOptions, 'style'> => ({
  container,
  center: WORLD_CENTER,
  zoom: WORLD_ZOOM,
  pitch: 30,
  bearing: 0,
  minZoom: 1.5,
  maxZoom: 18,
  attributionControl: false,
});

// ─── DEM / terrain ────────────────────────────────────────────────────────────

export const DEM_SOURCE_ID    = 'himalaya-dem';
export const TERRAIN_LAYER_ID = 'himalaya-hillshade';

export const demSourceSpec = {
  type: 'raster-dem' as const,
  tiles: [DEM_SOURCE_URL],
  tileSize: 256,
  encoding: 'terrarium' as const,
  maxzoom: 14,
  attribution: '© Mapzen / AWS Terrain Tiles (public domain)',
};

export const terrainSpec = {
  source: DEM_SOURCE_ID,
  exaggeration: 1.5,
};

// ─── Hillshade layer ──────────────────────────────────────────────────────────

export const hillshadeLayerSpec = {
  id: TERRAIN_LAYER_ID,
  type: 'hillshade' as const,
  source: DEM_SOURCE_ID,
  paint: {
    'hillshade-exaggeration':    0.45,
    'hillshade-shadow-color':    '#2d5a3a',
    'hillshade-highlight-color': '#ffffff',
    'hillshade-accent-color':    '#4a8860',
  },
};
