/**
 * overpassService.ts
 *
 * Fetches real hiking route geometry and waypoints from OpenStreetMap
 * via the public Overpass API (https://overpass-api.de).
 *
 * Strategy:
 *  1. Query the OSM relation by ID → get an ordered list of way members
 *  2. Stitch the ways into a single continuous LineString
 *  3. Query named nodes (villages, passes, huts, viewpoints) inside the
 *     route's bounding box and map them to our Waypoint type
 *
 * Rate limits: public Overpass instance allows ~10,000 queries/day,
 * 1 concurrent request. The caching layer in trekDataService.ts ensures
 * we only hit Overpass once per trek per 7 days.
 *
 * License: OSM data is © OpenStreetMap contributors, ODbL.
 */

import type {
  Waypoint,
  WaypointType,
  GeoJSONFeature,
  GeoJSONLineString,
  BoundingBox,
} from '../../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OVERPASS_TIMEOUT_S = 60; // Overpass server-side timeout

// ─── Raw Overpass response types ──────────────────────────────────────────────

interface OsmNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OsmWay {
  type: 'way';
  id: number;
  nodes: number[];
  geometry?: Array<{ lat: number; lon: number }>;
  tags?: Record<string, string>;
}

interface OsmRelation {
  type: 'relation';
  id: number;
  members: Array<{ type: string; ref: number; role: string }>;
  tags?: Record<string, string>;
}

type OsmElement = OsmNode | OsmWay | OsmRelation;

interface OverpassResponse {
  elements: OsmElement[];
}

// ─── Public result types ──────────────────────────────────────────────────────

export interface OverpassRouteResult {
  /** Stitched GeoJSON LineString of the full route */
  routeGeoJSON: GeoJSONFeature<GeoJSONLineString>;
  /** Bounding box computed from the geometry */
  bounds: BoundingBox;
  /** Total distance in km (haversine sum) */
  distanceKm: number;
}

