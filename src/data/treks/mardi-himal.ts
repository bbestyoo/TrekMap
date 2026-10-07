/**
 * Mardi Himal Trek
 * Source: OpenStreetMap contributors, SRTM DEM
 * A newer, less-crowded trek with spectacular views of Machhapuchhre and
 * the Annapurna range from the Mardi Himal High Camp (4,500 m).
 * Route: Kande → Forest Camp → Low Camp → High Camp → Mardi Himal Base Camp
 */

import type { Trek } from '../../types';

export const mardiHimal: Trek = {
  osmRelationId: 19267496,
  id: 'mh',
  slug: 'mardi-himal',
  name: 'Mardi Himal',
  region: 'Annapurna',
  difficulty: 'Moderate',
  description:
    'One of Nepal\'s best-kept trekking secrets. The Mardi Himal trail climbs the eastern ridge of the Annapurna range to a spectacular High Camp with jaw-dropping close-up views of Machhapuchhre (Fishtail) and Mardi Himal peak (5,587 m) — with a fraction of the crowds of the classic routes.',
  startPoint: 'Kande',
  endPoint: 'Mardi Himal High Camp',
  highlights: [
    'Intimate close-range views of Machhapuchhre (6,993 m)',
    'Uncrowded ridge trail with panoramic Annapurna skyline',
    'Rich rhododendron and bamboo forest zones',
    'High Camp at 4,500 m — sunrise over Himalayan giants',
    'Australian Camp — famous Pokhara valley viewpoint',
  ],
  tags: ['hidden-gem', 'ridge', 'uncrowded', 'annapurna', 'machhapuchhre'],
  stats: {
    distanceKm: 52,
    durationDays: { min: 5, max: 7 },
    minElevationM: 1520,
    maxElevationM: 4500,
    elevationGainM: 2980,
    elevationLossM: 2980,
  },
  bounds: {
    north: 28.530,
    south: 28.210,
    east:  83.980,
    west:  83.830,
  },
  center: { lat: 28.37, lng: 83.90 },
  // Mardi Himal — Machhapuchhre ridge, rhododendron forests
  coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  dataSource: 'OpenStreetMap contributors, SRTM DEM (NASA/USGS)',
  isVerified: true,
  isDemoData: false,

};
