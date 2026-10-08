import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';
import { X, TrendingUp, Loader, Mountain, MapPin, Footprints } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ElevationPoint, Waypoint } from '../../types';
import type { MapService } from '../../services/map/mapService';

interface Props {
  mapService?: MapService | null;
}

export default function ElevationProfile({ mapService }: Props) {
  const selectedTrek          = useAppStore((s) => s.selectedTrek);
  const elevationProfileOpen  = useAppStore((s) => s.elevationProfileOpen);
  const setElevationProfileOpen = useAppStore((s) => s.setElevationProfileOpen);
  const hoveredDistance       = useAppStore((s) => s.hoveredElevationDistance);
  const setHoveredDistance    = useAppStore((s) => s.setHoveredElevationDistance);
  const hoveredWaypointId     = useAppStore((s) => s.hoveredWaypointId);
  const setHoveredWaypoint    = useAppStore((s) => s.setHoveredWaypoint);
  const setActiveWaypoint     = useAppStore((s) => s.setActiveWaypoint);
  const trekDataLoading       = useAppStore((s) => s.trekDataLoading);
  const trekLoadProgress      = useAppStore((s) => s.trekLoadProgress);
  const hikeProgress          = useAppStore((s) => s.hikeProgress);
  const isHikePlaying         = useAppStore((s) => s.isHikePlaying);

  // Show if a trek is selected and the elevation panel is open
  if (!selectedTrek) return null;
  if (!elevationProfileOpen) return null;

  const loading = trekDataLoading || selectedTrek.dataState === 'loading';
  const profile = selectedTrek.elevationProfile;

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading || !profile || profile.length === 0) {
    return (
      <div className="elevation-profile hero-elevation-profile" aria-label="Elevation profile loading">
        <div className="ep-header">
          <div className="ep-title">
            <TrendingUp size={15} className="text-emerald-400" />
            <span>Elevation Profile</span>
            <span className="ep-trek-name">{selectedTrek.name}</span>
          </div>
          <button className="ep-close" onClick={() => setElevationProfileOpen(false)} aria-label="Close">
            <X size={14} />
          </button>
        </div>
        <div className="ep-loading-state" role="status" aria-live="polite">
          {loading ? (
            <>
              <Loader size={16} className="spin" />
              <span>{trekLoadProgress || 'Loading elevation data…'}</span>
            </>
          ) : (
            <span className="ep-no-data">Elevation data unavailable for this route.</span>
          )}
        </div>
      </div>
    );
  }

  // ── Normal chart render ──────────────────────────────────────────────────
  const maxElev = Math.max(...profile.map((p) => p.elevation));
  const minElev = Math.min(...profile.map((p) => p.elevation));
  const waypointPoints = profile.filter((p) => p.waypointId);
  const totalKm = profile[profile.length - 1].distance || selectedTrek.stats.distanceKm;

  // Hike marker distance
  const currentHikeDist = (hikeProgress / 100) * totalKm;

  const handleMouseMove = (
    state: { activePayload?: Array<{ payload: ElevationPoint }> }
  ) => {
    if (!state.activePayload?.[0]) return;
    const point = state.activePayload[0].payload;
    setHoveredDistance(point.distance);

    if (point.waypointId) {
      setHoveredWaypoint(point.waypointId);
      const wp = selectedTrek.waypoints?.find((w) => w.id === point.waypointId);
      if (wp && mapService) {
        mapService.flyToCoordinates(wp.lng, wp.lat, 13.5, 45);
      }
    } else {
      let closest: ElevationPoint | null = null;
      let minDist = 5;
      for (const wp of waypointPoints) {
        const d = Math.abs(wp.distance - point.distance);
        if (d < minDist) {
          minDist = d;
          closest = wp;
        }
      }
      setHoveredWaypoint(closest?.waypointId ?? null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredDistance(null);
    setHoveredWaypoint(null);
  };

  const handleWaypointClick = (wp: Waypoint) => {
    setActiveWaypoint(wp);
    if (mapService) {
      mapService.flyToCoordinates(wp.lng, wp.lat, 14, 55);
    }
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: ElevationPoint }>;
  }) => {
    if (!active || !payload?.[0]) return null;
    const point = payload[0].payload;
    const wp = point.waypointId
      ? selectedTrek.waypoints?.find((w) => w.id === point.waypointId)
      : null;
    return (
      <div className="hero-elev-tooltip">
        <div className="hero-tt-top">
          <Mountain size={13} className="text-emerald-400" />
          <span className="hero-tt-elev">{point.elevation.toLocaleString()} m</span>
          <span className="hero-tt-dist">{point.distance} km</span>
        </div>
        {wp && (
          <div className="hero-tt-wp">
            <span className="wp-dot-pulse" />
            <span className="hero-tt-wpname">{wp.name}</span>
            <span className="hero-tt-type">{wp.type}</span>
          </div>
        )}
      </div>
    );
  };

  // Find hovered waypoint object
  const hoveredWpObj = waypointPoints.find((wp) => wp.waypointId === hoveredWaypointId);

  return (
    <div className="elevation-profile hero-elevation-profile" aria-label="Interactive Hero Elevation Profile">
      <div className="ep-header">
        <div className="ep-title-group">
          <div className="ep-title">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="ep-main-text">Topographic Elevation Profile</span>
            <span className="ep-trek-name">{selectedTrek.name}</span>
          </div>
          <span className="ep-interactive-hint">Hover points to fly camera • Click waypoints to explore stories</span>
        </div>

        <div className="ep-stats">
          <span className="ep-stat">
            <span className="ep-stat-label">Min</span>
            <span className="ep-stat-val">{minElev.toLocaleString()} m</span>
          </span>
          <span className="ep-stat">
            <span className="ep-stat-label">Max Summit</span>
            <span className="ep-stat-val text-emerald-300">{maxElev.toLocaleString()} m</span>
          </span>
          <span className="ep-stat">
            <span className="ep-stat-label">Net Gain</span>
            <span className="ep-stat-val">
              +{selectedTrek.stats.elevationGainM.toLocaleString()} m
            </span>
          </span>
          <span className="ep-stat ep-source-tag">3D SRTM Telemetry</span>
        </div>

        <button
          className="ep-close"
          onClick={() => setElevationProfileOpen(false)}
          aria-label="Close elevation profile"
        >
          <X size={15} />
        </button>
      </div>

      <div className="ep-chart-wrap" onMouseLeave={handleMouseLeave}>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart
            data={profile}
            margin={{ top: 12, right: 16, bottom: 0, left: 45 }}
            onMouseMove={handleMouseMove}
          >
            <defs>
              {/* Dynamic Gradient based on steepness: Green -> Gold -> Red */}
              <linearGradient id="gradientElev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.85} />
                <stop offset="35%" stopColor="#eab308" stopOpacity={0.7} />
                <stop offset="70%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#047857" stopOpacity={0.15} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="distance"
              tickFormatter={(v: number) => `${v} km`}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              domain={[Math.max(0, minElev - 200), maxElev + 350]}
              tickFormatter={(v: number) => `${Math.round(v / 100) * 100}m`}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(0, 229, 255, 0.6)', strokeWidth: 1.5 }}
            />

            {/* Named Waypoint Vertical Markers */}
            {waypointPoints.map((wp) => (
              <ReferenceLine
                key={wp.waypointId}
                x={wp.distance}
                stroke={wp.waypointId === hoveredWaypointId ? '#00E5FF' : 'rgba(255,255,255,0.22)'}
                strokeWidth={wp.waypointId === hoveredWaypointId ? 2 : 1}
                strokeDasharray="3 3"
              />
            ))}

            {/* Virtual Hike Live Position Marker */}
            {isHikePlaying && (
              <ReferenceLine
                x={currentHikeDist}
                stroke="#FFD700"
                strokeWidth={2.5}
                label={{
                  value: '📍 You',
                  position: 'top',
                  fill: '#FFD700',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}

            {/* Hovered Distance Line */}
            {hoveredDistance !== null && (
              <ReferenceLine x={hoveredDistance} stroke="#00E5FF" strokeWidth={1.5} />
            )}

            <Area
              type="monotone"
              dataKey="elevation"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#gradientElev)"
              dot={false}
              activeDot={{ r: 5, fill: '#00E5FF', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Waypoint Badges Row */}
      <div className="ep-waypoints-strip">
        {selectedTrek.waypoints?.map((wp) => {
          const isHovered = hoveredWaypointId === wp.id;
          return (
            <button
              key={wp.id}
              className={`ep-wp-chip ${isHovered ? 'active-hover' : ''}`}
              onClick={() => handleWaypointClick(wp)}
              onMouseEnter={() => setHoveredWaypoint(wp.id)}
              onMouseLeave={() => setHoveredWaypoint(null)}
              title={`Click for story & photo of ${wp.name}`}
            >
              <span className={`chip-dot dot-${wp.type}`} />
              <span className="chip-name">{wp.name}</span>
              <span className="chip-elev">{wp.elevation}m</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
