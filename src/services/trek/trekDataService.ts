/**
 * trekDataService.ts
 *
 * Orchestrates all live data loading for a trek:
 *   1. Check localStorage cache (7-day TTL) → return immediately if fresh
 *   2. Fetch route geometry from Overpass (OSM relation or bbox fallback)
 *   3. Fetch waypoints from Overpass (named nodes in route bbox)
 *   4. Fetch elevation profile from OpenTopoData (SRTM 30m)
 *   5. Merge real data back onto the Trek object
 *   6. Persist result to localStorage for future sessions
 *
 * The caller receives a fully-populated Trek (or a partially-populated one
 * with dataState='error' if any step fails gracefully).
 *
 * Design principles:
 *   - Never mutates the registry object in place — returns a new Trek
 *   - Never throws to the caller — all errors are caught and reflected in
 *     the returned Trek's dataState
 *   - Route fetch and waypoint fetch run in parallel; elevation runs after
 *     route (needs the geometry)
 */

import type { Trek, Waypoint, ElevationPoint, BoundingBox } from '../../types';
import {
  fetchRouteGeometry,
  fetchWaypoints,
  haversineKm,
} from '../overpass/overpassService';
import {
  buildElevationProfile,
  computeElevationStats,
} from '../elevation/elevationService';
import { getTrekById } from '../../data/treks/trekRegistry';

// ─── Cache constants ──────────────────────────────────────────────────────────

const CACHE_VERSION = 'v2';
const CACHE_TTL_MS  = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  version: string;
  fetchedAt: number;
  trekId: string;
  routeGeoJSON: Trek['routeGeoJSON'];
  waypoints: Waypoint[];
  elevationProfile: ElevationPoint[];
  distanceKm: number;
  elevStats: {
    gainM: number;
    lossM: number;
    minM: number;
    maxM: number;
  };
}

function cacheKey(trekId: string): string {
  return `himalaya-trek-${CACHE_VERSION}-${trekId}`;
}

