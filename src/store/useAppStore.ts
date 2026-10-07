import { create } from 'zustand';
import type { SearchResult, Trek } from '../types';
import { TREK_REGISTRY, getTrekById } from '../data/treks/trekRegistry';
import { NEPAL_PLACES } from '../data/places/nepal-places';

interface AppStore {
  // ── Trek selection ──────────────────────────────────────────────────────
  selectedTrekId: string | null;
  selectedTrek: Trek | null;
  selectTrek: (id: string | null) => void;

  // ── Live data loading ───────────────────────────────────────────────────
  trekDataLoading: boolean;
  trekDataError: string | null;
  trekLoadProgress: string;           // human-readable progress message
  updateSelectedTrek: (trek: Trek) => void;

  // ── Waypoint hover ──────────────────────────────────────────────────────
  hoveredWaypointId: string | null;
  setHoveredWaypoint: (id: string | null) => void;

  // ── Elevation profile hover ─────────────────────────────────────────────
  hoveredElevationDistance: number | null;
  setHoveredElevationDistance: (dist: number | null) => void;

  // ── Search ──────────────────────────────────────────────────────────────
  searchQuery: string;
  searchResults: SearchResult[];
  isSearchOpen: boolean;
  setSearchQuery: (q: string) => void;
  setSearchOpen: (open: boolean) => void;
  clearSearch: () => void;

  // ── UI panels ───────────────────────────────────────────────────────────
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  elevationProfileOpen: boolean;
  setElevationProfileOpen: (open: boolean) => void;
  trekSelectorOpen: boolean;
  setTrekSelectorOpen: (open: boolean) => void;

  // ── Map state ────────────────────────────────────────────────────────────
  terrainEnabled: boolean;
  setTerrainEnabled: (enabled: boolean) => void;
  viewMode: 'map' | 'satellite' | 'terrain';
  setViewMode: (mode: 'map' | 'satellite' | 'terrain') => void;
  mapMode: 'world' | 'nepal';
  setMapMode: (mode: 'world' | 'nepal') => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // ── Trek ──────────────────────────────────────────────────────────────────
  selectedTrekId: null,
  selectedTrek: null,

  selectTrek: (id) => {
    if (!id) {
      set({
        selectedTrekId: null,
        selectedTrek: null,
        sidebarOpen: false,
        elevationProfileOpen: false,
        hoveredWaypointId: null,
        hoveredElevationDistance: null,
        trekDataLoading: false,
        trekDataError: null,
        trekLoadProgress: '',
      });
      return;
    }

    const base = getTrekById(id);
    if (!base) return;

    // Immediately load the complete, verified local trek data
    set({
      selectedTrekId: id,
      selectedTrek: { ...base, dataState: 'loaded' },
      sidebarOpen: true,
      elevationProfileOpen: Boolean(base.elevationProfile && base.elevationProfile.length > 0),
      hoveredWaypointId: null,
      hoveredElevationDistance: null,
      trekDataLoading: false,
      trekDataError: null,
      trekLoadProgress: '',
    });
  },

  // ── Live data ──────────────────────────────────────────────────────────────
  trekDataLoading: false,
  trekDataError: null,
  trekLoadProgress: '',
  updateSelectedTrek: (trek) => set({ selectedTrek: trek }),

  // ── Hover ──────────────────────────────────────────────────────────────────
  hoveredWaypointId: null,
  setHoveredWaypoint: (id) => set({ hoveredWaypointId: id }),
  hoveredElevationDistance: null,
  setHoveredElevationDistance: (dist) => set({ hoveredElevationDistance: dist }),

  // ── Search ─────────────────────────────────────────────────────────────────
  searchQuery: '',
  searchResults: [],
  isSearchOpen: false,

  setSearchQuery: (q) => {
    const query = q.trim().toLowerCase();
    if (!query) {
      set({ searchQuery: q, searchResults: [], isSearchOpen: false });
      return;
    }

    const trekResults: SearchResult[] = TREK_REGISTRY.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.region.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
    ).map((t) => ({
      id: `trek-${t.id}`,
      name: t.name,
      type: 'trek' as const,
      subtitle: `${t.region} · ${t.stats.durationDays.min}–${t.stats.durationDays.max} days`,
      lat: t.center.lat,
      lng: t.center.lng,
      elevation: t.stats.maxElevationM,
      trekId: t.id,
    }));

    // Search loaded waypoints on already-fetched treks
    const waypointResults: SearchResult[] = [];
    const { selectedTrek } = get();
    if (selectedTrek?.waypoints) {
      selectedTrek.waypoints.forEach((wp) => {
        if (wp.name.toLowerCase().includes(query)) {
          waypointResults.push({
            id: `wp-${wp.id}`,
            name: wp.name,
            type: 'village',
            subtitle: `${selectedTrek.name} · ${wp.elevation} m`,
            lat: wp.lat,
            lng: wp.lng,
            elevation: wp.elevation,
            trekId: selectedTrek.id,
          });
        }
      });
    }

    const placeResults = NEPAL_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.subtitle?.toLowerCase().includes(query) ?? false)
    );

    const results = [...trekResults, ...placeResults, ...waypointResults].slice(0, 12);
    set({ searchQuery: q, searchResults: results, isSearchOpen: results.length > 0 });
  },

  setSearchOpen: (open) => set({ isSearchOpen: open }),
  clearSearch: () => set({ searchQuery: '', searchResults: [], isSearchOpen: false }),

  // ── Panels ─────────────────────────────────────────────────────────────────
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  elevationProfileOpen: false,
  setElevationProfileOpen: (open) => set({ elevationProfileOpen: open }),
  trekSelectorOpen: true,
  setTrekSelectorOpen: (open) => set({ trekSelectorOpen: open }),

  // ── Map ────────────────────────────────────────────────────────────────────
  terrainEnabled: false,
  setTerrainEnabled: (enabled) => set({ terrainEnabled: enabled }),
  viewMode: 'map',
  setViewMode: (mode) => set({ viewMode: mode }),
  mapMode: 'nepal',
  setMapMode: (mode) => set({ mapMode: mode }),
}));
