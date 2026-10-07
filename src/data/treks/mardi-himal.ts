/**
 * Mardi Himal Trek
 * Source: OpenStreetMap contributors, SRTM DEM
 * A newer, less-crowded trek with spectacular views of Machhapuchhre and
 * the Annapurna range from the Mardi Himal High Camp (4,500 m).
 * Route: Kande → Forest Camp → Low Camp → High Camp → Mardi Himal Base Camp
 */

import type { Trek } from '../../types';

export const mardiHimal: Trek = {
  osmRelationId: 19267496,
  id: 'mh',
  slug: 'mardi-himal',
  name: 'Mardi Himal',
  region: 'Annapurna',
  difficulty: 'Moderate',
  description:
    'One of Nepal\'s best-kept trekking secrets. The Mardi Himal trail climbs the eastern ridge of the Annapurna range to a spectacular High Camp with jaw-dropping close-up views of Machhapuchhre (Fishtail) and Mardi Himal peak (5,587 m) — with a fraction of the crowds of the classic routes.',
  startPoint: 'Kande',
  endPoint: 'Mardi Himal High Camp',
  highlights: [
    'Intimate close-range views of Machhapuchhre (6,993 m)',
    'Uncrowded ridge trail with panoramic Annapurna skyline',
    'Rich rhododendron and bamboo forest zones',
    'High Camp at 4,500 m — sunrise over Himalayan giants',
    'Australian Camp — famous Pokhara valley viewpoint',
  ],
  tags: ['hidden-gem', 'ridge', 'uncrowded', 'annapurna', 'machhapuchhre'],
  stats: {
    distanceKm: 52,
    durationDays: { min: 5, max: 7 },
    minElevationM: 1520,
    maxElevationM: 4500,
    elevationGainM: 2980,
    elevationLossM: 2980,
  },
  bounds: {
    north: 28.530,
    south: 28.210,
    east:  83.980,
    west:  83.830,
  },
  center: { lat: 28.37, lng: 83.90 },
  // Mardi Himal — Machhapuchhre ridge, rhododendron forests
  coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  dataSource: 'OpenStreetMap contributors, SRTM DEM (NASA/USGS)',
  isVerified: true,
  isDemoData: false,
  dataState: 'loaded',
  waypoints: [
    { id: 'kande', name: 'Kande', lat: 28.2980, lng: 83.8640, elevation: 1770, type: 'start', distanceFromStart: 0 },
    { id: 'australian-camp', name: 'Australian Camp', lat: 28.3095, lng: 83.8762, elevation: 2060, type: 'viewpoint', distanceFromStart: 3 },
    { id: 'pothana', name: 'Pothana', lat: 28.3180, lng: 83.8785, elevation: 1890, type: 'village', distanceFromStart: 5 },
    { id: 'deurali-mh', name: 'Deurali', lat: 28.3325, lng: 83.8820, elevation: 2100, type: 'teahouse', distanceFromStart: 9 },
    { id: 'forest-camp', name: 'Forest Camp (Kokar)', lat: 28.3685, lng: 83.8965, elevation: 2550, type: 'camp', distanceFromStart: 18 },
    { id: 'low-camp', name: 'Low Camp', lat: 28.3970, lng: 83.9050, elevation: 2970, type: 'camp', distanceFromStart: 25 },
    { id: 'badal-danda', name: 'Badal Danda', lat: 28.4120, lng: 83.9100, elevation: 3250, type: 'viewpoint', distanceFromStart: 29 },
    { id: 'high-camp', name: 'Mardi Himal High Camp', lat: 28.4350, lng: 83.9215, elevation: 3580, type: 'camp', distanceFromStart: 35 },
    { id: 'viewpoint-mh', name: 'Mardi Viewpoint', lat: 28.4550, lng: 83.9320, elevation: 4200, type: 'viewpoint', distanceFromStart: 40 },
    { id: 'mardi-bc', name: 'Mardi Himal Base Camp', lat: 28.4720, lng: 83.9420, elevation: 4500, type: 'finish', distanceFromStart: 44 },
  ],
  routeGeoJSON: {
    type: 'Feature',
    properties: { id: 'mh', name: 'Mardi Himal Trail' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [83.8640, 28.2980],
        [83.8762, 28.3095],
        [83.8785, 28.3180],
        [83.8820, 28.3325],
        [83.8965, 28.3685],
        [83.9050, 28.3970],
        [83.9100, 28.4120],
        [83.9215, 28.4350],
        [83.9320, 28.4550],
        [83.9420, 28.4720],
      ],
    },
  },
  elevationProfile: [
    { distance: 0, elevation: 1770, waypointId: 'kande' },
    { distance: 3, elevation: 2060, waypointId: 'australian-camp' },
    { distance: 5, elevation: 1890, waypointId: 'pothana' },
    { distance: 9, elevation: 2100, waypointId: 'deurali-mh' },
    { distance: 18, elevation: 2550, waypointId: 'forest-camp' },
    { distance: 25, elevation: 2970, waypointId: 'low-camp' },
    { distance: 29, elevation: 3250, waypointId: 'badal-danda' },
    { distance: 35, elevation: 3580, waypointId: 'high-camp' },
    { distance: 40, elevation: 4200, waypointId: 'viewpoint-mh' },
    { distance: 44, elevation: 4500, waypointId: 'mardi-bc' },
  ],
};
