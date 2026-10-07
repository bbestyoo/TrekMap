/**
 * MobileBottomSheet — replaces the desktop side panels on mobile.
 * Three tabs: Treks / Info / Elevation.
 * Uses CSS transforms for smooth slide-up/down.
 */

import { useState } from 'react';
import { Map, Info, TrendingUp, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import TrekSelector from '../trek/TrekSelector';
import TrekInfoPanel from '../trek/TrekInfoPanel';
import ElevationProfile from '../trek/ElevationProfile';
import type { MapService } from '../../services/map/mapService';
import clsx from 'clsx';

type Tab = 'treks' | 'info' | 'elevation';

interface Props {
  mapService: MapService | null;
}

export default function MobileBottomSheet({ mapService }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('treks');
  const [expanded, setExpanded] = useState(false);
  const selectedTrek = useAppStore((s) => s.selectedTrek);

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode; badge?: boolean }> = [
    { id: 'treks', label: 'Treks', icon: <Map size={16} /> },
    { id: 'info', label: 'Info', icon: <Info size={16} />, badge: !!selectedTrek },
    { id: 'elevation', label: 'Elevation', icon: <TrendingUp size={16} />, badge: !!selectedTrek },
  ];

  return (
    <div className={clsx('mobile-sheet', expanded && 'expanded')}>
      {/* Drag handle */}
      <button
        className="sheet-handle"
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
      >
        <div className="handle-bar" />
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {/* Tab bar */}
      <div className="sheet-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={clsx('sheet-tab', activeTab === tab.id && 'active')}
            onClick={() => {
              setActiveTab(tab.id);
              setExpanded(true);
            }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`sheet-panel-${tab.id}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && <span className="tab-badge" aria-hidden />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sheet-content">
        <div
          id="sheet-panel-treks"
          role="tabpanel"
          hidden={activeTab !== 'treks'}
          className="sheet-panel"
        >
          <TrekSelector />
        </div>
        <div
          id="sheet-panel-info"
          role="tabpanel"
          hidden={activeTab !== 'info'}
          className="sheet-panel"
        >
          {selectedTrek ? (
            <TrekInfoPanel mapService={mapService} />
          ) : (
            <div className="sheet-empty">
              <span>🏔</span>
              <p>Select a trek to see details</p>
            </div>
          )}
        </div>
        <div
          id="sheet-panel-elevation"
          role="tabpanel"
          hidden={activeTab !== 'elevation'}
          className="sheet-panel"
        >
          {selectedTrek ? (
            <ElevationProfile />
          ) : (
            <div className="sheet-empty">
              <span>📈</span>
              <p>Select a trek to see elevation profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
