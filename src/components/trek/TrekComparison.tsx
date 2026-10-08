import { useState, useEffect } from 'react';
import { X, Check, TrendingUp, Mountain, Route, Award, ArrowRight, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { TREK_REGISTRY } from '../../data/treks/trekRegistry';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import type { Trek } from '../../types';

export default function TrekComparison() {
  const isCompareOpen = useAppStore((s) => s.isCompareOpen);
  const setIsCompareOpen = useAppStore((s) => s.setIsCompareOpen);
  const selectedTrek = useAppStore((s) => s.selectedTrek);
  const selectTrek = useAppStore((s) => s.selectTrek);

  const [trekAId, setTrekAId] = useState<string>(selectedTrek?.id || 'ebc');
  const [trekBId, setTrekBId] = useState<string>('ac');

  useEffect(() => {
    if (selectedTrek) {
      setTrekAId(selectedTrek.id);
      if (selectedTrek.id === trekBId) {
        const other = TREK_REGISTRY.find((t) => t.id !== selectedTrek.id);
        if (other) setTrekBId(other.id);
      }
    }
  }, [selectedTrek]);

  if (!isCompareOpen) return null;

  const trekA: Trek = TREK_REGISTRY.find((t) => t.id === trekAId) || TREK_REGISTRY[0];
  const trekB: Trek = TREK_REGISTRY.find((t) => t.id === trekBId) || TREK_REGISTRY[1];

  // Combined elevation chart data (normalized by distance or stepped)
  const maxDist = Math.max(trekA.stats.distanceKm, trekB.stats.distanceKm);
  const chartSteps = 30;
  const comparisonData = Array.from({ length: chartSteps + 1 }, (_, i) => {
    const km = Math.round((i / chartSteps) * maxDist);
    
    // Sample Trek A elevation at km
    let elevA: number | null = null;
    if (trekA.elevationProfile && trekA.elevationProfile.length > 0) {
      const p = trekA.elevationProfile;
      const nearest = p.reduce((prev, curr) =>
        Math.abs(curr.distance - km) < Math.abs(prev.distance - km) ? curr : prev
      );
      if (km <= trekA.stats.distanceKm) {
        elevA = nearest.elevation;
      }
    }

    // Sample Trek B elevation at km
    let elevB: number | null = null;
    if (trekB.elevationProfile && trekB.elevationProfile.length > 0) {
      const p = trekB.elevationProfile;
      const nearest = p.reduce((prev, curr) =>
        Math.abs(curr.distance - km) < Math.abs(prev.distance - km) ? curr : prev
      );
      if (km <= trekB.stats.distanceKm) {
        elevB = nearest.elevation;
      }
    }

    return {
      distance: km,
      [trekA.name]: elevA,
      [trekB.name]: elevB,
    };
  });

  return (
    <div className="compare-modal-overlay">
      <div className="compare-modal">
        <div className="compare-header">
          <div className="compare-title-wrap">
            <Layers size={20} className="text-emerald-400" />
            <h2>Trek Comparison Matrix</h2>
            <span className="compare-badge">Side-by-side analysis</span>
          </div>
          <button className="compare-close-btn" onClick={() => setIsCompareOpen(false)} aria-label="Close comparison">
            <X size={18} />
          </button>
        </div>

        {/* Selector row */}
        <div className="compare-selectors">
          <div className="compare-select-card card-a">
            <span className="trek-letter">Trek A</span>
            <select
              value={trekAId}
              onChange={(e) => setTrekAId(e.target.value)}
              className="compare-dropdown"
            >
              {TREK_REGISTRY.map((t) => (
                <option key={`a-${t.id}`} value={t.id}>
                  {t.name} ({t.region})
                </option>
              ))}
            </select>
          </div>

          <div className="compare-vs">VS</div>

          <div className="compare-select-card card-b">
            <span className="trek-letter">Trek B</span>
            <select
              value={trekBId}
              onChange={(e) => setTrekBId(e.target.value)}
              className="compare-dropdown"
            >
              {TREK_REGISTRY.map((t) => (
                <option key={`b-${t.id}`} value={t.id}>
                  {t.name} ({t.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side stats grid */}
        <div className="compare-stats-grid">
          <div className="compare-stat-row header-row">
            <span className="stat-label">Metric</span>
            <span className="stat-val-a">{trekA.name}</span>
            <span className="stat-val-b">{trekB.name}</span>
          </div>

          <div className="compare-stat-row">
            <span className="stat-label">
              <Mountain size={14} /> Max Altitude
            </span>
            <span className={`stat-val-a ${trekA.stats.maxElevationM > trekB.stats.maxElevationM ? 'highlight-win' : ''}`}>
              {trekA.stats.maxElevationM.toLocaleString()} m
              {trekA.stats.highestPassName && ` (${trekA.stats.highestPassName})`}
            </span>
            <span className={`stat-val-b ${trekB.stats.maxElevationM > trekA.stats.maxElevationM ? 'highlight-win' : ''}`}>
              {trekB.stats.maxElevationM.toLocaleString()} m
              {trekB.stats.highestPassName && ` (${trekB.stats.highestPassName})`}
            </span>
          </div>

          <div className="compare-stat-row">
            <span className="stat-label">
              <Route size={14} /> Total Distance
            </span>
            <span className="stat-val-a">{trekA.stats.distanceKm} km</span>
            <span className="stat-val-b">{trekB.stats.distanceKm} km</span>
          </div>

          <div className="compare-stat-row">
            <span className="stat-label">
              <TrendingUp size={14} /> Elevation Gain
            </span>
            <span className="stat-val-a">+{trekA.stats.elevationGainM.toLocaleString()} m</span>
            <span className="stat-val-b">+{trekB.stats.elevationGainM.toLocaleString()} m</span>
          </div>

          <div className="compare-stat-row">
            <span className="stat-label">
              <Award size={14} /> Difficulty
            </span>
            <span className="stat-val-a badge-diff">{trekA.difficulty}</span>
            <span className="stat-val-b badge-diff">{trekB.difficulty}</span>
          </div>

          <div className="compare-stat-row">
            <span className="stat-label">Duration</span>
            <span className="stat-val-a">
              {trekA.stats.durationDays.min}–{trekA.stats.durationDays.max} Days
            </span>
            <span className="stat-val-b">
              {trekB.stats.durationDays.min}–{trekB.stats.durationDays.max} Days
            </span>
          </div>

          <div className="compare-stat-row">
            <span className="stat-label">Region</span>
            <span className="stat-val-a">{trekA.region}</span>
            <span className="stat-val-b">{trekB.region}</span>
          </div>
        </div>

        {/* Comparative Elevation Chart */}
        <div className="compare-chart-section">
          <div className="compare-chart-title">
            <TrendingUp size={15} />
            <span>Overlaid Elevation Profiles (Distance vs Altitude)</span>
          </div>
          <div className="compare-chart-container">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={comparisonData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCompareA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradCompareB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="distance" tickFormatter={(v) => `${v}km`} tick={{ fill: '#739582', fontSize: 10 }} />
                <YAxis domain={[500, 6000]} tickFormatter={(v) => `${v}m`} tick={{ fill: '#739582', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#0b1f16', border: '1px solid #1f4e38', borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey={trekA.name} stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#gradCompareA)" />
                <Area type="monotone" dataKey={trekB.name} stroke="#FFD700" strokeWidth={2} fillOpacity={1} fill="url(#gradCompareB)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="compare-footer">
          <button
            className="compare-action-btn btn-a"
            onClick={() => {
              selectTrek(trekA.id);
              setIsCompareOpen(false);
            }}
          >
            <span>Explore {trekA.name} on 3D Map</span>
            <ArrowRight size={14} />
          </button>
          <button
            className="compare-action-btn btn-b"
            onClick={() => {
              selectTrek(trekB.id);
              setIsCompareOpen(false);
            }}
          >
            <span>Explore {trekB.name} on 3D Map</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
