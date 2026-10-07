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
  dataState: 'loaded',
  waypoints: [
    { id: 'jomsom-um', name: 'Jomsom', lat: 28.7833, lng: 83.7333, elevation: 2720, type: 'start', distanceFromStart: 0 },
    { id: 'kagbeni', name: 'Kagbeni (Gateway to Lo)', lat: 28.8350, lng: 83.7820, elevation: 2810, type: 'checkpoint', distanceFromStart: 11 },
    { id: 'chele', name: 'Chele', lat: 28.9100, lng: 83.7920, elevation: 3050, type: 'village', distanceFromStart: 26 },
    { id: 'syangboche', name: 'Syangboche', lat: 28.9850, lng: 83.7950, elevation: 3800, type: 'village', distanceFromStart: 41 },
    { id: 'ghami', name: 'Ghami (Long Mani Wall)', lat: 29.0450, lng: 83.8750, elevation: 3520, type: 'village', distanceFromStart: 53 },
    { id: 'tsarang', name: 'Tsarang (Charang Gompa)', lat: 29.1120, lng: 83.9150, elevation: 3560, type: 'village', distanceFromStart: 66 },
    { id: 'lo-manthang', name: 'Lo Manthang (Walled City)', lat: 29.1820, lng: 83.9550, elevation: 3840, type: 'landmark', distanceFromStart: 80 },
    { id: 'chhoser', name: 'Chhoser Cave Monasteries', lat: 29.2150, lng: 83.9720, elevation: 3920, type: 'viewpoint', distanceFromStart: 88 },
    { id: 'lo-manthang-finish', name: 'Lo Manthang', lat: 29.1820, lng: 83.9550, elevation: 3840, type: 'finish', distanceFromStart: 96 },
  ],
  routeGeoJSON: {
    type: 'Feature',
    properties: { id: 'um', name: 'Upper Mustang Trail' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [83.7333, 28.7833],
        [83.7820, 28.8350],
        [83.7920, 28.9100],
        [83.7950, 28.9850],
        [83.8750, 29.0450],
        [83.9150, 29.1120],
        [83.9550, 29.1820],
        [83.9720, 29.2150],
        [83.9550, 29.1820],
      ],
    },
  },
  elevationProfile: [
    { distance: 0, elevation: 2720, waypointId: 'jomsom-um' },
    { distance: 11, elevation: 2810, waypointId: 'kagbeni' },
    { distance: 26, elevation: 3050, waypointId: 'chele' },
    { distance: 41, elevation: 3800, waypointId: 'syangboche' },
    { distance: 53, elevation: 3520, waypointId: 'ghami' },
    { distance: 66, elevation: 3560, waypointId: 'tsarang' },
    { distance: 80, elevation: 3840, waypointId: 'lo-manthang' },
    { distance: 88, elevation: 3920, waypointId: 'chhoser' },
    { distance: 96, elevation: 3840, waypointId: 'lo-manthang-finish' },
  ],
};
