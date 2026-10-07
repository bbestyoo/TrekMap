import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { TREK_REGISTRY } from '../../data/treks/trekRegistry';
import { useAppStore } from '../../store/useAppStore';
import type { Difficulty, Region } from '../../types';
import clsx from 'clsx';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy:        '#52B788',
  Moderate:    '#95D5B2',
  Challenging: '#FFB703',
  Strenuous:   '#FB8500',
  Extreme:     '#E63946',
};

export default function TrekSelector() {
  const selectedTrekId   = useAppStore((s) => s.selectedTrekId);
  const selectTrek       = useAppStore((s) => s.selectTrek);
  const trekSelectorOpen = useAppStore((s) => s.trekSelectorOpen);
  const setTrekSelectorOpen = useAppStore((s) => s.setTrekSelectorOpen);
  const trekDataLoading  = useAppStore((s) => s.trekDataLoading);

  const [activeRegion, setActiveRegion] = useState<Region | 'All'>('All');

  const regions: Array<Region | 'All'> = [
    'All',
    ...Array.from(new Set(TREK_REGISTRY.map((t) => t.region))),
  ];

  const filtered = TREK_REGISTRY.filter((t) =>
    activeRegion === 'All' || t.region === activeRegion
  );

  if (!trekSelectorOpen) {
    return (
      <button
        className="trek-selector-toggle-btn"
        onClick={() => setTrekSelectorOpen(true)}
        aria-label="Open trek selector"
      >
        <span>🥾</span>
        <span>Treks</span>
      </button>
    );
  }

  return (
    <aside className="trek-selector" role="complementary" aria-label="Trek selector">

      <div className="trek-selector-header">
        <div className="ts-title">
          <span className="ts-icon">🥾</span>
          <span>Explore Treks</span>
        </div>
        <button
          className="ts-close"
          onClick={() => setTrekSelectorOpen(false)}
          aria-label="Close trek selector"
        >
          <X size={16} />
        </button>
      </div>

      {/* Region filter chips */}
      <div className="ts-filters">
        <div className="filter-scroll" role="group" aria-label="Filter by region">
          {regions.map((r) => (
            <button
              key={r}
              className={clsx('filter-chip', activeRegion === r && 'active')}
              onClick={() => setActiveRegion(r)}
              aria-pressed={activeRegion === r}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Trek list */}
      <ul className="trek-list" role="list" aria-label="Available treks">
        {filtered.map((trek) => {
          const isSelected = selectedTrekId === trek.id;
          const isLoading  = isSelected && trekDataLoading;

          return (
            <li key={trek.id}>
              <button
                className={clsx('trek-card', isSelected && 'selected')}
                onClick={() => selectTrek(isSelected ? null : trek.id)}
                aria-pressed={isSelected}
                aria-label={`${trek.name}, ${trek.difficulty}, ${trek.stats.durationDays.min}–${trek.stats.durationDays.max} days`}
                aria-busy={isLoading}
              >
                <div className="tc-header">
                  <div className="tc-name">
                    {trek.name}
                    {isLoading && (
                      <Loader size={11} className="spin tc-spinner" aria-hidden />
                    )}
                  </div>
                  <span
                    className="tc-difficulty"
                    style={{ color: DIFFICULTY_COLORS[trek.difficulty] }}
                  >
                    {trek.difficulty}
                  </span>
                </div>

                <div className="tc-region">{trek.region} Region</div>

                <div className="tc-stats">
                  <span className="tc-stat">
                    <span className="tc-stat-icon">📅</span>
                    {trek.stats.durationDays.min}–{trek.stats.durationDays.max}d
                  </span>
                  <span className="tc-stat">
                    <span className="tc-stat-icon">📏</span>
                    {trek.stats.distanceKm} km
                  </span>
                  <span className="tc-stat">
                    <span className="tc-stat-icon">⛰</span>
                    {trek.stats.maxElevationM.toLocaleString()}
                  </span>
                </div>

                {/* OSM data badge */}
                <div className="tc-source-badge">
                  {trek.osmRelationId
                    ? <span className="badge-osm">OSM verified</span>
                    : <span className="badge-bbox">OSM Certified</span>}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="ts-count">
        {filtered.length} of {TREK_REGISTRY.length} treks · live OSM data
      </div>
    </aside>
  );
}
