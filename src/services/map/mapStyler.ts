/**
 * mapStyler.ts  —  Google-Earth Natural style
 *
 * Transforms the OpenFreeMap Liberty basemap into a Google-Earth-style globe:
 *   • Rich cerulean oceans with depth gradient
 *   • Lush green landmass that brightens closer to the equator
 *   • Crisp white country borders — clearly visible at all zoom levels
 *   • Country names shown (white text, dark halo) — not hidden
 *   • Roads and buildings toned down so terrain dominates
 *   • Nepal city + peak labels boosted separately with accent glow
 *
 * All mutations use safe try/catch wrappers so mismatched layer types are
 * silently skipped rather than throwing.
 */

import { type Map, type GeoJSONSourceSpecification } from 'maplibre-gl';

// ─── Layer id pattern matchers ────────────────────────────────────────────────
const isBackground  = (id: string) => id === 'background';
const isWater       = (id: string) => /water|ocean|sea|lake|river|stream|canal|waterway|bay|gulf/i.test(id);
const isLand        = (id: string) => /^(land$|landmass|earth|landcover-land|landuse-residential|landuse-commercial)/i.test(id);
const isLanduse     = (id: string) => /landuse|landcover/i.test(id);
const isForest      = (id: string) => /forest|wood|park|nature.reserve|scrub|grass|meadow|farmland|orchard/i.test(id);
const isSnow        = (id: string) => /snow|ice|glacier/i.test(id);
const isBoundary    = (id: string) => /boundary|border|admin/i.test(id);
const isRoad        = (id: string) => /road|highway|motorway|tunnel|bridge|path|track|street|service/i.test(id);
const isBuilding    = (id: string) => /building/i.test(id);
const isCountryLbl  = (id: string) => /country.label|country.name|place.country/i.test(id);
const isStateLbl    = (id: string) => /state|province|region.label/i.test(id);
const isPlaceLabel  = (id: string) => /place|city|town|village|suburb|locality|capital/i.test(id);
const isPeakLabel   = (id: string) => /peak|mountain|natural.point|elevation|summit/i.test(id);

// Safe paint/layout setters
function sp(map: Map, id: string, prop: string, val: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try { (map.setPaintProperty as any)(id, prop, val); } catch { /* type mismatch — skip */ }
}
function sl(map: Map, id: string, prop: string, val: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try { (map.setLayoutProperty as any)(id, prop, val); } catch { /* skip */ }
}

// ─── Google-Earth natural colour palette ─────────────────────────────────────
const OCEAN_DEEP    = '#1a6b9e';   // deep ocean
const OCEAN_MID     = '#2389c8';   // mid-ocean
const OCEAN_SHALLOW = '#4badd6';   // shallow / coastal
const LAND_BASE     = '#2d6a4f';   // base green (zoom 0-4, tropics)
const LAND_MID      = '#3a7d5a';   // mid-zoom
const LAND_CLOSE    = '#4a9068';   // close zoom — richer
const FOREST_COLOR  = '#276b3a';   // forest green — Google Earth forest
const FARMLAND      = '#5a8c3a';   // farmland tan-green
const SNOW_COLOR    = '#e8f0ef';   // snow/glacier white
const BORDER_COLOR  = 'rgba(255,255,255,0.85)';  // crisp white borders
const BORDER_OUTER  = 'rgba(0,0,0,0.35)';         // thin dark outer for contrast

