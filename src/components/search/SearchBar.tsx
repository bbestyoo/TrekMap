import { useRef, useEffect } from 'react';
import { Search, X, MapPin, Mountain, Navigation } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { SearchResult } from '../../types';
import type { MapService } from '../../services/map/mapService';
import clsx from 'clsx';

interface Props {
  mapService: MapService | null;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  trek: <span className="sr-icon trek-icon">🥾</span>,
  mountain: <Mountain size={14} />,
  city: <Navigation size={14} />,
  village: <MapPin size={14} />,
  pass: <span className="sr-icon">⛰</span>,
  viewpoint: <span className="sr-icon">👁</span>,
  lake: <span className="sr-icon">🏔</span>,
  region: <span className="sr-icon">🗺</span>,
};

const ZOOM_FOR_TYPE: Record<string, number> = {
  trek: 9,
  mountain: 12,
  city: 11,
  village: 13,
  pass: 13,
  viewpoint: 13,
  lake: 11,
  region: 8,
};

export default function SearchBar({ mapService }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchQuery = useAppStore((s) => s.searchQuery);
  const searchResults = useAppStore((s) => s.searchResults);
  const isSearchOpen = useAppStore((s) => s.isSearchOpen);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const clearSearch = useAppStore((s) => s.clearSearch);
  const selectTrek = useAppStore((s) => s.selectTrek);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setSearchOpen]);

  const handleSelect = (result: SearchResult) => {
    clearSearch();
    inputRef.current?.blur();

    if (result.trekId && result.type === 'trek') {
      selectTrek(result.trekId);
    } else {
      const zoom = ZOOM_FOR_TYPE[result.type] ?? 12;
      mapService?.flyToLocation(result.lng, result.lat, zoom);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearSearch();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" aria-hidden />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search trails, peaks, villages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
          aria-label="Search for treks, mountains, villages"
          aria-expanded={isSearchOpen}
          aria-haspopup="listbox"
          role="combobox"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isSearchOpen && searchResults.length > 0 && (
        <ul className="search-dropdown" role="listbox" aria-label="Search results">
          {searchResults.map((result) => (
            <li
              key={result.id}
              className={clsx('search-result-item', `result-type-${result.type}`)}
              role="option"
              onClick={() => handleSelect(result)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(result)}
              tabIndex={0}
              aria-label={`${result.name}${result.subtitle ? `, ${result.subtitle}` : ''}`}
            >
              <span className="result-icon">
                {TYPE_ICONS[result.type] ?? <MapPin size={14} />}
              </span>
              <div className="result-text">
                <span className="result-name">{result.name}</span>
                {result.subtitle && (
                  <span className="result-subtitle">{result.subtitle}</span>
                )}
              </div>
              {result.elevation && (
                <span className="result-elevation">{result.elevation.toLocaleString()} m</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
