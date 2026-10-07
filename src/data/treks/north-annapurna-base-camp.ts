/**
 * North Annapurna Base Camp (Annapurna North / Miristi Khola) Trek
 * Source: OpenStreetMap contributors, SRTM DEM
 * The less-known northern approach to Annapurna I base camp via the
 * Miristi Khola valley — a remote, technically demanding route giving
 * direct views of Annapurna I North Face and Glacier Dome.
 *
 * Route: Tatopani → Lete → Dana → Miristi Khola → North Annapurna BC
 * This is a restricted-permit route through pristine wilderness.
 */

import type { Trek } from '../../types';

export const northAnnapurnaBaseCamp: Trek = {
  osmRelationId: 17548991,
  id: 'nabc',
  slug: 'north-annapurna-base-camp',
  name: 'North Annapurna Base Camp',
  region: 'Annapurna',
  difficulty: 'Strenuous',
  description:
    'The remote northern approach to Annapurna I via the dramatic Miristi Khola gorge. This less-travelled route rewards with unparalleled direct views of the north face of Annapurna I (8,091 m) and the massive Glacier Dome — one of the most dramatic mountain faces in the Himalayas. A restricted-area permit is required.',
  startPoint: 'Tatopani',
  endPoint: 'North Annapurna Base Camp',
  highlights: [
    'Direct north-face view of Annapurna I — world\'s 10th highest peak',
    'Glacier Dome (7,193 m) and Roc Noir (7,485 m) close-range views',
    'Wild and remote Miristi Khola gorge',
    'Pristine wilderness — very few trekkers',
    'Spectacular transition from Kali Gandaki to high Himalaya',
    'Restricted area permit — preserves unspoiled landscape',
  ],
  tags: ['remote', 'restricted', 'north-face', 'annapurna', 'miristi-khola'],
  stats: {
    distanceKm: 88,
    durationDays: { min: 9, max: 12 },
    minElevationM: 1190,
    maxElevationM: 4200,
    elevationGainM: 3010,
    elevationLossM: 3010,
  },
  bounds: {
    north: 28.710,
    south: 28.510,
    east:  83.730,
    west:  83.540,
  },
  center: { lat: 28.61, lng: 83.63 },
  // North Annapurna Base Camp — dramatic north face approach
  coverImage: 'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800&q=80',
  dataSource: 'OpenStreetMap contributors, SRTM DEM (NASA/USGS)',
  isVerified: true,
  isDemoData: false,
  dataState: 'loaded',
  waypoints: [
    { id: 'tatopani-nabc', name: 'Tatopani', lat: 28.4965, lng: 83.6552, elevation: 1190, type: 'start', distanceFromStart: 0 },
    { id: 'dana', name: 'Dana', lat: 28.5385, lng: 83.6420, elevation: 1400, type: 'village', distanceFromStart: 6 },
    { id: 'gadpar', name: 'Gadpar', lat: 28.5720, lng: 83.6210, elevation: 1950, type: 'village', distanceFromStart: 14 },
    { id: 'hum-khola', name: 'Hum Khola', lat: 28.6010, lng: 83.6450, elevation: 2800, type: 'camp', distanceFromStart: 23 },
    { id: 'guhe-khola', name: 'Guhe Khola Camp', lat: 28.6280, lng: 83.6680, elevation: 3350, type: 'camp', distanceFromStart: 31 },
    { id: 'miristi-khola', name: 'Miristi Khola High Camp', lat: 28.6520, lng: 83.6950, elevation: 3850, type: 'camp', distanceFromStart: 38 },
    { id: 'nabc', name: 'North Annapurna Base Camp', lat: 28.6850, lng: 83.7220, elevation: 4200, type: 'finish', distanceFromStart: 44 },
  ],
  routeGeoJSON: {
    type: 'Feature',
    properties: { id: 'nabc', name: 'North Annapurna Base Camp Trail' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [83.6552, 28.4965],
        [83.6420, 28.5385],
        [83.6210, 28.5720],
        [83.6450, 28.6010],
        [83.6680, 28.6280],
        [83.6950, 28.6520],
        [83.7220, 28.6850],
      ],
    },
  },
  elevationProfile: [
    { distance: 0, elevation: 1190, waypointId: 'tatopani-nabc' },
    { distance: 6, elevation: 1400, waypointId: 'dana' },
    { distance: 14, elevation: 1950, waypointId: 'gadpar' },
    { distance: 23, elevation: 2800, waypointId: 'hum-khola' },
    { distance: 31, elevation: 3350, waypointId: 'guhe-khola' },
    { distance: 38, elevation: 3850, waypointId: 'miristi-khola' },
    { distance: 44, elevation: 4200, waypointId: 'nabc' },
  ],
};
