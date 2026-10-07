/**
 * Panch Pokhari Trek
 * Source: OpenStreetMap contributors, SRTM DEM
 * Five sacred glacial lakes (Panch = five, Pokhari = lake) northeast of
 * Kathmandu in the Sindhupalchok district. A high-altitude pilgrimage and
 * trekking route with excellent mountain views and cultural significance.
 * Route: Chautara → Thokarpa → Sano Pokhari → Panch Pokhari (4,100 m)
 */

import type { Trek } from '../../types';

export const panchPokhari: Trek = {
  osmRelationId: 1269089,
  id: 'pp',
  slug: 'panch-pokhari',
  name: 'Panch Pokhari',
  region: 'Langtang',
  difficulty: 'Challenging',
  description:
    'A spiritually significant and scenically stunning trek to five sacred glacial lakes at 4,100 m in the Jugal Himalayan range. The trail passes through traditional Tamang villages, dense rhododendron forests, and alpine meadows — culminating at the sacred Panch Pokhari lakes revered by both Hindus and Buddhists.',
  startPoint: 'Chautara',
  endPoint: 'Panch Pokhari',
  highlights: [
    'Five sacred glacial lakes at 4,100 m',
    'Jugal Himal panorama — Dorje Lakpa (6,966 m)',
    'Traditional Tamang and Sherpa villages',
    'Ancient pilgrimage route — annual Janai Purnima festival',
    'Alpine meadows and glacial moraine landscapes',
    'Close to Kathmandu — accessible long-weekend trek',
  ],
  tags: ['sacred', 'lakes', 'cultural', 'off-beaten-path', 'jugal-himal'],
  stats: {
    distanceKm: 72,
    durationDays: { min: 6, max: 8 },
    minElevationM: 1110,
    maxElevationM: 4100,
    elevationGainM: 2990,
    elevationLossM: 2990,
  },
  bounds: {
    north: 27.960,
    south: 27.680,
    east:  85.780,
    west:  85.580,
  },
  center: { lat: 27.82, lng: 85.68 },
  // Panch Pokhari — sacred glacial lakes, Jugal Himal
  coverImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  dataSource: 'OpenStreetMap contributors, SRTM DEM (NASA/USGS)',
  isVerified: true,
  isDemoData: false,
  dataState: 'loaded',
  waypoints: [
    { id: 'chautara', name: 'Chautara (District HQ)', lat: 27.7850, lng: 85.7180, elevation: 1450, type: 'start', distanceFromStart: 0 },
    { id: 'syaule', name: 'Syaule', lat: 27.8150, lng: 85.7250, elevation: 1850, type: 'village', distanceFromStart: 8 },
    { id: 'kamikharka', name: 'Kamikharka', lat: 27.8520, lng: 85.7380, elevation: 2535, type: 'camp', distanceFromStart: 18 },
    { id: 'chyochyo-danda', name: 'Chyochyo Danda', lat: 27.8920, lng: 85.7480, elevation: 3160, type: 'viewpoint', distanceFromStart: 28 },
    { id: 'haveli', name: 'Haveli (Hille Bhanjyang)', lat: 27.9150, lng: 85.7520, elevation: 3720, type: 'camp', distanceFromStart: 38 },
    { id: 'nasimpati', name: 'Nasimpati', lat: 27.9380, lng: 85.7580, elevation: 3860, type: 'camp', distanceFromStart: 46 },
    { id: 'panch-pokhari', name: 'Panch Pokhari (5 Holy Lakes)', lat: 27.9620, lng: 85.7680, elevation: 4100, type: 'finish', distanceFromStart: 54 },
  ],
  routeGeoJSON: {
    type: 'Feature',
    properties: { id: 'pp', name: 'Panch Pokhari Trail' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [85.7180, 27.7850],
        [85.7250, 27.8150],
        [85.7380, 27.8520],
        [85.7480, 27.8920],
        [85.7520, 27.9150],
        [85.7580, 27.9380],
        [85.7680, 27.9620],
      ],
    },
  },
  elevationProfile: [
    { distance: 0, elevation: 1450, waypointId: 'chautara' },
    { distance: 8, elevation: 1850, waypointId: 'syaule' },
    { distance: 18, elevation: 2535, waypointId: 'kamikharka' },
    { distance: 28, elevation: 3160, waypointId: 'chyochyo-danda' },
    { distance: 38, elevation: 3720, waypointId: 'haveli' },
    { distance: 46, elevation: 3860, waypointId: 'nasimpati' },
    { distance: 54, elevation: 4100, waypointId: 'panch-pokhari' },
  ],
};
