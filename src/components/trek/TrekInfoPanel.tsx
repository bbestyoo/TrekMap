import {
  X, Heart, TrendingUp, Clock, Route,
  Mountain, MapPin, Flag, Loader, AlertCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Difficulty } from '../../types';
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
  const selectedTrek     = useAppStore((s) => s.selectedTrek);
  const selectTrek       = useAppStore((s) => s.selectTrek);
  const sidebarOpen      = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen   = useAppStore((s) => s.setSidebarOpen);
  const trekDataLoading  = useAppStore((s) => s.trekDataLoading);
  const trekLoadProgress = useAppStore((s) => s.trekLoadProgress);
  const trekDataError    = useAppStore((s) => s.trekDataError);

  if (!selectedTrek || !sidebarOpen) return null;

  const diff    = DIFFICULTY_CONFIG[selectedTrek.difficulty];
  const loading = trekDataLoading || selectedTrek.dataState === 'loading';
  const errored = selectedTrek.dataState === 'error';

  const handleFlyTo = () => mapService?.flyToTrek(selectedTrek);
  const handleClose = () => { setSidebarOpen(false); selectTrek(null); };

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

        {/* Loading overlay on the image */}
        {loading && (
          <div className="tip-loading-overlay" role="status" aria-live="polite">
            <Loader size={20} className="spin" />
            <span>{trekLoadProgress || 'Loading trail data…'}</span>
          </div>
        )}
      </div>

      <div className="tip-content">

        {/* ── Title ───────────────────────────────────────────────────── */}
        <div className="tip-title-row">
          <h2 className="tip-title">
            <span className="tip-icon">🥾</span>
            {selectedTrek.name}
          </h2>
          <button className="tip-fav" aria-label="Add to favourites">
            <Heart size={16} />
          </button>
        </div>

        <p className="tip-description">{selectedTrek.description}</p>

        {/* ── Error banner ─────────────────────────────────────────────── */}
        {errored && (
          <div className="tip-error-banner" role="alert">
            <AlertCircle size={14} />
            <span>
              Could not load live trail data — showing estimates.
              {trekDataError ? ` (${trekDataError})` : ''}
            </span>
          </div>
        )}

        {/* ── Data source pill ─────────────────────────────────────────── */}
        {!loading && !errored && (
          <div className="tip-source-pill">
            <span className="source-dot" />
            OSM · SRTM live data
          </div>
        )}
        {loading && (
          <div className="tip-source-pill tip-source-loading">
            <Loader size={10} className="spin" />
            {trekLoadProgress || 'Fetching…'}
          </div>
        )}

        {/* ── Stats grid ───────────────────────────────────────────────── */}
        <div className="tip-stats-grid">
          <StatCard
            icon={<Mountain size={16} />}
            label="Max Elevation"
            value={`${selectedTrek.stats.maxElevationM.toLocaleString()} m`}
            shimmer={loading}
          />
          <StatCard
            icon={<Route size={16} />}
            label="Total Distance"
            value={`${selectedTrek.stats.distanceKm} km`}
            shimmer={loading}
          />
          <StatCard
            icon={<Clock size={16} />}
            label="Duration"
            value={`${selectedTrek.stats.durationDays.min}–${selectedTrek.stats.durationDays.max} days`}
            shimmer={false}
          />
          <StatCard
            icon={
              <span className="diff-dots" style={{ color: diff.color }}>
                {diff.label}
              </span>
            }
            label="Difficulty"
            value={selectedTrek.difficulty}
            valueStyle={{ color: diff.color }}
            shimmer={false}
          />
        </div>

        {/* ── Elevation row ────────────────────────────────────────────── */}
        <div className="tip-elev-row">
          <ElevItem
            icon={<TrendingUp size={14} className="elev-icon up" />}
            label="Gain"
            value={`+${selectedTrek.stats.elevationGainM.toLocaleString()} m`}
            shimmer={loading}
          />
          <ElevItem
            icon={<TrendingUp size={14} className="elev-icon down" />}
            label="Loss"
            value={`−${selectedTrek.stats.elevationLossM.toLocaleString()} m`}
            shimmer={loading}
          />
          {selectedTrek.stats.highestPassName && (
            <ElevItem
              icon={<Flag size={14} className="elev-icon" />}
              label={selectedTrek.stats.highestPassName}
              value={`${selectedTrek.stats.highestPassM?.toLocaleString()} m`}
              shimmer={false}
            />
          )}
        </div>

        {/* ── Route ───────────────────────────────────────────────────── */}
        <div className="tip-route-row">
          <MapPin size={13} className="route-icon start" />
          <span className="route-start">{selectedTrek.startPoint}</span>
          <span className="route-arrow">→</span>
          <span className="route-end">{selectedTrek.endPoint}</span>
        </div>

        {/* ── Highlights ───────────────────────────────────────────────── */}
        <div className="tip-section">
          <h3 className="tip-section-title">Route Highlights</h3>
          <ul className="tip-highlights">
            {selectedTrek.highlights.map((h, i) => (
              <li key={i} className="tip-highlight-item">
                <span className="highlight-dot" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Waypoints ────────────────────────────────────────────────── */}
        <div className="tip-section">
          <h3 className="tip-section-title">Key Waypoints</h3>
          {loading ? (
            <div className="tip-waypoints-loading">
              <Loader size={13} className="spin" />
              <span>Loading waypoints from OSM…</span>
            </div>
          ) : !selectedTrek.waypoints || selectedTrek.waypoints.length === 0 ? (
            <p className="tip-no-data">No waypoints available for this route.</p>
          ) : (
            <div className="tip-waypoints">
              {selectedTrek.waypoints.slice(0, 6).map((wp, i) => (
                <div key={wp.id} className="tip-wp-item">
                  <div className="wp-connector">
                    <div className={clsx('wp-dot', `type-${wp.type}`)} />
                    {i < Math.min(5, (selectedTrek.waypoints?.length ?? 0) - 1) && (
                      <div className="wp-line" />
                    )}
                  </div>
                  <div className="wp-info">
                    <span className="wp-info-name">{wp.name}</span>
                    <span className="wp-info-elev">
                      {wp.elevation > 0 ? `${wp.elevation.toLocaleString()} m` : '—'}
                    </span>
                  </div>
                </div>
              ))}
              {(selectedTrek.waypoints?.length ?? 0) > 6 && (
                <div className="tip-more-wps">
                  +{(selectedTrek.waypoints?.length ?? 0) - 6} more waypoints
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <button
          className="tip-fly-btn"
          onClick={handleFlyTo}
          disabled={loading && !selectedTrek.routeGeoJSON}
          aria-label={`Fly camera to ${selectedTrek.name}`}
        >
          <MapPin size={15} />
          {loading && !selectedTrek.routeGeoJSON
            ? 'Loading route…'
            : 'View Trail on Map'}
        </button>

        {/* ── Attribution ──────────────────────────────────────────────── */}
        <div className="tip-attribution">
          <span>{selectedTrek.dataSource}</span>
          {selectedTrek.isDemoData && !loading && (
            <span className="demo-badge"> · estimates</span>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ── Sub-components ────────────────────────────────────────────────────────── */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
  shimmer?: boolean;
}

function StatCard({ icon, label, value, valueStyle, shimmer }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <div className="stat-card-label">{label}</div>
        <div className={clsx('stat-card-value', shimmer && 'shimmer-text')} style={valueStyle}>
          {value}
        </div>
      </div>
    </div>
  );
}

interface ElevItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  shimmer?: boolean;
}

function ElevItem({ icon, label, value, shimmer }: ElevItemProps) {
  return (
    <div className="tip-elev-item">
      {icon}
      <span className="elev-label">{label}</span>
      <span className={clsx('elev-value', shimmer && 'shimmer-text')}>{value}</span>
    </div>
  );
}
