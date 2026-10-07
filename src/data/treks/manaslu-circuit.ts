/**
 * Manaslu Circuit Trek
 * Source: OpenStreetMap contributors, SRTM DEM
 * Crosses Larkya La Pass (5,106 m) around the world's 8th highest peak.
 */

import type { Trek } from '../../types';

export const manasluCircuit: Trek = {
  osmRelationId: 19876603,
  id: 'mc',
  slug: 'manaslu-circuit',
  name: 'Manaslu Circuit',
  region: 'Manaslu',
  difficulty: 'Strenuous',
  description: 'A remote, restricted-area circuit around Manaslu (8,163 m) — the world\'s 8th highest peak. Crosses the dramatic Larkya La Pass at 5,106 m through pristine wilderness with minimal commercial trekking crowds.',
  startPoint: 'Soti Khola',
  endPoint: 'Besisahar',
  highlights: ['Larkya La Pass (5,106 m)', 'Birendra Lake', 'Tsum Valley access', 'Remote Tibetan-influenced villages', 'Manaslu Glacier views'],
  tags: ['remote', 'restricted', 'circuit', 'high-pass', 'manaslu'],
  stats: {
    distanceKm: 177,
    durationDays: { min: 14, max: 18 },
    minElevationM: 700,
    maxElevationM: 5106,
    elevationGainM: 6800,
    elevationLossM: 6700,
    highestPassM: 5106,
    highestPassName: 'Larkya La',
  },
  bounds: { north: 28.755, south: 28.195, east: 84.705, west: 84.490 },
  center: { lat: 28.55, lng: 84.56 },
  dataSource: 'OpenStreetMap contributors, SRTM DEM',
  isVerified: true,
  isDemoData: false,
  // Manaslu Circuit — remote Himalayan valley
  coverImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',

};
