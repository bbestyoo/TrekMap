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
  dataState: 'loaded',
  waypoints: [
    { id: 'syabrubesi', name: 'Syabrubesi', lat: 28.1600, lng: 85.3410, elevation: 1450, type: 'start', distanceFromStart: 0 },
    { id: 'bamboo', name: 'Bamboo', lat: 28.1685, lng: 85.3720, elevation: 1970, type: 'teahouse', distanceFromStart: 6 },
    { id: 'lama-hotel', name: 'Lama Hotel (Changtang)', lat: 28.1812, lng: 85.4215, elevation: 2470, type: 'village', distanceFromStart: 12 },
    { id: 'ghodatabela', name: 'Ghodatabela', lat: 28.2010, lng: 85.4710, elevation: 3030, type: 'checkpoint', distanceFromStart: 18 },
    { id: 'langtang-village', name: 'New Langtang Village', lat: 28.2145, lng: 85.5012, elevation: 3430, type: 'village', distanceFromStart: 25 },
    { id: 'mundu', name: 'Mundu', lat: 28.2160, lng: 85.5210, elevation: 3550, type: 'village', distanceFromStart: 28 },
    { id: 'kyanjin-gompa', name: 'Kyanjin Gompa', lat: 28.2120, lng: 85.5630, elevation: 3870, type: 'landmark', distanceFromStart: 34 },
    { id: 'kyanjin-ri', name: 'Kyanjin Ri Viewpoint', lat: 28.2250, lng: 85.5710, elevation: 4773, type: 'viewpoint', distanceFromStart: 38 },
    { id: 'tserko-ri', name: 'Tserko Ri Summit', lat: 28.2410, lng: 85.6020, elevation: 5033, type: 'finish', distanceFromStart: 44 },
  ],
  routeGeoJSON: {
    type: 'Feature',
    properties: { id: 'lv', name: 'Langtang Valley Trail' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [85.3410, 28.1600],
        [85.3720, 28.1685],
        [85.4215, 28.1812],
        [85.4710, 28.2010],
        [85.5012, 28.2145],
        [85.5210, 28.2160],
        [85.5630, 28.2120],
        [85.5710, 28.2250],
        [85.6020, 28.2410],
      ],
    },
  },
  elevationProfile: [
    { distance: 0, elevation: 1450, waypointId: 'syabrubesi' },
    { distance: 6, elevation: 1970, waypointId: 'bamboo' },
    { distance: 12, elevation: 2470, waypointId: 'lama-hotel' },
    { distance: 18, elevation: 3030, waypointId: 'ghodatabela' },
    { distance: 25, elevation: 3430, waypointId: 'langtang-village' },
    { distance: 28, elevation: 3550, waypointId: 'mundu' },
    { distance: 34, elevation: 3870, waypointId: 'kyanjin-gompa' },
    { distance: 38, elevation: 4773, waypointId: 'kyanjin-ri' },
    { distance: 44, elevation: 5033, waypointId: 'tserko-ri' },
  ],
};
