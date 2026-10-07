/**
 * MapService — manages all MapLibre GL operations.
 * Uses MapLibre GL JS v4+ named exports exclusively.
 *
 * Waypoints are rendered as MapLibre GeoJSON layers (NOT DOM Markers) so they
 * stay pinned to map coordinates and never drift during pan/zoom/rotate.
 */

import {
  Map,
  Popup,
  Marker,
  type LngLatBoundsLike,
  type LayerSpecification,
  type GeoJSONSourceSpecification,
  type MapMouseEvent,
  type MapGeoJSONFeature,
} from 'maplibre-gl';
import type { Trek, Waypoint } from '../../types';
import {
  DEM_SOURCE_ID,
  demSourceSpec,
  terrainSpec,
  hillshadeLayerSpec,
  TERRAIN_LAYER_ID,
  getRouteColor,
} from './mapConfig';

// Source / layer id constants for waypoints
const WP_SOURCE     = 'waypoints-source';
const WP_LAYER_CIRCLE = 'waypoints-circles';
const WP_LAYER_LABEL  = 'waypoints-labels';

// Colour map for waypoint types
const WP_TYPE_COLORS: Record<string, string> = {
  start:      '#52b788',
  finish:     '#52b788',
  basecamp:   '#00e5ff',
  pass:       '#ffb703',
  viewpoint:  '#c77dff',
  village:    '#95d5b2',
  camp:       '#fb8500',
  landmark:   '#ff6b35',
  teahouse:   '#ffd700',
  checkpoint: '#adb5bd',
};

export class MapService {
  private map: Map;
  private activeRouteSourceId: string | null = null;
  private terrainActive = false;
  // Store click handler so we can remove listener when clearing
  private wpClickHandler: ((e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => void) | null = null;
  private wpHoverEnter: ((e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => void) | null = null;
  private wpHoverLeave: (() => void) | null = null;
  private activePopup: Popup | null = null;

  constructor(map: Map) {
    this.map = map;
  }

  // ─── Terrain ───────────────────────────────────────────────────────────────

  addDEMSource(): void {
    if (this.map.getSource(DEM_SOURCE_ID)) return;
    this.map.addSource(DEM_SOURCE_ID, demSourceSpec);
  }

  enableTerrain(): void {
    if (this.terrainActive) return;
    this.addDEMSource();
    if (!this.map.getLayer(TERRAIN_LAYER_ID)) {
      const labelLayer = this.getFirstLabelLayerId();
      this.map.addLayer(hillshadeLayerSpec, labelLayer);
    }
    this.map.setTerrain(terrainSpec);
    this.terrainActive = true;
  }

  disableTerrain(): void {
    if (!this.terrainActive) return;
    this.map.setTerrain(null);
    if (this.map.getLayer(TERRAIN_LAYER_ID)) {
      this.map.removeLayer(TERRAIN_LAYER_ID);
    }
    this.terrainActive = false;
  }

  isTerrrainActive(): boolean {
    return this.terrainActive;
  }

  private getFirstLabelLayerId(): string | undefined {
    const layers = this.map.getStyle()?.layers ?? [];
    for (const layer of layers) {
      const spec = layer as LayerSpecification & {
        layout?: { 'text-field'?: unknown };
      };
      if (spec.layout?.['text-field']) return layer.id;
    }
    return undefined;
  }

  // ─── Route line ────────────────────────────────────────────────────────────

  showTrekRoute(trek: Trek): void {
    this.clearRoute();
    const sourceId = `route-${trek.id}`;
    const color = getRouteColor(trek.id);

    this.map.addSource(sourceId, {
      type: 'geojson',
      data: trek.routeGeoJSON as unknown as GeoJSONSourceSpecification['data'],
    });

    // Casing for contrast against terrain
    this.map.addLayer({
      id: `route-casing-${trek.id}`,
      type: 'line',
      source: sourceId,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': 'rgba(0,0,0,0.5)',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 6, 14, 12],
        'line-blur': 3,
      },
    });

    // Main route
    this.map.addLayer({
      id: `route-line-${trek.id}`,
      type: 'line',
      source: sourceId,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': color,
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 2.5, 14, 5],
        'line-opacity': 0.95,
      },
    });

