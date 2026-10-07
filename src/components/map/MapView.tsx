/**
 * MapView — core MapLibre GL JS component.
 * • Uses OpenFreeMap Liberty style mutated into a dark Google-Earth aesthetic
 *   via applyDarkEarthStyle() + addNepalLabels() after the style loads.
 * • Waypoints rendered as MapLibre GeoJSON layers (never drift).
 * • Stars + globe atmosphere glow handled in CSS over this component.
 */

import { useEffect, useRef, useCallback } from 'react';
import { Map, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createRoot } from 'react-dom/client';
import { useAppStore } from '../../store/useAppStore';
import { MapService } from '../../services/map/mapService';
import { applyDarkEarthStyle, addNepalLabels } from '../../services/map/mapStyler';
import { useStars } from '../../hooks/useStars';
import {
  VECTOR_STYLE_URL,
  getInitialMapOptions,
  TERRAIN_ACTIVATE_ZOOM,
  GLOBE_TO_MERCATOR_ZOOM,
} from '../../services/map/mapConfig';
import type { Waypoint } from '../../types';
import WaypointPopup from './WaypointPopup';

interface MapViewProps {
  onMapReady?: (service: MapService) => void;
  onMapInstance?: (map: Map) => void;
}

export default function MapView({ onMapReady, onMapInstance }: MapViewProps) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<Map | null>(null);
  const serviceRef     = useRef<MapService | null>(null);
  const activeRouteRef = useRef<string | null>(null);

  const selectedTrek       = useAppStore((s) => s.selectedTrek);
  const hoveredWaypointId  = useAppStore((s) => s.hoveredWaypointId);
  const setHoveredWaypoint = useAppStore((s) => s.setHoveredWaypoint);
  const setTerrainEnabled  = useAppStore((s) => s.setTerrainEnabled);
  const terrainEnabled     = useAppStore((s) => s.terrainEnabled);
  const mapMode            = useAppStore((s) => s.mapMode);

  // Hide stars when terrain is active (zoomed into Nepal mountains)
  useStars(terrainEnabled);

  // ─── Waypoint click → popup ───────────────────────────────────────────────
  const handleWaypointClick = useCallback((wp: Waypoint) => {
    const map     = mapRef.current;
    const service = serviceRef.current;
    if (!map || !service) return;

    const container = document.createElement('div');
    createRoot(container).render(<WaypointPopup waypoint={wp} />);

    const popup = new Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '280px',
      className: 'himalaya-popup',
      offset: 14,
    })
      .setLngLat([wp.lng, wp.lat])
      .setDOMContent(container)
      .addTo(map);

    service.setActivePopup(popup);
  }, []);

  // ─── Map init ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new Map({
      ...getInitialMapOptions(containerRef.current),
      style: VECTOR_STYLE_URL,
    });

    mapRef.current = map;
    onMapInstance?.(map);

    map.on('load', () => {
      // ── 1. Apply dark Google-Earth palette mutations ──────────────────────
      applyDarkEarthStyle(map);

      // ── 2. Add Nepal-specific place & peak labels ─────────────────────────
      addNepalLabels(map);

      // ── 3. Start mercator at Nepal zoom (globe kicks in if user zooms out) ─
      try { map.setProjection({ type: 'mercator' }); } catch { /* ok */ }

      // ── 4. Fit to Nepal bounding box instantly ────────────────────────────
      map.fitBounds(
        [[80.05, 26.35], [88.20, 30.45]],
        { padding: 60, pitch: 35, bearing: 0, duration: 0 }
      );

      const service = new MapService(map);
      serviceRef.current = service;
      service.addDEMSource();

      // Apply initial map mode (default: nepal — show boundaries + lock)
      void service.showNepalBoundaries();
      service.lockToNepal();

      onMapReady?.(service);
    });

    // Re-apply dark style mutations whenever the style is replaced
    // (e.g. if MapLibre reloads the style internally)
    map.on('styledata', () => {
      if (!map.isStyleLoaded()) return;
      applyDarkEarthStyle(map);
      addNepalLabels(map);
    });

    // ── Auto terrain + projection management ─────────────────────────────────
    const handleMoveEnd = () => {
      const zoom = map.getZoom();
      const { lat, lng } = map.getCenter();
      const service = serviceRef.current;
      if (!service) return;

      const inNepal    = lat > 26.0 && lat < 30.5 && lng > 79.5 && lng < 88.5;
      const wantTerrain = zoom >= TERRAIN_ACTIVATE_ZOOM && inNepal;

      if (wantTerrain  && !service.isTerrrainActive()) { service.enableTerrain();  setTerrainEnabled(true);  }
      if (!wantTerrain &&  service.isTerrrainActive()) { service.disableTerrain(); setTerrainEnabled(false); }

      // Globe ↔ Mercator
      try {
        map.setProjection({ type: zoom < GLOBE_TO_MERCATOR_ZOOM ? 'globe' : 'mercator' });
      } catch { /* ok during tile transitions */ }
    };

    map.on('moveend', handleMoveEnd);

    return () => {
      serviceRef.current?.cleanup();
      map.off('moveend', handleMoveEnd);
      map.remove();
      mapRef.current         = null;
      serviceRef.current     = null;
      activeRouteRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Trek selection → route + waypoints ──────────────────────────────────
  // Runs on trek change AND when dataState flips to 'loaded' (live data arrived)
  useEffect(() => {
    const service = serviceRef.current;
    const map     = mapRef.current;
    if (!service || !map) return;

    if (!selectedTrek) {
      service.clearRoute();
      service.clearWaypoints();
      activeRouteRef.current = null;
      return;
    }

    // Don't try to draw while data is still loading — no geometry yet
    if (selectedTrek.dataState === 'loading') {
      // Still fly to the known bounds so the camera moves immediately
      if (activeRouteRef.current !== selectedTrek.id) {
        service.flyToTrek(selectedTrek);
        activeRouteRef.current = selectedTrek.id;
      }
      return;
    }

    // Re-draw whenever trek id changes OR when data transitions to loaded/error
    const drawKey = `${selectedTrek.id}-${selectedTrek.dataState}`;
    if (activeRouteRef.current === drawKey) return;

    const apply = () => {
      service.clearRoute();
      service.clearWaypoints();
      // Only draw route/waypoints if we have real geometry
      if (selectedTrek.routeGeoJSON) {
        service.showTrekRoute(selectedTrek);
      }
      if (selectedTrek.waypoints && selectedTrek.waypoints.length > 0) {
        service.showWaypoints(selectedTrek, handleWaypointClick, setHoveredWaypoint);
      }
      // Only re-fly if this is a fresh trek selection, not a data update
      if (!activeRouteRef.current?.startsWith(selectedTrek.id)) {
        service.flyToTrek(selectedTrek);
      }
      activeRouteRef.current = drawKey;
    };

    if (map.isStyleLoaded()) apply();
    else map.once('styledata', apply);
  }, [selectedTrek, selectedTrek?.dataState, handleWaypointClick, setHoveredWaypoint]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    serviceRef.current?.highlightWaypoint(hoveredWaypointId);
  }, [hoveredWaypointId]);

  // ─── React to mapMode (nepal ↔ world) ─────────────────────────────────────
  useEffect(() => {
    const service = serviceRef.current;
    const map     = mapRef.current;
    if (!service || !map) return;

    const apply = () => {
      if (mapMode === 'nepal') {
        void service.showNepalBoundaries();
        service.lockToNepal();
      } else {
        service.removeNepalBoundaries();
        service.unlockMap();
        service.flyToWorld();
      }
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [mapMode]);

  return (
    <div className="map-wrapper">
      {/* Starfield canvas rendered behind the map */}
      <canvas id="stars-canvas" className="stars-canvas" aria-hidden="true" />

      {/* Atmosphere glow ring around the globe */}
      <div className="globe-atmosphere" aria-hidden="true" />

      {/* MapLibre canvas */}
      <div
        ref={containerRef}
        id="map-container"
        className="map-container"
        aria-label="Interactive 3D Nepal trekking map"
        role="application"
      />
    </div>
  );
}
