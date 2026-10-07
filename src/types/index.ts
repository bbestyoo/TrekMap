// ─── Core Geographic Types ────────────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// ─── Waypoint ────────────────────────────────────────────────────────────────

export type WaypointType =
  | 'start'
  | 'finish'
  | 'village'
  | 'camp'
  | 'pass'
  | 'viewpoint'
  | 'landmark'
  | 'basecamp'
  | 'teahouse'
  | 'checkpoint';

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevation: number; // metres
  type: WaypointType;
  description?: string;
  distanceFromStart?: number; // km
}

// ─── Elevation Profile ────────────────────────────────────────────────────────

export interface ElevationPoint {
  distance: number;   // km from start
  elevation: number;  // metres
  waypointId?: string;
}

// ─── Trek loading state ───────────────────────────────────────────────────────

export type TrekDataState =
  | 'idle'        // not yet loaded
  | 'loading'     // fetch in progress
  | 'loaded'      // real OSM + elevation data in place
  | 'error';      // fetch failed, running on curated fallback

// ─── Trek ─────────────────────────────────────────────────────────────────────

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Strenuous' | 'Extreme';

export type Region =
  | 'Khumbu'
  | 'Annapurna'
  | 'Manaslu'
  | 'Langtang'
  | 'Jugal'
  | 'Mustang'
  | 'Rolwaling'
  | 'Dolpo'
  | 'Makalu';

export interface TrekStats {
  distanceKm: number;
  durationDays: { min: number; max: number };
  minElevationM: number;
  maxElevationM: number;
  elevationGainM: number;
  elevationLossM: number;
  highestPassM?: number;
  highestPassName?: string;
}

export interface Trek {
  // ── Identity ──────────────────────────────────────────────────────────────
  id: string;
  slug: string;
  name: string;
  region: Region;

  // ── Curated metadata (never changes) ─────────────────────────────────────
  description: string;
  difficulty: Difficulty;
  stats: TrekStats;          // filled with real data once loaded, estimates before
  startPoint: string;
  endPoint: string;
  highlights: string[];
  tags: string[];
  coverImage?: string;
  bounds: BoundingBox;
  center: LatLng;

  // ── Data provenance ───────────────────────────────────────────────────────
  osmRelationId?: number;    // Overpass relation ID — undefined for less-mapped treks
  dataSource: string;
  isVerified: boolean;
  isDemoData: boolean;       // true until real API data is loaded
  dataState?: TrekDataState; // tracks live loading status

  // ── Live / lazily-loaded data (undefined until loadTrekData() resolves) ───
  waypoints?: Waypoint[];
  routeGeoJSON?: GeoJSONFeature<GeoJSONLineString>;
  elevationProfile?: ElevationPoint[];
}

// ─── Search ───────────────────────────────────────────────────────────────────

export type SearchResultType =
  | 'trek'
  | 'mountain'
  | 'village'
  | 'city'
  | 'pass'
  | 'viewpoint'
  | 'lake'
  | 'region';

export interface SearchResult {
  id: string;
  name: string;
  type: SearchResultType;
  subtitle?: string;
  lat: number;
  lng: number;
  elevation?: number;
  trekId?: string;
}

// ─── Map State ────────────────────────────────────────────────────────────────

export type MapProjection = 'globe' | 'mercator';

export interface MapViewState {
  center: LatLng;
  zoom: number;
  pitch: number;
  bearing: number;
  projection: MapProjection;
  terrainEnabled: boolean;
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  selectedTrekId: string | null;
  hoveredWaypointId: string | null;
  hoveredElevationDistance: number | null;
  searchQuery: string;
  searchResults: SearchResult[];
  sidebarOpen: boolean;
  elevationProfileOpen: boolean;
  mapViewState: MapViewState;
}

// ─── Inline GeoJSON types ─────────────────────────────────────────────────────

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface GeoJSONFeature<G = GeoJSONLineString> {
  type: 'Feature';
  geometry: G;
  properties: Record<string, unknown> | null;
}