export interface OverpassWaypointResult {
  waypoints: Waypoint[];
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

// Global request queue — ensures only ONE Overpass request runs at a time
let overpassQueue: Promise<unknown> = Promise.resolve();

async function queryOverpass(ql: string): Promise<OverpassResponse> {
  // Chain this request after the previous one finishes
  const result = overpassQueue.then(async () => {
    const body = `[out:json][timeout:${OVERPASS_TIMEOUT_S}];${ql}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90_000);

    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(body)}`,
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Overpass HTTP ${res.status}: ${res.statusText}`);
      }

      return (await res.json()) as OverpassResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  });

  // Swallow errors in the queue chain so one failure doesn't break the next
  overpassQueue = result.catch(() => undefined);

  return result;
}
// ─── Route geometry ───────────────────────────────────────────────────────────

/**
 * Fetch a hiking relation by OSM relation ID and return a GeoJSON LineString.
 * Uses `out geom` so node coordinates are embedded in way members — no second
 * query needed.
 */
export async function fetchRouteGeometry(
  relationId: number
): Promise<OverpassRouteResult> {
  const ql = `
    relation(${relationId});
    way(r);
    out geom;
  `;

  const data = await queryOverpass(ql);
  const ways = data.elements.filter((e): e is OsmWay => e.type === 'way');

  if (ways.length === 0) {
    throw new Error(`No way members found for relation ${relationId}`);
  }

  // Build a map of node-id → coordinate for stitching
  const coords = stitchWays(ways);

  if (coords.length < 2) {
    throw new Error(`Could not stitch ways for relation ${relationId} — too few points`);
  }

  const bounds = computeBounds(coords);
  const distanceKm = computeDistanceKm(coords);

  const routeGeoJSON: GeoJSONFeature<GeoJSONLineString> = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coords,
    },
    properties: { osmRelationId: relationId },
  };

  return { routeGeoJSON, bounds, distanceKm };
}

// ─── Way stitching ────────────────────────────────────────────────────────────

/**
 * Stitch a set of OSM ways into a single ordered coordinate array.
 *
 * OSM relation members are not always ordered or oriented correctly.
 * This greedy algorithm:
 *  1. Starts with the first way
 *  2. At each step, finds the next unvisited way that shares an endpoint
 *     with the current chain tail
 *  3. Reverses a way if needed to make it connect
 *  4. Falls back to a positional join for isolated gaps
 */
function stitchWays(ways: OsmWay[]): [number, number][] {
  // Extract per-way coordinate lists
  type WayCoords = { id: number; coords: [number, number][]; used: boolean };
  const wayCoordsArr: WayCoords[] = ways.map((w) => ({
    id: w.id,
    coords: (w.geometry ?? []).map((p) => [p.lon, p.lat] as [number, number]),
    used: false,
  }));

  // Filter out ways with no geometry
  const valid = wayCoordsArr.filter((w) => w.coords.length >= 2);
  if (valid.length === 0) return [];

  const chain: [number, number][] = [...valid[0].coords];
  valid[0].used = true;

  for (let pass = 0; pass < valid.length; pass++) {
    const tail = chain[chain.length - 1];
    let found = false;

    for (const w of valid) {
      if (w.used) continue;
      const head = w.coords[0];
      const wTail = w.coords[w.coords.length - 1];

      const matchHead = approxEqual(tail, head);
      const matchTail = approxEqual(tail, wTail);

      if (matchHead) {
        chain.push(...w.coords.slice(1));
        w.used = true;
        found = true;
        break;
      } else if (matchTail) {
        chain.push(...[...w.coords].reverse().slice(1));
        w.used = true;
        found = true;
        break;
      }
    }

    // Gap handling: find the geometrically closest unused way start/end
    if (!found) {
      let best: WayCoords | null = null;
      let bestDist = Infinity;
      let bestReverse = false;

      for (const w of valid) {
        if (w.used) continue;
        const tail = chain[chain.length - 1];
        const dHead = dist2(tail, w.coords[0]);
        const dTail = dist2(tail, w.coords[w.coords.length - 1]);
        if (dHead < bestDist) { bestDist = dHead; best = w; bestReverse = false; }
        if (dTail < bestDist) { bestDist = dTail; best = w; bestReverse = true; }
      }

      if (best) {
        const ordered = bestReverse ? [...best.coords].reverse() : best.coords;
        chain.push(...ordered);
        best.used = true;
      }
    }
  }

  return chain;
}

// ─── Waypoints ────────────────────────────────────────────────────────────────

/**
 * Fetch named nodes of interest inside a bounding box.
 * Queries for tea houses, villages, summits, mountain passes, viewpoints.
 */
export async function fetchWaypoints(
  bounds: BoundingBox,
  trekId: string
): Promise<OverpassWaypointResult> {
  const { south, west, north, east } = bounds;
  const bb = `${south},${west},${north},${east}`;

  const ql = `
    (
      node["tourism"="alpine_hut"](${bb});
      node["tourism"="camp_site"](${bb});
      node["tourism"="viewpoint"](${bb});
      node["place"="village"](${bb});
      node["place"="hamlet"](${bb});
      node["mountain_pass"="yes"](${bb});
      node["natural"="peak"]["name"](${bb});
      node["amenity"="shelter"](${bb});
    );
    out body;
  `;

  const data = await queryOverpass(ql);
  const nodes = data.elements.filter((e): e is OsmNode => e.type === 'node');

  const waypoints: Waypoint[] = nodes
    .filter((n) => n.tags?.name)
    .map((n, i) => ({
      id: `${trekId}-osm-${n.id}`,
      name: n.tags!.name!,
      lat: n.lat,
      lng: n.lon,
      elevation: parseFloat(n.tags?.ele ?? '0') || 0,
      type: osmTagsToWaypointType(n.tags ?? {}),
      description: buildDescription(n.tags ?? {}),
    }))
    // deduplicate by proximity (within 200 m)
    .reduce<Waypoint[]>((acc, wp) => {
      const dup = acc.find(
        (a) => haversineKm(a.lat, a.lng, wp.lat, wp.lng) < 0.2
      );
      if (!dup) acc.push(wp);
      return acc;
    }, []);

  return { waypoints };
}

// ─── OSM tag → WaypointType mapping ──────────────────────────────────────────

function osmTagsToWaypointType(tags: Record<string, string>): WaypointType {
  if (tags.mountain_pass === 'yes') return 'pass';
  if (tags.natural === 'peak') return 'viewpoint';
  if (tags.tourism === 'alpine_hut') return 'teahouse';
  if (tags.tourism === 'camp_site') return 'camp';
  if (tags.tourism === 'viewpoint') return 'viewpoint';
  if (tags.place === 'village' || tags.place === 'hamlet') return 'village';
  if (tags.amenity === 'shelter') return 'camp';
  return 'checkpoint';
}

function buildDescription(tags: Record<string, string>): string | undefined {
  const parts: string[] = [];
  if (tags.ele) parts.push(`Elevation: ${tags.ele} m`);
  if (tags['addr:full']) parts.push(tags['addr:full']);
  if (tags.description) parts.push(tags.description);
  if (tags.wikipedia) parts.push(`Wikipedia: ${tags.wikipedia}`);
  return parts.length ? parts.join(' · ') : undefined;
}

// ─── Geometry utilities ───────────────────────────────────────────────────────

function approxEqual(
  a: [number, number],
  b: [number, number],
  eps = 1e-5
): boolean {
  return Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
}

function dist2(a: [number, number], b: [number, number]): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
}

function computeBounds(coords: [number, number][]): BoundingBox {
  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;
  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return { west: minLng, east: maxLng, south: minLat, north: maxLat };
}

export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeDistanceKm(coords: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineKm(
      coords[i - 1][1], coords[i - 1][0],
      coords[i][1],     coords[i][0]
    );
  }
  return Math.round(total * 10) / 10;
}