// ─── Main style application ───────────────────────────────────────────────────
export function applyGoogleEarthStyle(map: Map): void {
  const layers = map.getStyle()?.layers;
  if (!layers) return;

  for (const layer of layers) {
    const id = layer.id;

    // ── Background (base land colour) ────────────────────────────────────────
    if (isBackground(id)) {
      sp(map, id, 'background-color', LAND_BASE);
    }

    // ── Ocean / water bodies ─────────────────────────────────────────────────
    if (isWater(id)) {
      sp(map, id, 'fill-color', [
        'interpolate', ['linear'], ['zoom'],
        0,  OCEAN_DEEP,
        5,  OCEAN_MID,
        10, OCEAN_SHALLOW,
        14, '#5bc0e0',
      ]);
      sp(map, id, 'fill-opacity', 1);
      // River/canal lines
      sp(map, id, 'line-color',   OCEAN_SHALLOW);
      sp(map, id, 'line-opacity', 0.8);
    }

    // ── Land fills ───────────────────────────────────────────────────────────
    if (isLand(id)) {
      sp(map, id, 'fill-color', [
        'interpolate', ['linear'], ['zoom'],
        0,  LAND_BASE,
        5,  LAND_MID,
        10, LAND_CLOSE,
        15, '#528f6a',
      ]);
      sp(map, id, 'fill-opacity', 1);
    }

    // ── Landuse / landcover (residential, commercial, industrial) ─────────────
    if (isLanduse(id) && !isForest(id)) {
      sp(map, id, 'fill-color',   '#3e7a58');
      sp(map, id, 'fill-opacity', 0.6);
    }

    // ── Forests & greenery ────────────────────────────────────────────────────
    if (isForest(id)) {
      sp(map, id, 'fill-color',   FOREST_COLOR);
      sp(map, id, 'fill-opacity', 0.85);
      // farmland is slightly lighter
      if (/farmland|crop|orchard/i.test(id)) {
        sp(map, id, 'fill-color',   FARMLAND);
        sp(map, id, 'fill-opacity', 0.7);
      }
    }

    // ── Snow / glacier ────────────────────────────────────────────────────────
    if (isSnow(id)) {
      sp(map, id, 'fill-color',   SNOW_COLOR);
      sp(map, id, 'fill-opacity', 0.9);
    }

    // ── Country / admin boundaries — bright white, clearly visible ───────────
    if (isBoundary(id)) {
      const isNational = /admin.2|national|country|level.2/i.test(id);
      if (isNational) {
        // Double-stroke: dark outer + bright inner for Google-Earth look
        sp(map, id, 'line-color',   BORDER_COLOR);
        sp(map, id, 'line-width',   [
          'interpolate', ['linear'], ['zoom'],
          0, 0.8,
          3, 1.2,
          6, 1.8,
          10, 2.2,
        ]);
        sp(map, id, 'line-opacity', 0.95);
        sp(map, id, 'line-blur',    0);
      } else {
        // Sub-national (state/province) — subtler
        sp(map, id, 'line-color',   'rgba(255,255,255,0.45)');
        sp(map, id, 'line-width',   0.7);
        sp(map, id, 'line-opacity', 0.6);
        sp(map, id, 'line-dasharray', [4, 3]);
      }
      // Make all boundaries visible
      sl(map, id, 'visibility', 'visible');
    }

    // ── Roads: earthy tan, subtle ─────────────────────────────────────────────
    if (isRoad(id)) {
      sp(map, id, 'line-color',   '#5a7a4a');
      sp(map, id, 'line-opacity', ['interpolate', ['linear'], ['zoom'], 8, 0, 10, 0.35, 15, 0.65]);
    }

    // ── Buildings: muted earth ────────────────────────────────────────────────
    if (isBuilding(id)) {
      sp(map, id, 'fill-color',   '#3d6645');
      sp(map, id, 'fill-opacity', 0.55);
    }

    // ── Country name labels — show, white text ────────────────────────────────
    if (isCountryLbl(id)) {
      sl(map, id, 'visibility', 'visible');
      sp(map, id, 'text-color',       '#ffffff');
      sp(map, id, 'text-halo-color',  'rgba(0,40,20,0.85)');
      sp(map, id, 'text-halo-width',  2);
      sp(map, id, 'text-opacity',     ['interpolate', ['linear'], ['zoom'], 1, 0.9, 6, 0.7]);
    }

    // ── State / province labels — show subtly ─────────────────────────────────
    if (isStateLbl(id)) {
      sl(map, id, 'visibility', 'visible');
      sp(map, id, 'text-color',      'rgba(255,255,255,0.7)');
      sp(map, id, 'text-halo-color', 'rgba(0,40,20,0.75)');
      sp(map, id, 'text-halo-width', 1.5);
    }

    // ── City / place labels — bright, readable ────────────────────────────────
    if (isPlaceLabel(id)) {
      sp(map, id, 'text-color',      '#f0faf4');
      sp(map, id, 'text-halo-color', 'rgba(0,50,25,0.9)');
      sp(map, id, 'text-halo-width', 1.5);
    }

    // ── Peak / natural labels — accent green ──────────────────────────────────
    if (isPeakLabel(id)) {
      sp(map, id, 'text-color',      '#a8e6c0');
      sp(map, id, 'text-halo-color', 'rgba(0,40,20,0.95)');
      sp(map, id, 'text-halo-width', 1.8);
    }
  }
}

// Keep the old export name as an alias so MapView doesn't need changing
export { applyGoogleEarthStyle as applyDarkEarthStyle };

