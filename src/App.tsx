/**
 * App — root component with cinematic intro, shareable URLs, virtual hike, compare mode, and hero elevation profile.
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { type Map } from 'maplibre-gl';
import clsx from 'clsx';
import MapView from './components/map/MapView';
import MapControls from './components/map/MapControls';
import SearchBar from './components/search/SearchBar';
import TrekSelector from './components/trek/TrekSelector';
import TrekInfoPanel from './components/trek/TrekInfoPanel';
import ElevationProfile from './components/trek/ElevationProfile';
import VirtualHikeControl from './components/trek/VirtualHikeControl';
import TrekComparison from './components/trek/TrekComparison';
import WaypointStoryModal from './components/trek/WaypointStoryModal';
import CinematicIntro from './components/ui/CinematicIntro';
import AttributionBar from './components/ui/AttributionBar';
import { useAppStore } from './store/useAppStore';
import { getTrekById, getTrekBySlug } from './data/treks/trekRegistry';
import type { MapService } from './services/map/mapService';

export default function App() {
  const mapServiceRef = useRef<MapService | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const trekSelectorOpen = useAppStore((s) => s.trekSelectorOpen);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const selectedTrek = useAppStore((s) => s.selectedTrek);
  const selectTrek = useAppStore((s) => s.selectTrek);
  const hasRightPanel = Boolean(sidebarOpen && selectedTrek);

  const handleMapReady = useCallback((service: MapService) => {
    mapServiceRef.current = service;
    setMapReady(true);
  }, []);

  const handleMapInstance = useCallback((map: Map) => {
    mapInstanceRef.current = map;
  }, []);

  // ── Shareable URL Loader: /?trek=everest-base-camp or /trek/ebc ──────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trekParam = params.get('trek');
    
    // Also check pathname like /trek/everest-base-camp
    const pathMatch = window.location.pathname.match(/\/trek\/([a-zA-Z0-9_-]+)/);
    const targetSlugOrId = trekParam || (pathMatch ? pathMatch[1] : null);

    if (targetSlugOrId) {
      const found = getTrekBySlug(targetSlugOrId) || getTrekById(targetSlugOrId);
      if (found) {
        selectTrek(found.id);
      }
    }
  }, [selectTrek]);

  return (
    <div className="app-shell">
      {/* Cinematic Intro Overlay */}
      <CinematicIntro
        onIntroComplete={() => {
          if (mapServiceRef.current && !selectedTrek) {
            mapServiceRef.current.flyToNepal();
          }
        }}
      />

      {/* Persistent 3D Map View */}
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
            <span className="logo-subtitle">Nepal 3D Topography</span>
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

      {/* Floating Virtual Hike Controller (when trek is active) */}
      {selectedTrek && (
        <div
          className={clsx(
            'virtual-hike-wrapper',
            hasRightPanel && 'with-right-panel'
          )}
        >
          <VirtualHikeControl mapService={mapReady ? mapServiceRef.current : null} />
        </div>
      )}

      {/* Waypoint Storytelling Card Drawer */}
      <WaypointStoryModal mapService={mapReady ? mapServiceRef.current : null} />

      {/* Trek Comparison Modal */}
      <TrekComparison />

      {/* Bottom panel — Hero Elevation profile with interactive sync */}
      <div
        className={clsx(
          'bottom-panel',
          trekSelectorOpen && 'with-left-panel',
          hasRightPanel && 'with-right-panel'
        )}
      >
        <ElevationProfile mapService={mapReady ? mapServiceRef.current : null} />
      </div>

      <AttributionBar />
    </div>
  );
}