    this.activeRouteSourceId = sourceId;
  }

  clearRoute(): void {
    if (!this.activeRouteSourceId) return;
    const trekId = this.activeRouteSourceId.replace('route-', '');
    [`route-casing-${trekId}`, `route-line-${trekId}`].forEach((id) => {
      if (this.map.getLayer(id)) this.map.removeLayer(id);
    });
    if (this.map.getSource(this.activeRouteSourceId)) {
      this.map.removeSource(this.activeRouteSourceId);
    }
    this.activeRouteSourceId = null;
  }

  // ─── Waypoints (GeoJSON layers — never drift) ──────────────────────────────

  private customMarkers: Marker[] = [];

  showWaypoints(
    trek: Trek,
    onWaypointClick: (wp: Waypoint) => void,
    onWaypointHover: (wpId: string | null) => void
  ): void {
    this.clearWaypoints();
    if (!trek.waypoints || trek.waypoints.length === 0) return;

    // Build GeoJSON for intermediate waypoints (excluding start/finish)
    const features = trek.waypoints
      .filter((wp) => wp.type !== 'start' && wp.type !== 'finish')
      .map((wp) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [wp.lng, wp.lat] },
        properties: {
          id:          wp.id,
          name:        wp.name,
          elevation:   wp.elevation,
          type:        wp.type,
          color:       WP_TYPE_COLORS[wp.type] ?? '#95d5b2',
          label: `${wp.name}\n${wp.elevation.toLocaleString()} m`,
        },
      }));

    const geojson = { type: 'FeatureCollection' as const, features };

    this.map.addSource(WP_SOURCE, {
      type: 'geojson',
      data: geojson as unknown as GeoJSONSourceSpecification['data'],
    });

    // Outer glow / halo ring
    this.map.addLayer({
      id: 'waypoints-halo',
      type: 'circle',
      source: WP_SOURCE,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 10, 14, 18],
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.18,
        'circle-blur': 0.5,
      },
    });

    // Inner filled circle
    this.map.addLayer({
      id: WP_LAYER_CIRCLE,
      type: 'circle',
      source: WP_SOURCE,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 5, 14, 10],
        'circle-color': ['get', 'color'],
        'circle-stroke-color': '#07110d',
        'circle-stroke-width': 2,
        'circle-opacity': 0.95,
      },
    });

    // Text labels
    this.map.addLayer({
      id: WP_LAYER_LABEL,
      type: 'symbol',
      source: WP_SOURCE,
      layout: {
        'text-field': ['get', 'label'],
        'text-font': ['Noto Sans Regular', 'Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 8, 9, 14, 13],
        'text-offset': [0, 1.8],
        'text-anchor': 'top',
        'text-allow-overlap': false,
        'text-ignore-placement': false,
      },
      paint: {
        'text-color': '#e9f5ee',
        'text-halo-color': 'rgba(7,17,13,0.85)',
        'text-halo-width': 1.5,
      },
      filter: ['!=', ['get', 'label'], ''],
    });

    this.wpHoverEnter = () => {
      this.map.getCanvas().style.cursor = 'pointer';
    };
    this.wpHoverLeave = () => {
      this.map.getCanvas().style.cursor = '';
    };
    this.map.on('mouseenter', WP_LAYER_CIRCLE, this.wpHoverEnter);
    this.map.on('mouseleave', WP_LAYER_CIRCLE, this.wpHoverLeave);

    this.wpClickHandler = (e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const id = feature.properties?.id as string;
      const wp = trek.waypoints?.find((w) => w.id === id);
      if (wp) onWaypointClick(wp);
    };
    this.map.on('click', WP_LAYER_CIRCLE, this.wpClickHandler);

    // Hover highlight feedback
    this.map.on('mousemove', WP_LAYER_CIRCLE, (e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
      const id = e.features?.[0]?.properties?.id as string | undefined;
      onWaypointHover(id ?? null);
    });
    this.map.on('mouseleave', WP_LAYER_CIRCLE, () => onWaypointHover(null));

    // ── Add custom HTML markers for Start and Finish ──
    const startWp = trek.waypoints.find(w => w.type === 'start');
    const finishWp = trek.waypoints.find(w => w.type === 'finish');

    const createMarkerEl = (isStart: boolean, wp: Waypoint) => {
      const el = document.createElement('div');
      el.className = `trek-marker ${isStart ? 'start-marker' : 'finish-marker'}`;
      el.innerHTML = `
        <div class="marker-pin">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            ${isStart 
              ? '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>'
              : '<path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6zm3.6 8h-3.36l-.4-2H7V6h5.36l.4 2H18v6z"/>'
            }
          </svg>
        </div>
        <div class="marker-label">${isStart ? 'START' : 'FINISH'}<br/><span>${wp.name}</span></div>
      `;
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onWaypointClick(wp);
      });
      el.addEventListener('mouseenter', () => onWaypointHover(wp.id));
      el.addEventListener('mouseleave', () => onWaypointHover(null));
      return el;
    };

    if (startWp) {
      const el = createMarkerEl(true, startWp);
      const m = new Marker({ element: el, anchor: 'bottom' })
        .setLngLat([startWp.lng, startWp.lat])
        .addTo(this.map);
      this.customMarkers.push(m);
    }

    if (finishWp) {
      const el = createMarkerEl(false, finishWp);
      const m = new Marker({ element: el, anchor: 'bottom' })
        .setLngLat([finishWp.lng, finishWp.lat])
        .addTo(this.map);
      this.customMarkers.push(m);
    }
  }

  clearWaypoints(): void {
    // Clear DOM markers
    this.customMarkers.forEach(m => m.remove());
    this.customMarkers = [];

    // Remove event listeners
    if (this.wpClickHandler)  this.map.off('click',      WP_LAYER_CIRCLE, this.wpClickHandler);
    if (this.wpHoverEnter)    this.map.off('mouseenter', WP_LAYER_CIRCLE, this.wpHoverEnter);
    if (this.wpHoverLeave)    this.map.off('mouseleave', WP_LAYER_CIRCLE, this.wpHoverLeave);
    this.wpClickHandler = this.wpHoverEnter = this.wpHoverLeave = null;

    ['waypoints-halo', WP_LAYER_CIRCLE, WP_LAYER_LABEL].forEach((id) => {
      if (this.map.getLayer(id)) this.map.removeLayer(id);
    });
    if (this.map.getSource(WP_SOURCE)) this.map.removeSource(WP_SOURCE);
    this.activePopup?.remove();
    this.activePopup = null;
  }

  /** No-op — highlighting now done via MapLibre feature state if needed */
  highlightWaypoint(_wpId: string | null): void {}

  setActivePopup(popup: Popup): void {
    this.activePopup?.remove();
    this.activePopup = popup;
  }

  // ─── Camera ────────────────────────────────────────────────────────────────

  flyToTrek(trek: Trek): void {
    const { bounds, stats } = trek;
    this.map.fitBounds(
      [
        [bounds.west, bounds.south],
        [bounds.east, bounds.north],
      ] as LngLatBoundsLike,
      {
        padding: { top: 80, bottom: 260, left: 80, right: 380 },
        pitch: stats.maxElevationM > 4000 ? 50 : 38,
        bearing: 0,
        duration: 2200,
        essential: true,
      }
    );
  }

  flyToNepal(): void {
    this.map.fitBounds(
      [[80.05, 26.35], [88.20, 30.45]] as LngLatBoundsLike,
      { padding: 40, pitch: 30, bearing: 0, duration: 1800, essential: true }
    );
  }

  flyToLocation(lng: number, lat: number, zoom = 12): void {
    this.map.flyTo({ center: [lng, lat], zoom, pitch: 45, duration: 1800, essential: true });
  }

  flyToWorld(): void {
    this.map.flyTo({ center: [20, 20], zoom: 2, pitch: 0, bearing: 0, duration: 2000, essential: true });
  }

  resetNorth(): void {
    this.map.easeTo({ bearing: 0, duration: 500 });
  }

  setGlobeProjection(): void {
    this.map.setProjection({ type: 'globe' });
  }

  setMercatorProjection(): void {
    this.map.setProjection({ type: 'mercator' });
  }

  cleanup(): void {
    this.clearRoute();
    this.clearWaypoints();
    this.removeNepalBoundaries();
  }

  // ─── Nepal administrative boundaries ──────────────────────────────────────
  //
  // Loads real boundary GeoJSON from public/ (GADM / National GeoPortal data).
  // Two separate sources: country outline + province fills/lines.

  private readonly NEPAL_COUNTRY_SRC  = 'nepal-country-source';
  private readonly NEPAL_PROVINCE_SRC = 'nepal-province-source';
  private boundariesLoaded = false;

  async showNepalBoundaries(): Promise<void> {
    if (this.boundariesLoaded) return;

    // ── Load both GeoJSON files in parallel ──────────────────────────────────
    let countryData: unknown;
    let provinceData: unknown;
    try {
      [countryData, provinceData] = await Promise.all([
        fetch('/nepal-country.geojson').then((r) => r.json()),
        fetch('/nepal-provinces.geojson').then((r) => r.json()),
      ]);
    } catch (err) {
      console.error('[MapService] Failed to load Nepal boundary GeoJSON:', err);
      return;
    }

    // Guard: map may have been destroyed while fetching
    if (!this.map.getStyle()) return;

    // ── Country source + layers ──────────────────────────────────────────────
    if (!this.map.getSource(this.NEPAL_COUNTRY_SRC)) {
      this.map.addSource(this.NEPAL_COUNTRY_SRC, {
        type: 'geojson',
        data: countryData as GeoJSONSourceSpecification['data'],
      });

      // Outer glow — wide blurred blue line
      this.map.addLayer({
        id: 'nepal-country-glow',
        type: 'line',
        source: this.NEPAL_COUNTRY_SRC,
        paint: {
          'line-color':   'rgba(80, 180, 255, 0.45)',
          'line-width':   10,
          'line-blur':    8,
          'line-opacity': 0.9,
        },
      });

      // Crisp white border on top
      this.map.addLayer({
        id: 'nepal-country-outline',
        type: 'line',
        source: this.NEPAL_COUNTRY_SRC,
        paint: {
          'line-color':   '#ffffff',
          'line-width':   2.5,
          'line-opacity': 1,
        },
      });
    }

    // ── Province source + layers ─────────────────────────────────────────────
    if (!this.map.getSource(this.NEPAL_PROVINCE_SRC)) {
      this.map.addSource(this.NEPAL_PROVINCE_SRC, {
        type: 'geojson',
        data: provinceData as GeoJSONSourceSpecification['data'],
      });

      // Subtle alternating fill tints per province
      const provinceColors = [
        '#e63946', '#fb8500', '#52b788',
        '#4361ee', '#c77dff', '#ffd700', '#ff6b35',
      ];

      this.map.addLayer({
        id: 'nepal-province-fill',
        type: 'fill',
        source: this.NEPAL_PROVINCE_SRC,
        paint: {
          'fill-color': [
            'match', ['get', 'number'],
            1, provinceColors[0],
            2, provinceColors[1],
            3, provinceColors[2],
            4, provinceColors[3],
            5, provinceColors[4],
            6, provinceColors[5],
            7, provinceColors[6],
            '#52b788',
          ],
          'fill-opacity': 0.07,
        },
      }, 'nepal-country-glow'); // insert below country outline

      // Province boundary lines — dashed yellow
      this.map.addLayer({
        id: 'nepal-province-lines',
        type: 'line',
        source: this.NEPAL_PROVINCE_SRC,
        paint: {
          'line-color':     '#ffe066',
          'line-width':     1.4,
          'line-opacity':   0.9,
          'line-dasharray': [6, 4],
        },
      }, 'nepal-country-outline'); // below the white outline

      // Province name labels
      this.map.addLayer({
        id: 'nepal-province-labels',
        type: 'symbol',
        source: this.NEPAL_PROVINCE_SRC,
        layout: {
          'text-field': ['get', 'name'],
          'text-font':  ['Noto Sans Bold', 'Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size':  ['interpolate', ['linear'], ['zoom'], 6, 11, 10, 15],
          'text-anchor': 'center',
          'text-allow-overlap': false,
        },
        paint: {
          'text-color':      '#ffe066',
          'text-halo-color': 'rgba(10,30,15,0.92)',
          'text-halo-width': 2.5,
          'text-opacity':    ['interpolate', ['linear'], ['zoom'], 6, 0.9, 10, 1],
        },
      });
    }

    this.boundariesLoaded = true;
  }

  removeNepalBoundaries(): void {
    [
      'nepal-province-labels',
      'nepal-province-lines',
      'nepal-province-fill',
      'nepal-country-outline',
      'nepal-country-glow',
    ].forEach((id) => {
      if (this.map.getLayer(id)) this.map.removeLayer(id);
    });
    if (this.map.getSource(this.NEPAL_PROVINCE_SRC)) this.map.removeSource(this.NEPAL_PROVINCE_SRC);
    if (this.map.getSource(this.NEPAL_COUNTRY_SRC))  this.map.removeSource(this.NEPAL_COUNTRY_SRC);
    this.boundariesLoaded = false;
  }

  // ─── Map scope locking ────────────────────────────────────────────────────

  lockToNepal(): void {
    this.map.setMaxBounds([[79.0, 25.8], [88.8, 31.2]]);
    this.map.setMinZoom(5.5);
    this.map.fitBounds(
      [[80.05, 26.35], [88.20, 30.45]] as LngLatBoundsLike,
      { padding: 40, pitch: 30, bearing: 0, duration: 1400, essential: true }
    );
  }

  unlockMap(): void {
    this.map.setMaxBounds(undefined);
    this.map.setMinZoom(1.5);
  }
}