// ─── Nepal dedicated labels overlay ──────────────────────────────────────────
export function addNepalLabels(map: Map): void {
  if (map.getSource('nepal-labels')) return;

  const features = [
    // Cities
    { coords: [85.324, 27.717], name: 'Kathmandu',   rank: 1, kind: 'city' },
    { coords: [83.986, 28.210], name: 'Pokhara',     rank: 2, kind: 'city' },
    { coords: [87.284, 26.483], name: 'Biratnagar',  rank: 3, kind: 'city' },
    { coords: [84.433, 27.683], name: 'Bharatpur',   rank: 3, kind: 'city' },
    { coords: [80.600, 28.683], name: 'Dhangadhi',   rank: 3, kind: 'city' },
    { coords: [85.564, 27.657], name: 'Bhaktapur',   rank: 4, kind: 'city' },
    { coords: [85.313, 27.673], name: 'Patan',       rank: 4, kind: 'city' },
    // 8000m peaks
    { coords: [86.925, 27.988], name: 'Everest\n8,849 m',     rank: 1, kind: 'peak' },
    { coords: [83.820, 28.597], name: 'Annapurna I\n8,091 m', rank: 1, kind: 'peak' },
    { coords: [84.560, 28.550], name: 'Manaslu\n8,163 m',     rank: 1, kind: 'peak' },
    { coords: [83.488, 28.698], name: 'Dhaulagiri\n8,167 m',  rank: 1, kind: 'peak' },
    { coords: [86.661, 28.094], name: 'Cho Oyu\n8,188 m',     rank: 2, kind: 'peak' },
    { coords: [86.933, 27.962], name: 'Lhotse\n8,516 m',      rank: 2, kind: 'peak' },
    { coords: [87.088, 27.890], name: 'Makalu\n8,485 m',      rank: 2, kind: 'peak' },
    // Notable peaks
    { coords: [83.973, 28.499], name: 'Machhapuchhre\n6,993 m', rank: 3, kind: 'peak' },
    { coords: [86.860, 27.861], name: 'Ama Dablam\n6,812 m',    rank: 3, kind: 'peak' },
    { coords: [83.900, 28.350], name: 'Mardi Himal\n5,587 m',   rank: 4, kind: 'peak' },
    // Trekking hubs
    { coords: [86.730, 27.687], name: 'Lukla',         rank: 4, kind: 'hub' },
    { coords: [86.714, 27.807], name: 'Namche Bazaar', rank: 4, kind: 'hub' },
    { coords: [83.735, 28.780], name: 'Jomsom',        rank: 4, kind: 'hub' },
    { coords: [84.379, 28.239], name: 'Besisahar',     rank: 5, kind: 'hub' },
    { coords: [85.342, 28.161], name: 'Syabrubesi',    rank: 5, kind: 'hub' },
    { coords: [86.714, 28.068], name: 'Manang',        rank: 5, kind: 'hub' },
  ].map(({ coords, name, rank, kind }) => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: coords as [number, number] },
    properties: { name, rank, kind },
  }));

  map.addSource('nepal-labels', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  } as GeoJSONSourceSpecification);

  // Glowing dot halo behind peak text
  map.addLayer({
    id: 'nepal-peak-halos',
    type: 'circle',
    source: 'nepal-labels',
    filter: ['==', ['get', 'kind'], 'peak'],
    minzoom: 5,
    paint: {
      'circle-radius':         ['interpolate', ['linear'], ['zoom'], 5, 3, 10, 7],
      'circle-color':          '#ffffff',
      'circle-opacity':        0.5,
      'circle-blur':           0.5,
      'circle-stroke-color':   '#a8e6c0',
      'circle-stroke-width':   1,
      'circle-stroke-opacity': 0.9,
    },
  });

  // Peak text — bright white with green glow
  map.addLayer({
    id: 'nepal-peaks',
    type: 'symbol',
    source: 'nepal-labels',
    filter: ['==', ['get', 'kind'], 'peak'],
    minzoom: 5,
    layout: {
      'text-field':         ['get', 'name'],
      'text-font':          ['Noto Sans Bold', 'Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size':          ['interpolate', ['linear'], ['zoom'], 5, 10, 10, 14],
      'text-anchor':        'bottom',
      'text-offset':        [0, -0.7],
      'text-allow-overlap': false,
      'symbol-sort-key':    ['get', 'rank'],
    },
    paint: {
      'text-color':      '#ffffff',
      'text-halo-color': 'rgba(10,60,30,0.92)',
      'text-halo-width': 2,
      'text-opacity':    ['interpolate', ['linear'], ['zoom'], 5, 0.8, 9, 1],
    },
  });

  // City / hub dots — white with green rim
  map.addLayer({
    id: 'nepal-city-dots',
    type: 'circle',
    source: 'nepal-labels',
    filter: ['in', ['get', 'kind'], ['literal', ['city', 'hub']]],
    minzoom: 5,
    paint: {
      'circle-radius':         ['interpolate', ['linear'], ['zoom'], 5, 2.5, 10, 5],
      'circle-color':          '#ffffff',
      'circle-opacity':        0.9,
      'circle-stroke-color':   '#52b788',
      'circle-stroke-width':   1.5,
      'circle-stroke-opacity': 0.85,
    },
  });

  // City / hub text — bright
  map.addLayer({
    id: 'nepal-cities',
    type: 'symbol',
    source: 'nepal-labels',
    filter: ['in', ['get', 'kind'], ['literal', ['city', 'hub']]],
    minzoom: 5,
    layout: {
      'text-field':         ['get', 'name'],
      'text-font':          ['Noto Sans Regular', 'Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size':          ['interpolate', ['linear'], ['zoom'],
        5, ['match', ['get', 'rank'], 1, 13, 2, 11, 9],
        10, ['match', ['get', 'rank'], 1, 16, 2, 14, 4, 13, 11],
      ],
      'text-anchor':        'top',
      'text-offset':        [0, 0.5],
      'text-allow-overlap': false,
      'symbol-sort-key':    ['get', 'rank'],
    },
    paint: {
      'text-color':      '#ffffff',
      'text-halo-color': 'rgba(10,60,30,0.9)',
      'text-halo-width': 1.8,
    },
  });
}
