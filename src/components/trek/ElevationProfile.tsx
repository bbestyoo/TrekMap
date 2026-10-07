import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';
import { X, TrendingUp, Loader } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ElevationPoint } from '../../types';

export default function ElevationProfile() {
  const selectedTrek          = useAppStore((s) => s.selectedTrek);
  const elevationProfileOpen  = useAppStore((s) => s.elevationProfileOpen);
  const setElevationProfileOpen = useAppStore((s) => s.setElevationProfileOpen);
  const hoveredDistance       = useAppStore((s) => s.hoveredElevationDistance);
  const setHoveredDistance    = useAppStore((s) => s.setHoveredElevationDistance);
  const setHoveredWaypoint    = useAppStore((s) => s.setHoveredWaypoint);
  const trekDataLoading       = useAppStore((s) => s.trekDataLoading);
  const trekLoadProgress      = useAppStore((s) => s.trekLoadProgress);

  // Show if a trek is selected and the elevation panel is open (or auto-open when data exists)
  if (!selectedTrek) return null;
  if (!elevationProfileOpen) return null;

  const loading = trekDataLoading || selectedTrek.dataState === 'loading';
  const profile = selectedTrek.elevationProfile;

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading || !profile || profile.length === 0) {
    return (
      <div className="elevation-profile" aria-label="Elevation profile loading">
        <div className="ep-header">
          <div className="ep-title">
            <TrendingUp size={14} />
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

  const handleMouseMove = (
    state: { activePayload?: Array<{ payload: ElevationPoint }> }
  ) => {
    if (!state.activePayload?.[0]) return;
    const point = state.activePayload[0].payload;
    setHoveredDistance(point.distance);

    if (point.waypointId) {
      setHoveredWaypoint(point.waypointId);
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
      <div className="elev-tooltip">
        <div className="elev-tt-elevation">{point.elevation.toLocaleString()} m</div>
        <div className="elev-tt-distance">{point.distance} km</div>
        {wp && <div className="elev-tt-waypoint">{wp.name}</div>}
      </div>
    );
  };

  return (
    <div className="elevation-profile" aria-label="Elevation profile">
      <div className="ep-header">
        <div className="ep-title">
          <TrendingUp size={14} />
          <span>Elevation Profile</span>
          <span className="ep-trek-name">{selectedTrek.name}</span>
        </div>
        <div className="ep-stats">
          <span className="ep-stat">
            <span className="ep-stat-label">Min</span>
            <span className="ep-stat-val">{minElev.toLocaleString()} m</span>
          </span>
          <span className="ep-stat">
            <span className="ep-stat-label">Max</span>
            <span className="ep-stat-val">{maxElev.toLocaleString()} m</span>
          </span>
          <span className="ep-stat">
            <span className="ep-stat-label">Gain</span>
            <span className="ep-stat-val">
              +{selectedTrek.stats.elevationGainM.toLocaleString()} m
            </span>
          </span>
          {/* SRTM source indicator */}
          <span className="ep-stat ep-source-tag">SRTM 30m</span>
        </div>
        <button
          className="ep-close"
          onClick={() => setElevationProfileOpen(false)}
          aria-label="Close elevation profile"
        >
          <X size={14} />
        </button>
      </div>

      <div className="ep-chart-wrap" onMouseLeave={handleMouseLeave}>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart
            data={profile}
            margin={{ top: 8, right: 12, bottom: 0, left: 50 }}
            onMouseMove={handleMouseMove}
          >
            <defs>
              <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#52B788" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#1B4332" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="distance"
              tickFormatter={(v: number) => `${v}km`}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              domain={[Math.max(0, minElev - 200), maxElev + 300]}
              tickFormatter={(v: number) => `${Math.round(v / 100) * 100}m`}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={46}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 }}
            />

            {waypointPoints.map((wp) => (
              <ReferenceLine
                key={wp.waypointId}
                x={wp.distance}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="3 3"
              />
            ))}

            {hoveredDistance !== null && (
              <ReferenceLine x={hoveredDistance} stroke="#52B788" strokeWidth={1.5} />
            )}

            <Area
              type="monotone"
              dataKey="elevation"
              stroke="#52B788"
              strokeWidth={2}
              fill="url(#elevGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#52B788', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Waypoint tick labels */}
      <div className="ep-waypoints-row">
        {waypointPoints.slice(0, 8).map((wp) => {
          const waypoint = selectedTrek.waypoints?.find((w) => w.id === wp.waypointId);
          const lastDist = profile[profile.length - 1].distance;
          const pct      = lastDist > 0 ? (wp.distance / lastDist) * 100 : 0;
          return (
            <div
              key={wp.waypointId}
              className="ep-wp-tick"
              style={{ left: `calc(50px + ${pct * 0.92}%)` }}
              title={waypoint ? `${waypoint.name} — ${wp.elevation.toLocaleString()} m` : ''}
            >
              <div className="ep-wp-dot" />
              <span className="ep-wp-label">{waypoint?.name ?? ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
