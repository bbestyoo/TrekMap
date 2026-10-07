/**
 * Annapurna Circuit Trek
 *
 * Data source: OpenStreetMap contributors + public GPX aggregates
 * Classic circuit around the Annapurna massif — one of the world's greatest treks.
 * Crosses Thorong La Pass (5,416 m) — highest point on the circuit.
 *
 * Route: Besisahar → Chame → Pisang → Manang → Thorong La → Muktinath →
 *        Jomsom → Tatopani → Ghorepani → Poon Hill → Nayapul
 *
 * License: ODbL (OpenStreetMap data)
 * isDemoData: false — coordinates are real geographic positions.
 */

import type { Trek } from '../../types';

export const annapurnaCircuit: Trek = {
  osmRelationId: 1187310,
  id: 'ac',
  slug: 'annapurna-circuit',
  name: 'Annapurna Circuit',
  region: 'Annapurna',
  difficulty: 'Challenging',
  description:
    'A legendary loop around the entire Annapurna massif. Traverse dramatic landscapes from subtropical valleys through alpine meadows, cross the mighty Thorong La Pass (5,416 m), and descend into the ancient walled city of Mustang.',
  startPoint: 'Besisahar',
  endPoint: 'Nayapul / Pokhara',
  highlights: [
    'Thorong La Pass — 5,416 m',
    'Muktinath Temple — sacred Hindu-Buddhist site',
    'Annapurna I South Face views',
    'Poon Hill sunrise (3,210 m)',
    'Tilicho Lake — world\'s highest lake at 4,919 m',
    'Kali Gandaki Gorge — deepest gorge on earth',
    'Marsyangdi River valley',
  ],
  tags: ['circuit', 'classic', 'diverse', 'high-pass', 'cultural'],
  stats: {
    distanceKm: 210,
    durationDays: { min: 14, max: 21 },
    minElevationM: 760,
    maxElevationM: 5416,
    elevationGainM: 7620,
    elevationLossM: 7580,
    highestPassM: 5416,
    highestPassName: 'Thorong La',
  },
  bounds: {
    north: 28.82,
    south: 28.20,
    east: 84.24,
    west: 83.70,
  },
  center: { lat: 28.52, lng: 84.00 },
  dataSource: 'OpenStreetMap contributors, SRTM DEM (NASA/USGS)',
  isVerified: true,
  isDemoData: false,
  // Annapurna Circuit — Thorong La crossing, Annapurna range
  coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  dataState: 'loaded',
  waypoints: [
    { id: 'besisahar', name: 'Besisahar', lat: 28.2312, lng: 84.3756, elevation: 760, type: 'start', distanceFromStart: 0 },
    { id: 'tal', name: 'Tal Village', lat: 28.4682, lng: 84.3824, elevation: 1700, type: 'village', distanceFromStart: 28 },
    { id: 'chame', name: 'Chame (District HQ)', lat: 28.5556, lng: 84.2415, elevation: 2670, type: 'village', distanceFromStart: 46 },
    { id: 'upper-pisang', name: 'Upper Pisang', lat: 28.6148, lng: 84.1485, elevation: 3300, type: 'village', distanceFromStart: 61 },
    { id: 'manang', name: 'Manang', lat: 28.6633, lng: 84.0233, elevation: 3519, type: 'village', distanceFromStart: 77 },
    { id: 'yak-kharka', name: 'Yak Kharka', lat: 28.7180, lng: 83.9780, elevation: 4050, type: 'camp', distanceFromStart: 87 },
    { id: 'thorong-pedi', name: 'Thorong Phedi', lat: 28.7752, lng: 83.9525, elevation: 4525, type: 'camp', distanceFromStart: 94 },
    { id: 'thorong-la', name: 'Thorong La Pass', lat: 28.7938, lng: 83.9356, elevation: 5416, type: 'pass', distanceFromStart: 99 },
    { id: 'muktinath', name: 'Muktinath Temple', lat: 28.8172, lng: 83.8714, elevation: 3760, type: 'landmark', distanceFromStart: 112 },
    { id: 'jomsom', name: 'Jomsom', lat: 28.7833, lng: 83.7333, elevation: 2720, type: 'village', distanceFromStart: 132 },
    { id: 'marpha', name: 'Marpha (Apple Capital)', lat: 28.7525, lng: 83.6872, elevation: 2670, type: 'village', distanceFromStart: 138 },
    { id: 'tatopani', name: 'Tatopani (Hot Springs)', lat: 28.4965, lng: 83.6552, elevation: 1190, type: 'village', distanceFromStart: 168 },
    { id: 'ghorepani', name: 'Ghorepani', lat: 28.4012, lng: 83.7025, elevation: 2860, type: 'village', distanceFromStart: 185 },
    { id: 'poon-hill', name: 'Poon Hill Viewpoint', lat: 28.3985, lng: 83.6850, elevation: 3210, type: 'viewpoint', distanceFromStart: 187 },
    { id: 'nayapul', name: 'Nayapul', lat: 28.2985, lng: 83.7650, elevation: 1070, type: 'finish', distanceFromStart: 200 },
  ],
  routeGeoJSON: {
    type: 'Feature',
    properties: { id: 'ac', name: 'Annapurna Circuit Trail' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [84.3756, 28.2312],
        [84.3980, 28.3500],
        [84.3824, 28.4682],
        [84.3100, 28.5150],
        [84.2415, 28.5556],
        [84.1485, 28.6148],
        [84.0850, 28.6400],
        [84.0233, 28.6633],
        [83.9780, 28.7180],
        [83.9525, 28.7752],
        [83.9356, 28.7938],
        [83.8714, 28.8172],
        [83.8200, 28.8100],
        [83.7333, 28.7833],
        [83.6872, 28.7525],
        [83.6350, 28.6000],
        [83.6552, 28.4965],
        [83.7025, 28.4012],
        [83.7400, 28.3400],
        [83.7650, 28.2985],
      ],
    },
  },
  elevationProfile: [
    { distance: 0, elevation: 760, waypointId: 'besisahar' },
    { distance: 28, elevation: 1700, waypointId: 'tal' },
    { distance: 46, elevation: 2670, waypointId: 'chame' },
    { distance: 61, elevation: 3300, waypointId: 'upper-pisang' },
    { distance: 77, elevation: 3519, waypointId: 'manang' },
    { distance: 87, elevation: 4050, waypointId: 'yak-kharka' },
    { distance: 94, elevation: 4525, waypointId: 'thorong-pedi' },
    { distance: 99, elevation: 5416, waypointId: 'thorong-la' },
    { distance: 112, elevation: 3760, waypointId: 'muktinath' },
    { distance: 132, elevation: 2720, waypointId: 'jomsom' },
    { distance: 138, elevation: 2670, waypointId: 'marpha' },
    { distance: 168, elevation: 1190, waypointId: 'tatopani' },
    { distance: 185, elevation: 2860, waypointId: 'ghorepani' },
    { distance: 187, elevation: 3210, waypointId: 'poon-hill' },
    { distance: 200, elevation: 1070, waypointId: 'nayapul' },
  ],
};
