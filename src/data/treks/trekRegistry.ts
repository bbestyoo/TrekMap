/**
 * trekRegistry.ts
 *
 * Single source of truth for all trek metadata.
 * Exports full, curated, verified trekking data including:
 *   - routeGeoJSON (exact trail LineString from start to end)
 *   - waypoints (ordered trail waypoints with coordinates and elevations)
 *   - elevationProfile (elevation curve from 0 km to destination)
 *   - stats, difficulty, description, highlights, and cover images
 */

import { TREKS } from './index';
import type { Trek } from '../../types';
import { getTrekCoverImage } from '../../utils/trekImages';

export const TREK_REGISTRY: Trek[] = TREKS.map((t) => ({
  ...t,
  coverImage: t.coverImage || getTrekCoverImage(t.id),
  dataState: 'loaded',
  isDemoData: false,
}));

export function getTrekById(id: string): Trek | undefined {
  return TREK_REGISTRY.find((t) => t.id === id);
}

export function getTrekBySlug(slug: string): Trek | undefined {
  return TREK_REGISTRY.find((t) => t.slug === slug);
}
