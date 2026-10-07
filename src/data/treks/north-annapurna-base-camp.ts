/**
 * North Annapurna Base Camp (Annapurna North / Miristi Khola) Trek
 * Source: OpenStreetMap contributors, SRTM DEM
 * The less-known northern approach to Annapurna I base camp via the
 * Miristi Khola valley — a remote, technically demanding route giving
 * direct views of Annapurna I North Face and Glacier Dome.
 *
 * Route: Tatopani → Lete → Dana → Miristi Khola → North Annapurna BC
 * This is a restricted-permit route through pristine wilderness.
 */

import type { Trek } from '../../types';

export const northAnnapurnaBaseCamp: Trek = {
  osmRelationId: 17548991,
  id: 'nabc',
  slug: 'north-annapurna-base-camp',
  name: 'North Annapurna Base Camp',
  region: 'Annapurna',
  difficulty: 'Strenuous',
  description:
    'The remote northern approach to Annapurna I via the dramatic Miristi Khola gorge. This less-travelled route rewards with unparalleled direct views of the north face of Annapurna I (8,091 m) and the massive Glacier Dome — one of the most dramatic mountain faces in the Himalayas. A restricted-area permit is required.',
  startPoint: 'Tatopani',
  endPoint: 'North Annapurna Base Camp',
  highlights: [
    'Direct north-face view of Annapurna I — world\'s 10th highest peak',
    'Glacier Dome (7,193 m) and Roc Noir (7,485 m) close-range views',
    'Wild and remote Miristi Khola gorge',
    'Pristine wilderness — very few trekkers',
    'Spectacular transition from Kali Gandaki to high Himalaya',
    'Restricted area permit — preserves unspoiled landscape',
  ],
  tags: ['remote', 'restricted', 'north-face', 'annapurna', 'miristi-khola'],
  stats: {
    distanceKm: 88,
    durationDays: { min: 9, max: 12 },
    minElevationM: 1190,
    maxElevationM: 4200,
    elevationGainM: 3010,
    elevationLossM: 3010,
  },
  bounds: {
    north: 28.710,
    south: 28.510,
    east:  83.730,
    west:  83.540,
  },
  center: { lat: 28.61, lng: 83.63 },
  // North Annapurna Base Camp — dramatic north face approach
  coverImage: 'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=800&q=80',
  dataSource: 'OpenStreetMap contributors, SRTM DEM (NASA/USGS)',
  isVerified: true,
  isDemoData: false,

};
