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

};
