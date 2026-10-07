/**
 * MapControls — compact icon-only control strip + Nepal/World mode switcher.
 * Uses MapLibre GL JS v4+ named exports.
 */

import { Compass, Globe, Minus, Mountain, Plus } from 'lucide-react';
import { type Map } from 'maplibre-gl';
import { useAppStore } from '../../store/useAppStore';
import type { MapService } from '../../services/map/mapService';
import clsx from 'clsx';

interface Props {
  mapService: MapService | null;
  mapRef: React.RefObject<Map | null>;
}

export default function MapControls({ mapService, mapRef }: Props) {
  const terrainEnabled = useAppStore((s) => s.terrainEnabled);
  const mapMode        = useAppStore((s) => s.mapMode);
  const setMapMode     = useAppStore((s) => s.setMapMode);
  const sidebarOpen    = useAppStore((s) => s.sidebarOpen);
  const selectedTrek   = useAppStore((s) => s.selectedTrek);
  const infoPanelOpen  = sidebarOpen && Boolean(selectedTrek);

  const handleZoomIn  = () => mapRef.current?.zoomIn({ duration: 300 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 });

  const handlePitch = () => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ pitch: map.getPitch() > 20 ? 0 : 55, duration: 600 });
  };

  const handleNorth = () => {
    mapRef.current?.easeTo({ bearing: 0, pitch: 0, duration: 600 });
  };

  const handleNepalMode = () => setMapMode('nepal');
  const handleWorldMode = () => setMapMode('world');

  return (
    <div className={clsx('map-controls', infoPanelOpen && 'with-info-panel')} aria-label="Map controls">

      {/* ── Nepal / World mode switcher ─────────────────────────────────── */}
      <div className="mode-switcher" role="group" aria-label="Map scope">
        <button
          className={clsx('mode-btn', mapMode === 'nepal' && 'active')}
          onClick={handleNepalMode}
          aria-pressed={mapMode === 'nepal'}
          title="Nepal view — locked to Nepal with province boundaries"
        >
          <span className="mode-flag">🇳🇵</span>
          <span className="mode-label">Nepal</span>
        </button>
        <button
          className={clsx('mode-btn', mapMode === 'world' && 'active')}
          onClick={handleWorldMode}
          aria-pressed={mapMode === 'world'}
          title="World view — explore the globe freely"
        >
          <Globe size={14} />
          <span className="mode-label">World</span>
        </button>
      </div>

      {/* ── Zoom ─────────────────────────────────────────────────────────── */}
      <div className="ctrl-group">
        <button className="ctrl-btn" onClick={handleZoomIn}  title="Zoom in"  aria-label="Zoom in">
          <Plus size={15} />
        </button>
        <div className="ctrl-divider" />
        <button className="ctrl-btn" onClick={handleZoomOut} title="Zoom out" aria-label="Zoom out">
          <Minus size={15} />
        </button>
      </div>

      {/* ── Orientation ──────────────────────────────────────────────────── */}
      <div className="ctrl-group">
        <button className="ctrl-btn" onClick={handleNorth} title="Reset north" aria-label="Reset north">
          <Compass size={15} />
        </button>
        <div className="ctrl-divider" />
        <button className="ctrl-btn" onClick={handlePitch} title="Toggle 3D tilt" aria-label="Toggle tilt">
          <Mountain size={15} />
        </button>
      </div>

      {/* ── 3D terrain badge ──────────────────────────────────────────────── */}
      {terrainEnabled && (
        <div className="terrain-badge" role="status">
          <Mountain size={11} />
          <span>3D</span>
        </div>
      )}
    </div>
  );
}
