/**
 * Upper Mustang Trek
 * Source: OpenStreetMap contributors, SRTM DEM
 * Restricted area trek to the ancient Kingdom of Lo (Mustang).
 */

import type { Trek } from '../../types';

export const upperMustang: Trek = {
  osmRelationId: 4588145,
  id: 'um',
  slug: 'upper-mustang',
  name: 'Upper Mustang',
  region: 'Mustang',
  difficulty: 'Moderate',
  description: 'Journey into the forbidden kingdom of Lo — an ancient Tibetan enclave preserved in time. Dramatic arid landscapes, cave monasteries, and Tibetan-influenced villages behind the Himalayan rain shadow.',
  startPoint: 'Jomsom',
  endPoint: 'Lo Manthang',
  highlights: ['Lo Manthang — walled medieval city', 'Tiji Festival (May)', 'Sky caves of Mustang', 'Tibetan plateau landscape', 'Ancient monasteries dating to 1380 AD'],
  tags: ['restricted', 'cultural', 'arid', 'tibetan', 'mustang'],
  stats: {
    distanceKm: 120,
    durationDays: { min: 10, max: 14 },
    minElevationM: 2720,
    maxElevationM: 4200,
    elevationGainM: 2800,
    elevationLossM: 2800,
  },
  bounds: { north: 29.194, south: 28.780, east: 84.000, west: 83.700 },
  center: { lat: 28.99, lng: 83.85 },
  dataSource: 'OpenStreetMap contributors, SRTM DEM',
  isVerified: true,
  isDemoData: false,
  // Upper Mustang — arid Tibetan plateau landscape, Lo Manthang
  coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',

};
