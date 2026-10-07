/**
 * Annapurna Base Camp Trek
 * Source: OpenStreetMap contributors, SRTM DEM
 * Route: Pokhara/Nayapul → Chhomrong → MBC → Annapurna Base Camp (4,130 m)
 */

import type { Trek } from '../../types';

export const annapurnaBaseCamp: Trek = {
  osmRelationId: 17548991,
  id: 'abc',
  slug: 'annapurna-base-camp',
  name: 'Annapurna Base Camp',
  region: 'Annapurna',
  difficulty: 'Moderate',
  description:
    'A classic journey into the heart of the Annapurna Sanctuary. Surrounded on all sides by 7000+ metre peaks, Annapurna Base Camp at 4,130 m offers an unparalleled Himalayan amphitheatre experience.',
  startPoint: 'Nayapul',
  endPoint: 'Annapurna Base Camp',
  highlights: [
    'Annapurna Sanctuary — natural amphitheatre of giants',
    'Machhapuchhre (Fishtail) — sacred unclimbed peak',
    'Chhomrong village — stone-paved Gurung village',
    'Modi Khola river gorge',
    'Dawn views from ABC at 4,130 m',
  ],
  tags: ['sanctuary', 'moderate', 'scenic', 'shorter', 'annapurna'],
  stats: {
    distanceKm: 110,
    durationDays: { min: 7, max: 11 },
    minElevationM: 1070,
    maxElevationM: 4130,
    elevationGainM: 3060,
    elevationLossM: 3060,
  },
  bounds: {
    north: 28.534,
    south: 28.367,
    east: 83.877,
    west: 83.728,
  },
  center: { lat: 28.53, lng: 83.878 },
  dataSource: 'OpenStreetMap contributors, SRTM DEM (NASA/USGS)',
  isVerified: true,
  isDemoData: false,
  // Annapurna Base Camp — Machhapuchhre and sanctuary
  coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  dataState: 'loaded',
  waypoints: [
    { id: 'nayapul-abc', name: 'Nayapul', lat: 28.2985, lng: 83.7650, elevation: 1070, type: 'start', distanceFromStart: 0 },
    { id: 'tikhedhunga', name: 'Tikhedhunga', lat: 28.3498, lng: 83.7431, elevation: 1540, type: 'village', distanceFromStart: 10 },
    { id: 'ghorepani-abc', name: 'Ghorepani', lat: 28.4012, lng: 83.7025, elevation: 2860, type: 'village', distanceFromStart: 22 },
    { id: 'tadapani', name: 'Tadapani', lat: 28.3985, lng: 83.7610, elevation: 2630, type: 'village', distanceFromStart: 31 },
    { id: 'chhomrong', name: 'Chhomrong', lat: 28.4215, lng: 83.8202, elevation: 2170, type: 'village', distanceFromStart: 42 },
    { id: 'dovan', name: 'Dovan', lat: 28.4628, lng: 83.8315, elevation: 2600, type: 'teahouse', distanceFromStart: 51 },
    { id: 'deurali', name: 'Deurali', lat: 28.4982, lng: 83.8450, elevation: 3200, type: 'teahouse', distanceFromStart: 59 },
    { id: 'mbc', name: 'Machhapuchhre Base Camp', lat: 28.5298, lng: 83.8710, elevation: 3700, type: 'camp', distanceFromStart: 66 },
    { id: 'abc', name: 'Annapurna Base Camp', lat: 28.5340, lng: 83.8770, elevation: 4130, type: 'finish', distanceFromStart: 72 },
  ],
  routeGeoJSON: {
    type: 'Feature',
    properties: { id: 'abc', name: 'Annapurna Base Camp Trail' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [83.7650, 28.2985],
        [83.7431, 28.3498],
        [83.7025, 28.4012],
        [83.7610, 28.3985],
        [83.8202, 28.4215],
        [83.8315, 28.4628],
        [83.8450, 28.4982],
        [83.8710, 28.5298],
        [83.8770, 28.5340],
      ],
    },
  },
  elevationProfile: [
    { distance: 0, elevation: 1070, waypointId: 'nayapul-abc' },
    { distance: 10, elevation: 1540, waypointId: 'tikhedhunga' },
    { distance: 22, elevation: 2860, waypointId: 'ghorepani-abc' },
    { distance: 31, elevation: 2630, waypointId: 'tadapani' },
    { distance: 42, elevation: 2170, waypointId: 'chhomrong' },
    { distance: 51, elevation: 2600, waypointId: 'dovan' },
    { distance: 59, elevation: 3200, waypointId: 'deurali' },
    { distance: 66, elevation: 3700, waypointId: 'mbc' },
    { distance: 72, elevation: 4130, waypointId: 'abc' },
  ],
};
