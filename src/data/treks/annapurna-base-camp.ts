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

};
