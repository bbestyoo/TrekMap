/**
 * Langtang Valley Trek
 * Source: OpenStreetMap contributors, SRTM DEM
 */

import type { Trek } from '../../types';

export const langtangValley: Trek = {
  osmRelationId: 1269089,
  id: 'lv',
  slug: 'langtang-valley',
  name: 'Langtang Valley',
  region: 'Langtang',
  difficulty: 'Moderate',
  description: 'Nepal\'s closest major trekking region to Kathmandu. The Langtang Valley offers stunning glacier views, Tamang Buddhist culture, and the unique Kyanjin Gompa monastery at 3,870 m.',
  startPoint: 'Syabrubesi',
  endPoint: 'Kyanjin Ri',
  highlights: ['Kyanjin Gompa monastery', 'Langtang Glacier views', 'Tamang Heritage trail', 'Tserko Ri viewpoint (5,033 m)'],
  tags: ['accessible', 'cultural', 'glacier', 'moderate'],
  stats: {
    distanceKm: 65,
    durationDays: { min: 7, max: 10 },
    minElevationM: 1450,
    maxElevationM: 5033,
    elevationGainM: 3583,
    elevationLossM: 3583,
  },
  bounds: { north: 28.212, south: 28.082, east: 85.563, west: 85.341 },
  center: { lat: 28.21, lng: 85.56 },
  dataSource: 'OpenStreetMap contributors, SRTM DEM',
  isVerified: true,
  isDemoData: false,
  // Langtang Valley — glacial valley and monastery
  coverImage: 'https://images.unsplash.com/photo-1589182337358-2cb63099350c?w=800&q=80',

};
