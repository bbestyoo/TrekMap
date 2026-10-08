import { create } from 'zustand';
import type { SearchResult, Trek, Waypoint, WaypointType } from '../types';
import { TREK_REGISTRY, getTrekById } from '../data/treks/trekRegistry';
import { NEPAL_PLACES } from '../data/places/nepal-places';

interface AppStore {
  // ── Trek selection ──────────────────────────────────────────────────────
  selectedTrekId: string | null;
  selectedTrek: Trek | null;
  selectTrek: (id: string | null) => void;

  // ── Compare Treks Mode ──────────────────────────────────────────────────
  compareTrekId: string | null;
  compareTrek: Trek | null;
  setCompareTrekId: (id: string | null) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  // ── Waypoint Details Modal / Drawer ─────────────────────────────────────
  activeWaypoint: Waypoint | null;
  setActiveWaypoint: (wp: Waypoint | null) => void;
  waypointFilter: WaypointType | 'all';
  setWaypointFilter: (filter: WaypointType | 'all') => void;
  showWaypointsOnMap: boolean;
  setShowWaypointsOnMap: (show: boolean) => void;

  // ── Virtual Hike Mode ───────────────────────────────────────────────────
  isHikePlaying: boolean;
  hikeProgress: number; // 0 to 100 percentage
  hikeSpeed: number; // multiplier 1x, 2x, 5x
  currentHikePoint: {
    lat: number;
    lng: number;
    elevation: number;
    distanceKm: number;
    nearestWaypoint?: Waypoint;
    dayNumber: number;
    totalDays: number;
  } | null;
  startVirtualHike: () => void;
  pauseVirtualHike: () => void;
  setHikeProgress: (progress: number) => void;
  setHikeSpeed: (speed: number) => void;

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

  // ── Intro cinematic state ───────────────────────────────────────────────
  isIntroPlaying: boolean;
  setIsIntroPlaying: (playing: boolean) => void;

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
        isHikePlaying: false,
        hikeProgress: 0,
        currentHikePoint: null,
      });
      // Sync URL
      if (window.history.pushState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('trek');
        window.history.pushState({}, '', url.toString());
      }
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
      isHikePlaying: false,
      hikeProgress: 0,
    });

    // Update URL query param for shareable view
    if (window.history.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.set('trek', base.slug || base.id);
      window.history.pushState({}, '', url.toString());
    }
  },

  // ── Compare ───────────────────────────────────────────────────────────────
  compareTrekId: null,
  compareTrek: null,
  isCompareOpen: false,
  setCompareTrekId: (id) => {
    if (!id) {
      set({ compareTrekId: null, compareTrek: null });
      return;
    }
    const trek = getTrekById(id);
    set({ compareTrekId: id, compareTrek: trek ? { ...trek, dataState: 'loaded' } : null });
  },
  setIsCompareOpen: (open) => set({ isCompareOpen: open }),

  // ── Waypoint Details & Filters ───────────────────────────────────────────
  activeWaypoint: null,
  setActiveWaypoint: (wp) => set({ activeWaypoint: wp }),
  waypointFilter: 'all',
  setWaypointFilter: (filter) => set({ waypointFilter: filter }),
  showWaypointsOnMap: true,
  setShowWaypointsOnMap: (show) => set({ showWaypointsOnMap: show }),

  // ── Virtual Hike ─────────────────────────────────────────────────────────
  isHikePlaying: false,
  hikeProgress: 0,
  hikeSpeed: 1,
  currentHikePoint: null,
  startVirtualHike: () => set({ isHikePlaying: true }),
  pauseVirtualHike: () => set({ isHikePlaying: false }),
  setHikeProgress: (progress) => {
    const { selectedTrek } = get();
    if (!selectedTrek || !selectedTrek.routeGeoJSON) {
      set({ hikeProgress: progress });
      return;
    }

    const coords = selectedTrek.routeGeoJSON.geometry.coordinates;
    const totalPoints = coords.length;
    if (totalPoints === 0) return;

    const targetIdx = Math.min(
      totalPoints - 1,
      Math.floor((progress / 100) * (totalPoints - 1))
    );
    const [lng, lat] = coords[targetIdx];

    const totalDist = selectedTrek.stats.distanceKm;
    const distKm = (progress / 100) * totalDist;
    const totalDays = selectedTrek.stats.durationDays.max;
    const dayNumber = Math.max(1, Math.min(totalDays, Math.ceil((progress / 100) * totalDays)));

    // Estimate elevation from profile
    let elev = selectedTrek.stats.minElevationM;
    if (selectedTrek.elevationProfile && selectedTrek.elevationProfile.length > 0) {
      const p = selectedTrek.elevationProfile;
      const nearestP = p.reduce((prev, curr) =>
        Math.abs(curr.distance - distKm) < Math.abs(prev.distance - distKm) ? curr : prev
      );
      elev = nearestP.elevation;
    }

    // Find nearest named waypoint
    let nearestWp: Waypoint | undefined;
    if (selectedTrek.waypoints && selectedTrek.waypoints.length > 0) {
      nearestWp = selectedTrek.waypoints.reduce((prev, curr) => {
        const dCurr = Math.hypot(curr.lng - lng, curr.lat - lat);
        const dPrev = Math.hypot(prev.lng - lng, prev.lat - lat);
        return dCurr < dPrev ? curr : prev;
      });
    }

    set({
      hikeProgress: progress,
      currentHikePoint: {
        lat,
        lng,
        elevation: elev,
        distanceKm: Math.round(distKm * 10) / 10,
        nearestWaypoint: nearestWp,
        dayNumber,
        totalDays,
      },
    });
  },
  setHikeSpeed: (speed) => set({ hikeSpeed: speed }),

  // ── Intro cinematic ──────────────────────────────────────────────────────
  isIntroPlaying: true,
  setIsIntroPlaying: (playing) => set({ isIntroPlaying: playing }),

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