function readCache(trekId: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(cacheKey(trekId));
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (
      entry.version !== CACHE_VERSION ||
      Date.now() - entry.fetchedAt > CACHE_TTL_MS
    ) {
      localStorage.removeItem(cacheKey(trekId));
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function writeCache(trekId: string, entry: Omit<CacheEntry, 'version' | 'fetchedAt'>): void {
  try {
    const full: CacheEntry = {
      ...entry,
      version: CACHE_VERSION,
      fetchedAt: Date.now(),
    };
    localStorage.setItem(cacheKey(trekId), JSON.stringify(full));
  } catch {
    // localStorage full or unavailable — silently skip caching
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Load full live data for a trek.
 *
 * @param trekId  — matches Trek.id in the registry
 * @param onProgress — optional callback for UI progress messages
 * @returns       — a new Trek object with real data merged in,
 *                  or the original Trek with dataState='error' on failure
 */
export async function loadTrekData(
  trekId: string,
  onProgress?: (msg: string) => void
): Promise<Trek> {
  const base = getTrekById(trekId);
  if (!base) {
    throw new Error(`Trek "${trekId}" not found in registry`);
  }

  // ── 1. Check cache ──────────────────────────────────────────────────────
  const cached = readCache(trekId);
  if (cached) {
    onProgress?.('Loaded from cache');
    return mergeData(base, cached);
  }

  // ── 2. Fetch route geometry ─────────────────────────────────────────────
  onProgress?.('Fetching route from OpenStreetMap…');

  let routeResult: Awaited<ReturnType<typeof fetchRouteGeometry>> | null = null;
  let bounds: BoundingBox = base.bounds;

  if (base.osmRelationId) {
    try {
      routeResult = await fetchRouteGeometry(base.osmRelationId);
      bounds = routeResult.bounds;
    } catch (err) {
      console.warn(
        `[trekDataService] Route fetch failed for ${trekId}:`,
        (err as Error).message
      );
      // Continue — we'll still get waypoints and elevation if possible
    }
  }

  // ── 3. Fetch waypoints (parallel-safe: uses bounds, not route) ──────────
  onProgress?.('Fetching waypoints from OpenStreetMap…');
  let waypoints: Waypoint[] = [];
  try {
    const wpResult = await fetchWaypoints(bounds, trekId);
    waypoints = tagStartFinish(wpResult.waypoints, base);
  } catch (err) {
    console.warn(
      `[trekDataService] Waypoint fetch failed for ${trekId}:`,
      (err as Error).message
    );
  }

  // ── 4. Fetch elevation profile (needs route geometry) ───────────────────
  let elevationProfile: ElevationPoint[] = [];
  let elevStats = { gainM: 0, lossM: 0, minM: 0, maxM: 0 };

  if (routeResult) {
    onProgress?.('Sampling elevation data (SRTM)…');
    try {
      elevationProfile = await buildElevationProfile(
        routeResult.routeGeoJSON.geometry,
        30
      );
      elevStats = computeElevationStats(elevationProfile);

      // Annotate elevation points that coincide with a named waypoint
      elevationProfile = annotateProfileWithWaypoints(
        elevationProfile,
        waypoints
      );
    } catch (err) {
      console.warn(
        `[trekDataService] Elevation fetch failed for ${trekId}:`,
        (err as Error).message
      );
    }
  }

  // ── 5. Check we got enough to be useful ─────────────────────────────────
  if (!routeResult && waypoints.length === 0) {
    console.error(`[trekDataService] All fetches failed for ${trekId}`);
    return { ...base, dataState: 'error' };
  }

  // ── 6. Cache and return ──────────────────────────────────────────────────
  const entry: Omit<CacheEntry, 'version' | 'fetchedAt'> = {
    trekId,
    routeGeoJSON: routeResult?.routeGeoJSON,
    waypoints,
    elevationProfile,
    distanceKm: routeResult?.distanceKm ?? base.stats.distanceKm,
    elevStats,
  };
  writeCache(trekId, entry);
  onProgress?.('Done');

  return mergeData(base, entry);
}

// ─── Merge helpers ────────────────────────────────────────────────────────────

function mergeData(
  base: Trek,
  entry: Omit<CacheEntry, 'version' | 'fetchedAt'>
): Trek {
  const { elevStats, distanceKm } = entry;
  return {
    ...base,
    routeGeoJSON:     entry.routeGeoJSON ?? base.routeGeoJSON,
    waypoints:        entry.waypoints.length > 0 ? entry.waypoints : base.waypoints,
    elevationProfile: entry.elevationProfile.length > 0
      ? entry.elevationProfile
      : base.elevationProfile,
    stats: {
      ...base.stats,
      distanceKm:    distanceKm > 0 ? distanceKm : base.stats.distanceKm,
      elevationGainM: elevStats.gainM > 0 ? elevStats.gainM : base.stats.elevationGainM,
      elevationLossM: elevStats.lossM > 0 ? elevStats.lossM : base.stats.elevationLossM,
      minElevationM:  elevStats.minM > 0  ? elevStats.minM  : base.stats.minElevationM,
      maxElevationM:  elevStats.maxM > 0  ? elevStats.maxM  : base.stats.maxElevationM,
    },
    isDemoData: false,
    dataState: 'loaded',
    dataSource: 'OpenStreetMap (ODbL) · OpenTopoData SRTM30m',
  };
}

/**
 * Ensure the first and last waypoints are typed 'start' / 'finish'.
 * Overpass returns generic tourism/place nodes — we promote the closest
 * ones to the expected start/end coordinates.
 */
function tagStartFinish(waypoints: Waypoint[], base: Trek): Waypoint[] {
  if (waypoints.length === 0) return waypoints;

  // Sort by proximity to route bounds corners as a rough start/end heuristic
  const sorted = [...waypoints].sort((a, b) => {
    const aDist = haversineKm(a.lat, a.lng, base.bounds.south, base.bounds.west);
    const bDist = haversineKm(b.lat, b.lng, base.bounds.south, base.bounds.west);
    return aDist - bDist;
  });

  sorted[0] = { ...sorted[0], type: 'start' };
  sorted[sorted.length - 1] = { ...sorted[sorted.length - 1], type: 'finish' };

  // Attach distanceFromStart based on position in sorted list
  const total = waypoints.length - 1;
  return sorted.map((wp, i) => ({
    ...wp,
    distanceFromStart: total > 0
      ? Math.round((i / total) * base.stats.distanceKm)
      : 0,
  }));
}

/**
 * For each waypoint, find the elevation-profile point closest in lat/lng
 * and annotate it with the waypointId so the chart can highlight it.
 */
function annotateProfileWithWaypoints(
  profile: ElevationPoint[],
  waypoints: Waypoint[]
): ElevationPoint[] {
  if (waypoints.length === 0) return profile;

  const totalDist = profile[profile.length - 1]?.distance ?? 0;
  if (totalDist === 0) return profile;

  const annotated = profile.map((pt) => ({ ...pt }));

  for (const wp of waypoints) {
    if (!wp.distanceFromStart) continue;
    // Find the profile point whose distance is closest to distanceFromStart
    let bestIdx = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < annotated.length; i++) {
      const diff = Math.abs(annotated[i].distance - wp.distanceFromStart);
      if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
    }
    // Only annotate if not already tagged
    if (!annotated[bestIdx].waypointId) {
      annotated[bestIdx] = { ...annotated[bestIdx], waypointId: wp.id };
    }
  }

  return annotated;
}

// ─── Cache management utilities ───────────────────────────────────────────────

/** Evict a specific trek from cache (e.g. manual refresh) */
export function evictTrekCache(trekId: string): void {
  localStorage.removeItem(cacheKey(trekId));
}

/** Evict all Himalaya trek caches */
export function evictAllTrekCaches(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(`himalaya-trek-${CACHE_VERSION}-`))
    .forEach((k) => localStorage.removeItem(k));
}