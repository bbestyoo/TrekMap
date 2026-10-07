/**
 * App — root component.
 * Uses MapLibre GL JS v4+ named exports exclusively.
 */

import { useRef, useState, useCallback } from 'react';
import { type Map } from 'maplibre-gl';
import clsx from 'clsx';
import MapView from './components/map/MapView';
import MapControls from './components/map/MapControls';
import SearchBar from './components/search/SearchBar';
import TrekSelector from './components/trek/TrekSelector';
import TrekInfoPanel from './components/trek/TrekInfoPanel';
import ElevationProfile from './components/trek/ElevationProfile';
import AttributionBar from './components/ui/AttributionBar';
import { useAppStore } from './store/useAppStore';
import type { MapService } from './services/map/mapService';

export default function App() {
  const mapServiceRef = useRef<MapService | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const trekSelectorOpen = useAppStore((s) => s.trekSelectorOpen);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const selectedTrek = useAppStore((s) => s.selectedTrek);
  const hasRightPanel = Boolean(sidebarOpen && selectedTrek);

  const handleMapReady = useCallback((service: MapService) => {
    mapServiceRef.current = service;
    setMapReady(true);
  }, []);

  const handleMapInstance = useCallback((map: Map) => {
    mapInstanceRef.current = map;
  }, []);

  return (
    <div className="app-shell">
      {/* Persistent map layer */}
      <MapView
        onMapReady={handleMapReady}
        onMapInstance={handleMapInstance}
      />

      {/* Top bar */}
      <header className="top-bar" role="banner">
        <div className="top-bar-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <polygon points="16,3 30,29 2,29" fill="#2D6A4F" stroke="#52B788" strokeWidth="1.5"/>
            <polygon points="10,15 22,15 16,3" fill="#52B788"/>
            <polygon points="7,22 25,22 19,15 13,15" fill="#1B4332" opacity="0.6"/>
          </svg>
          <div className="logo-text">
            <span className="logo-title">Trek Explorer</span>
            <span className="logo-subtitle">Made by Bibesh </span>
          </div>
        </div>

        <div className="top-bar-search">
          <SearchBar mapService={mapReady ? mapServiceRef.current : null} />
        </div>
      </header>

      {/* Map controls */}
      {mapReady && (
        <MapControls
          mapService={mapServiceRef.current}
          mapRef={mapInstanceRef}
        />
      )}

      {/* Left panel — Trek selector */}
      <div className="left-panel">
        <TrekSelector />
      </div>

      {/* Right panel — Trek info */}
      <div className="right-panel">
        <TrekInfoPanel mapService={mapReady ? mapServiceRef.current : null} />
      </div>

      {/* Bottom panel — Elevation profile */}
      <div
        className={clsx(
          'bottom-panel',
          trekSelectorOpen && 'with-left-panel',
          hasRightPanel && 'with-right-panel'
        )}
      >
        <ElevationProfile />
      </div>

      <AttributionBar />
    </div>
  );
}
