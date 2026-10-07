/**
 * elevationService.ts
 *
 * Samples real SRTM 30 m elevation data along a route geometry using the
 * free, open-source OpenTopoData API (https://www.opentopodata.org).
 *
 * API details:
 *   Endpoint : GET/POST https://api.opentopodata.org/v1/srtm30m
 *   Auth     : None (public, free)
 *   Rate     : 1 request/second, max 100 locations per request
 *   Dataset  : NASA SRTM GL3 (30 m resolution, global coverage)
 *   License  : Public domain
 *
 * We resample the route to ≤100 evenly-spaced points, batch them into
 * requests of 100, honour the 1 req/s rate limit between batches, then
 * reconstruct the ElevationPoint[] array with real SRTM values.
 */

import type { ElevationPoint, GeoJSONLineString } from '../../types';
import { haversineKm } from '../overpass/overpassService';

const OPENTOPO_URL = '/api/opentopodata/v1/srtm30m';
const BATCH_SIZE = 100;          // max locations per request
const RATE_LIMIT_MS = 1100;      // 1.1 s between batches to stay under 1 req/s

// ─── OpenTopoData response types ─────────────────────────────────────────────

interface OtdResult {
  elevation: number | null;
  location: { lat: number; lng: number };
  dataset: string;
}

interface OtdResponse {
  status: string;
  results: OtdResult[];
}

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Given a route LineString, resample it to `targetPoints` evenly-spaced
 * positions, query OpenTopoData for SRTM elevations at each, and return a
 * complete ElevationPoint[] array with cumulative distance in km.
 */
export async function buildElevationProfile(
  geometry: GeoJSONLineString,
  targetPoints = 80
): Promise<ElevationPoint[]> {
  const coords = geometry.coordinates; // [lng, lat][]

  if (coords.length < 2) {
    throw new Error('Route geometry has fewer than 2 points');
  }

  // ── 1. Compute cumulative distance along the route ────────────────────────
  const cumDist: number[] = [0];
  for (let i = 1; i < coords.length; i++) {
    cumDist.push(
      cumDist[i - 1] +
      haversineKm(coords[i-1][1], coords[i-1][0], coords[i][1], coords[i][0])
    );
  }
  const totalKm = cumDist[cumDist.length - 1];

  // ── 2. Pick evenly-spaced sample positions ────────────────────────────────
  const n = Math.min(targetPoints, coords.length);
  const samples: Array<{ lat: number; lng: number; distKm: number }> = [];

  for (let s = 0; s < n; s++) {
    const targetDist = (s / (n - 1)) * totalKm;
    const idx = bisect(cumDist, targetDist);
    const [lng, lat] = coords[Math.min(idx, coords.length - 1)];
    samples.push({ lat, lng, distKm: targetDist });
  }

  // ── 3. Batch-fetch elevations ─────────────────────────────────────────────
  const elevations: number[] = [];

  for (let i = 0; i < samples.length; i += BATCH_SIZE) {
    if (i > 0) {
      // Honour rate limit between batches
      await sleep(RATE_LIMIT_MS);
    }

    const batch = samples.slice(i, i + BATCH_SIZE);
    const locations = batch
      .map((p) => `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`)
      .join('|');

    const res = await fetch(`${OPENTOPO_URL}?locations=${locations}`);
    if (!res.ok) {
      throw new Error(`OpenTopoData HTTP ${res.status}`);
    }

    const json = (await res.json()) as OtdResponse;
    if (json.status !== 'OK') {
      throw new Error(`OpenTopoData error: ${json.status}`);
    }

    for (const r of json.results) {
      elevations.push(r.elevation ?? 0);
    }
  }

  // ── 4. Assemble ElevationPoint array ─────────────────────────────────────
  return samples.map((s, i) => ({
    distance: Math.round(s.distKm * 10) / 10,
    elevation: Math.round(elevations[i] ?? 0),
  }));
}

/**
 * Compute elevation statistics from a profile.
 * Returns gain, loss, min, max.
 */
export function computeElevationStats(profile: ElevationPoint[]): {
  gainM: number;
  lossM: number;
  minM: number;
  maxM: number;
} {
  if (profile.length === 0) return { gainM: 0, lossM: 0, minM: 0, maxM: 0 };

  let gain = 0, loss = 0;
  let minM = profile[0].elevation;
  let maxM = profile[0].elevation;

  for (let i = 1; i < profile.length; i++) {
    const diff = profile[i].elevation - profile[i - 1].elevation;
    if (diff > 0) gain += diff;
    else          loss += -diff;
    if (profile[i].elevation < minM) minM = profile[i].elevation;
    if (profile[i].elevation > maxM) maxM = profile[i].elevation;
  }

  return {
    gainM: Math.round(gain),
    lossM: Math.round(loss),
    minM:  Math.round(minM),
    maxM:  Math.round(maxM),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Binary search: index of the last value in arr that is ≤ target */
function bisect(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (arr[mid] <= target) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
