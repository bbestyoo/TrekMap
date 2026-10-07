/**
 * Notable geographic places in Nepal for search/navigation.
 * Source: OpenStreetMap / GeoNames public data.
 */

import type { SearchResult } from '../../types';

export const NEPAL_PLACES: SearchResult[] = [
  // Cities
  { id: 'ktm', name: 'Kathmandu', type: 'city', subtitle: 'Capital of Nepal', lat: 27.7172, lng: 85.3240, elevation: 1400 },
  { id: 'pkr', name: 'Pokhara', type: 'city', subtitle: 'Gateway to Annapurna', lat: 28.2096, lng: 83.9856, elevation: 820 },
  { id: 'brt', name: 'Bharatpur', type: 'city', subtitle: 'Chitwan Province', lat: 27.6833, lng: 84.4333, elevation: 150 },
  { id: 'brt2', name: 'Biratnagar', type: 'city', subtitle: 'East Nepal', lat: 26.4831, lng: 87.2835, elevation: 72 },
  { id: 'dhm', name: 'Dhangadhi', type: 'city', subtitle: 'Far-Western Nepal', lat: 28.6833, lng: 80.6000, elevation: 190 },

  // Mountains
  { id: 'mt-everest', name: 'Mount Everest', type: 'mountain', subtitle: '8,849 m — World\'s highest', lat: 27.9881, lng: 86.9250, elevation: 8849 },
  { id: 'mt-annapurna', name: 'Annapurna I', type: 'mountain', subtitle: '8,091 m — 10th highest', lat: 28.5966, lng: 83.8200, elevation: 8091 },
  { id: 'mt-manaslu', name: 'Manaslu', type: 'mountain', subtitle: '8,163 m — 8th highest', lat: 28.5497, lng: 84.5597, elevation: 8163 },
  { id: 'mt-lhotse', name: 'Lhotse', type: 'mountain', subtitle: '8,516 m — 4th highest', lat: 27.9617, lng: 86.9330, elevation: 8516 },
  { id: 'mt-makalu', name: 'Makalu', type: 'mountain', subtitle: '8,485 m — 5th highest', lat: 27.8897, lng: 87.0882, elevation: 8485 },
  { id: 'mt-cho-oyu', name: 'Cho Oyu', type: 'mountain', subtitle: '8,188 m — 6th highest', lat: 28.0942, lng: 86.6608, elevation: 8188 },
  { id: 'mt-dhaulagiri', name: 'Dhaulagiri I', type: 'mountain', subtitle: '8,167 m — 7th highest', lat: 28.6976, lng: 83.4876, elevation: 8167 },
  { id: 'mt-ama-dablam', name: 'Ama Dablam', type: 'mountain', subtitle: '6,812 m — Khumbu icon', lat: 27.8612, lng: 86.8601, elevation: 6812 },
  { id: 'mt-macchhapuchhre', name: 'Machhapuchhre', type: 'mountain', subtitle: '6,993 m — Sacred fishtail peak', lat: 28.4986, lng: 83.9730, elevation: 6993 },
  { id: 'mt-kangchenjunga', name: 'Kangchenjunga', type: 'mountain', subtitle: '8,586 m — 3rd highest', lat: 27.7026, lng: 88.1476, elevation: 8586 },

  // Passes
  { id: 'pass-thorong', name: 'Thorong La Pass', type: 'pass', subtitle: '5,416 m — Annapurna Circuit', lat: 28.7951, lng: 83.9368, elevation: 5416 },
  { id: 'pass-larkya', name: 'Larkya La Pass', type: 'pass', subtitle: '5,106 m — Manaslu Circuit', lat: 28.6951, lng: 84.5631, elevation: 5106 },
  { id: 'pass-renjo', name: 'Renjo La Pass', type: 'pass', subtitle: '5,360 m — Three Passes', lat: 27.9700, lng: 86.6400, elevation: 5360 },
  { id: 'pass-cho-la', name: 'Cho La Pass', type: 'pass', subtitle: '5,420 m — Three Passes', lat: 27.9360, lng: 86.7600, elevation: 5420 },
  { id: 'pass-kongma-la', name: 'Kongma La Pass', type: 'pass', subtitle: '5,535 m — Three Passes', lat: 27.9500, lng: 86.8600, elevation: 5535 },

  // Lakes
  { id: 'lake-tilicho', name: 'Tilicho Lake', type: 'lake', subtitle: '4,919 m — World\'s highest lake', lat: 28.6951, lng: 83.8497, elevation: 4919 },
  { id: 'lake-phewa', name: 'Phewa Lake', type: 'lake', subtitle: 'Pokhara — iconic Annapurna reflection', lat: 28.2096, lng: 83.9533, elevation: 742 },
  { id: 'lake-gokyo', name: 'Gokyo Lakes', type: 'lake', subtitle: '4,750 m — Sacred Khumbu lakes', lat: 27.9614, lng: 86.6822, elevation: 4750 },
  { id: 'lake-rara', name: 'Rara Lake', type: 'lake', subtitle: '2,990 m — Largest lake in Nepal', lat: 29.5286, lng: 82.0888, elevation: 2990 },

  // Villages
  { id: 'v-namche', name: 'Namche Bazaar', type: 'village', subtitle: 'Khumbu — Sherpa capital', lat: 27.8069, lng: 86.7142, elevation: 3440 },
  { id: 'v-lukla', name: 'Lukla', type: 'village', subtitle: 'Khumbu gateway — Tenzing-Hillary Airport', lat: 27.6868, lng: 86.7295, elevation: 2860 },
  { id: 'v-chhomrong', name: 'Chhomrong', type: 'village', subtitle: 'Annapurna — Gurung village', lat: 28.4657, lng: 83.8011, elevation: 2170 },
  { id: 'v-manang', name: 'Manang', type: 'village', subtitle: 'Annapurna — acclimatization hub', lat: 28.6685, lng: 84.0213, elevation: 3500 },
  { id: 'v-muktinath', name: 'Muktinath', type: 'village', subtitle: 'Mustang — sacred pilgrimage site', lat: 28.8174, lng: 83.8718, elevation: 3800 },
  { id: 'v-kyanjin', name: 'Kyanjin Gompa', type: 'village', subtitle: 'Langtang — Buddhist monastery', lat: 28.2121, lng: 85.5638, elevation: 3870 },

  // Viewpoints
  { id: 'vp-poon-hill', name: 'Poon Hill', type: 'viewpoint', subtitle: '3,210 m — Classic Annapurna sunrise', lat: 28.4001, lng: 83.6879, elevation: 3210 },
  { id: 'vp-kala-patthar', name: 'Kala Patthar', type: 'viewpoint', subtitle: '5,545 m — Everest panorama viewpoint', lat: 27.9947, lng: 86.8297, elevation: 5545 },
  { id: 'vp-tserko', name: 'Tserko Ri', type: 'viewpoint', subtitle: '5,033 m — Langtang panorama', lat: 28.2130, lng: 85.5700, elevation: 5033 },

  // Regions
  { id: 'reg-khumbu', name: 'Khumbu Region', type: 'region', subtitle: 'Everest area', lat: 27.9000, lng: 86.7800 },
  { id: 'reg-annapurna', name: 'Annapurna Region', type: 'region', subtitle: 'Most trekked region in Nepal', lat: 28.5966, lng: 83.8200 },
  { id: 'reg-langtang', name: 'Langtang Region', type: 'region', subtitle: 'Near Kathmandu', lat: 28.2000, lng: 85.5000 },
  { id: 'reg-manaslu', name: 'Manaslu Region', type: 'region', subtitle: 'Remote restricted area', lat: 28.5497, lng: 84.5597 },
  { id: 'reg-mustang', name: 'Mustang Region', type: 'region', subtitle: 'Ancient Tibetan kingdom', lat: 28.9900, lng: 83.8500 },
];
