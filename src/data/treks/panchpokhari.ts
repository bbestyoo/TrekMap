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

};
