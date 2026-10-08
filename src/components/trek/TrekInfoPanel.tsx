import { useState } from 'react';
import {
  X, Heart, TrendingUp, Clock, Route,
  Mountain, MapPin, Flag, Loader, AlertCircle,
  Footprints, Share2, Layers, Filter, Eye, EyeOff, Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Difficulty, Waypoint, WaypointType } from '../../types';
import type { MapService } from '../../services/map/mapService';
import { getTrekCoverImage } from '../../utils/trekImages';
import clsx from 'clsx';
import himalayaImage from '../../assets/image.png';

interface Props {
  mapService: MapService | null;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { color: string; label: string }> = {
  Easy:        { color: '#52B788', label: '●' },
  Moderate:    { color: '#95D5B2', label: '●●' },
  Challenging: { color: '#FFB703', label: '●●●' },
  Strenuous:   { color: '#FB8500', label: '●●●●' },
  Extreme:     { color: '#E63946', label: '●●●●●' },
};

export default function TrekInfoPanel({ mapService }: Props) {
  const selectedTrek          = useAppStore((s) => s.selectedTrek);
  const selectTrek            = useAppStore((s) => s.selectTrek);
  const sidebarOpen           = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen        = useAppStore((s) => s.setSidebarOpen);
  const setActiveWaypoint     = useAppStore((s) => s.setActiveWaypoint);
  const setIsCompareOpen      = useAppStore((s) => s.setIsCompareOpen);
  const startVirtualHike      = useAppStore((s) => s.startVirtualHike);
  const isHikePlaying         = useAppStore((s) => s.isHikePlaying);
  const showWaypointsOnMap    = useAppStore((s) => s.showWaypointsOnMap);
  const setShowWaypointsOnMap = useAppStore((s) => s.setShowWaypointsOnMap);
  const hoveredWaypointId     = useAppStore((s) => s.hoveredWaypointId);
  const setHoveredWaypoint    = useAppStore((s) => s.setHoveredWaypoint);

  const [activeTab, setActiveTab] = useState<'overview' | 'waypoints' | 'altitudes'>('overview');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<WaypointType | 'all'>('all');

  if (!selectedTrek || !sidebarOpen) return null;

  const diff    = DIFFICULTY_CONFIG[selectedTrek.difficulty];
  const loading = selectedTrek.dataState === 'loading';

  const handleFlyTo = () => mapService?.flyToTrek(selectedTrek);
  const handleClose = () => { setSidebarOpen(false); selectTrek(null); };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2200);
  };

  const handleWaypointClick = (wp: Waypoint) => {
    setActiveWaypoint(wp);
    if (mapService) {
      mapService.flyToCoordinates(wp.lng, wp.lat, 14, 55);
    }
  };

  // Waypoint filtering
  const allWaypoints = selectedTrek.waypoints || [];
  const filteredWaypoints = allWaypoints.filter(
    (wp) => selectedFilter === 'all' || wp.type === selectedFilter
  );

  // Top 5 Highest Points
  const topAltitudePoints = [...allWaypoints]
    .sort((a, b) => b.elevation - a.elevation)
    .slice(0, 5);

  return (
    <aside className="trek-info-panel" aria-label="Trek information">

      {/* ── Cover image ─────────────────────────────────────────────────── */}
      <div className="tip-image-wrap">
        <img
          src={getTrekCoverImage(selectedTrek.id)}
          alt={`${selectedTrek.name} cover`}
          className="tip-cover-img"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = himalayaImage; }}
        />
        <button className="tip-close" onClick={handleClose} aria-label="Close">
          <X size={16} />
        </button>
        <div className="tip-image-gradient" />
        <div className="tip-region-badge">{selectedTrek.region}</div>

        {/* Action icons on image */}
        <div className="tip-image-actions">
          <button
            className="tip-action-pill"
            onClick={handleShare}
            title="Copy shareable link for this trek"
          >
            <Share2 size={13} />
            <span>{copiedUrl ? 'Copied!' : 'Share'}</span>
          </button>
          <button
            className="tip-action-pill"
            onClick={() => setIsCompareOpen(true)}
            title="Compare with another trek"
          >
            <Layers size={13} />
            <span>Compare</span>
          </button>
        </div>
      </div>

      <div className="tip-content">

        {/* ── Title ───────────────────────────────────────────────────── */}
        <div className="tip-title-row">
          <h2 className="tip-title">
            <span className="tip-icon">🥾</span>
            {selectedTrek.name}
          </h2>
          <button
            className={`tip-hike-trigger-btn ${isHikePlaying ? 'active' : ''}`}
            onClick={startVirtualHike}
            title="Start interactive 3D virtual hike"
          >
            <Footprints size={14} />
            <span>{isHikePlaying ? 'Hike Live' : 'Virtual Hike'}</span>
          </button>
        </div>

        {/* ── Tabs: Overview, Waypoints, Altitude Rankings ─────────────── */}
        <div className="tip-tabs-bar" role="tablist">
          <button
            className={clsx('tip-tab', activeTab === 'overview' && 'active')}
            onClick={() => setActiveTab('overview')}
            role="tab"
          >
            Overview
          </button>
          <button
            className={clsx('tip-tab', activeTab === 'waypoints' && 'active')}
            onClick={() => setActiveTab('waypoints')}
            role="tab"
          >
            Waypoints ({allWaypoints.length})
          </button>
          <button
            className={clsx('tip-tab', activeTab === 'altitudes' && 'active')}
            onClick={() => setActiveTab('altitudes')}
            role="tab"
          >
            Highest Summits
          </button>
        </div>

        {/* ──────────────── TAB 1: OVERVIEW ─────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="tip-tab-pane">
            <p className="tip-description">{selectedTrek.description}</p>

            {/* ── Stats grid ────────────────────────────────────────────── */}
            <div className="tip-stats-grid">
              <StatItem
                icon={<Clock size={16} className="stat-icon" />}
                label="Duration"
                value={`${selectedTrek.stats.durationDays.min}–${selectedTrek.stats.durationDays.max} days`}
              />
              <StatItem
                icon={<Route size={16} className="stat-icon" />}
                label="Distance"
                value={`${selectedTrek.stats.distanceKm} km`}
              />
              <StatItem
                icon={<Mountain size={16} className="stat-icon" />}
                label="Max Altitude"
                value={`${selectedTrek.stats.maxElevationM.toLocaleString()} m`}
              />
              <StatItem
                icon={<span className="stat-icon-diff" style={{ color: diff.color }}>{diff.label}</span>}
                label="Difficulty"
                value={selectedTrek.difficulty}
              />
            </div>

            {/* ── Elevation row ────────────────────────────────────────── */}
            <div className="tip-elev-row">
              <ElevItem
                icon={<TrendingUp size={14} className="elev-icon up" />}
                label="Ascent Gain"
                value={`+${selectedTrek.stats.elevationGainM.toLocaleString()} m`}
              />
              <ElevItem
                icon={<TrendingUp size={14} className="elev-icon down" />}
                label="Descent"
                value={`−${selectedTrek.stats.elevationLossM.toLocaleString()} m`}
              />
              {selectedTrek.stats.highestPassName && (
                <ElevItem
                  icon={<Flag size={14} className="elev-icon" />}
                  label={selectedTrek.stats.highestPassName}
                  value={`${selectedTrek.stats.highestPassM?.toLocaleString()} m`}
                />
              )}
            </div>

            {/* ── Route ────────────────────────────────────────────────── */}
            <div className="tip-route-row">
              <MapPin size={13} className="route-icon start" />
              <span className="route-start">{selectedTrek.startPoint}</span>
              <span className="route-arrow">➔</span>
              <span className="route-end">{selectedTrek.endPoint}</span>
            </div>

            {/* ── Highlights ────────────────────────────────────────────── */}
            <div className="tip-section">
              <h3 className="tip-section-title">Trail Highlights</h3>
              <ul className="tip-highlights">
                {selectedTrek.highlights.map((h, i) => (
                  <li key={i} className="tip-highlight-item">
                    <Sparkles size={13} className="text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ──────────────── TAB 2: WAYPOINT STORYTELLING & FILTERS ───── */}
        {activeTab === 'waypoints' && (
          <div className="tip-tab-pane">
            <div className="tip-wp-controls-row">
              {/* Type Filter Chips */}
              <div className="tip-wp-filter-chips">
                {(['all', 'village', 'landmark', 'viewpoint', 'pass', 'camp', 'checkpoint'] as const).map((filter) => (
                  <button
                    key={filter}
                    className={clsx('wp-filter-btn', selectedFilter === filter && 'active')}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Toggle visibility */}
              <button
                className="tip-wp-toggle-visibility"
                onClick={() => setShowWaypointsOnMap(!showWaypointsOnMap)}
                title={showWaypointsOnMap ? 'Hide waypoints on map' : 'Show waypoints on map'}
              >
                {showWaypointsOnMap ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{showWaypointsOnMap ? 'Map Dots On' : 'Map Dots Off'}</span>
              </button>
            </div>

            <div className="tip-interactive-wp-list">
              {filteredWaypoints.map((wp) => {
                const isHovered = hoveredWaypointId === wp.id;
                return (
                  <div
                    key={wp.id}
                    className={clsx('tip-wp-card', isHovered && 'hovered')}
                    onClick={() => handleWaypointClick(wp)}
                    onMouseEnter={() => setHoveredWaypoint(wp.id)}
                    onMouseLeave={() => setHoveredWaypoint(null)}
                  >
                    <div className="wp-card-left">
                      <div className={clsx('wp-dot-ring', `type-${wp.type}`)} />
                      <div className="wp-card-meta">
                        <div className="wp-card-title-row">
                          <span className="wp-card-name">{wp.name}</span>
                          <span className="wp-card-type-tag">{wp.type}</span>
                        </div>
                        {wp.distanceFromStart !== undefined && (
                          <span className="wp-card-sub">
                            📍 {wp.distanceFromStart} km from start
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="wp-card-right">
                      <span className="wp-card-elev">{wp.elevation.toLocaleString()} m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ──────────────── TAB 3: ALTITUDE RANKINGS ────────────────── */}
        {activeTab === 'altitudes' && (
          <div className="tip-tab-pane">
            <p className="tip-pane-subtext">
              The 5 highest peaks, passes, and high-altitude shelters on this expedition:
            </p>
            <div className="tip-altitude-ranks">
              {topAltitudePoints.map((wp, index) => (
                <div
                  key={wp.id}
                  className="tip-rank-item"
                  onClick={() => handleWaypointClick(wp)}
                >
                  <div className="rank-num">#{index + 1}</div>
                  <div className="rank-details">
                    <span className="rank-name">{wp.name}</span>
                    <span className="rank-type">{wp.type.toUpperCase()}</span>
                  </div>
                  <div className="rank-elev">
                    <Mountain size={14} className="text-emerald-400" />
                    <span>{wp.elevation.toLocaleString()} m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA View on map ──────────────────────────────────────── */}
        <div className="tip-footer-actions">
          <button
            className="tip-fly-btn"
            onClick={handleFlyTo}
            aria-label={`Frame camera to ${selectedTrek.name}`}
          >
            <MapPin size={15} />
            <span>Fit Camera to Route</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="stat-item">
      {icon}
      <div className="stat-text">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}

function ElevItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="elev-item">
      {icon}
      <div className="elev-text">
        <span className="elev-label">{label}</span>
        <span className="elev-value">{value}</span>
      </div>
    </div>
  );
}
