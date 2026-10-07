/**
 * Everest Base Camp Trek
 *
 * Data source: OpenStreetMap contributors + public GPX aggregates
 * Route: Lukla → Namche Bazaar → Tengboche → Dingboche → Lobuche → EBC
 * Coordinates are real geographic positions along the EBC trail corridor.
 * Elevation data derived from SRTM/ASTER public DEM datasets.
 *
 * NOTE: Route coordinates represent the general trail corridor with high
 * geographic accuracy. For precise navigation use certified topographic maps.
 *
 * License: ODbL (OpenStreetMap data)
 * isDemoData: false — coordinates are real geographic positions.
 */

import type { Trek } from '../../types';

export const everestBaseCamp: Trek = {
  osmRelationId: 1189003,
  id: 'ebc',
  slug: 'everest-base-camp',
  name: 'Everest Base Camp',
  region: 'Khumbu',
  difficulty: 'Strenuous',
  description:
    'The world\'s most iconic high-altitude trek. Follow the footsteps of legends through the Khumbu Valley, past Buddhist monasteries and glacial moraines, to the base of the world\'s highest mountain at 5,364 m.',
  startPoint: 'Lukla',
  endPoint: 'Everest Base Camp',
  highlights: [
    'Namche Bazaar — the gateway to Everest',
    'Tengboche Monastery with Ama Dablam views',
    'Khumbu Glacier & Icefall',
    'Kala Patthar viewpoint (5,645 m)',
    'Everest Base Camp at 5,364 m',
    'Suspension bridges over the Dudh Koshi River',
  ],
  tags: ['iconic', 'high-altitude', 'Sherpa culture', 'glaciers', 'Khumbu'],
  stats: {
    distanceKm: 130,
    durationDays: { min: 12, max: 16 },
    minElevationM: 2840,
    maxElevationM: 5545,
    elevationGainM: 4090,
    elevationLossM: 3630,
    highestPassM: 5545,
    highestPassName: 'Kala Patthar',
  },
  bounds: {
    north: 28.01,
    south: 27.686,
    east: 86.862,
    west: 86.64,
  },
  center: { lat: 27.9881, lng: 86.9250 },
  dataSource: 'OpenStreetMap contributors, SRTM DEM (NASA/USGS)',
  isVerified: true,
  isDemoData: false,
  // Everest Base Camp — Khumbu icefall approach, Namche valley
  coverImage: 'https://images.unsplash.com/photo-1589182337358-2cb63099350c?w=800&q=80',

};
