/**
 * Curated cover image map for each trek.
 *
 * Uses Unsplash Source (source.unsplash.com) with specific search keywords
 * so the image always matches the destination — even if the underlying
 * photo rotates, the subject matter stays relevant.
 *
 * Format: https://source.unsplash.com/800x500/?{keywords}
 * These URLs 302-redirect to a relevant photo and are reliable.
 */

export const TREK_COVER_IMAGES: Record<string, string> = {
  // Everest Base Camp — Himalaya, glacier, Khumbu
  ebc:  'https://source.unsplash.com/800x500/?everest,himalaya,khumbu',
  // Annapurna Circuit — Annapurna, mountain pass, Nepal
  ac:   'https://source.unsplash.com/800x500/?annapurna,nepal,mountain,trek',
  // Annapurna Base Camp — sanctuary, fishtail, nepal
  abc:  'https://source.unsplash.com/800x500/?annapurna,sanctuary,nepal,fishtail',
  // Mardi Himal — ridge, rhododendron, nepal trekking
  mh:   'https://source.unsplash.com/800x500/?nepal,ridge,rhododendron,himalaya',
  // North Annapurna Base Camp — glacier, north face, dramatic
  nabc: 'https://source.unsplash.com/800x500/?glacier,himalaya,north,nepal',
  // Langtang Valley — valley, monastery, glacier, langtang
  lv:   'https://source.unsplash.com/800x500/?langtang,nepal,glacier,valley',
  // Manaslu Circuit — remote himalaya, manaslu
  mc:   'https://source.unsplash.com/800x500/?manaslu,remote,nepal,himalaya',
  // Upper Mustang — mustang,nepal,arid,tibetan,desert
  um:   'https://source.unsplash.com/800x500/?mustang,nepal,desert,tibetan,arid',
  // Panch Pokhari — lake,himalaya,sacred,nepal
  pp:   'https://source.unsplash.com/800x500/?himalaya,lake,sacred,nepal',
};

/** Returns the best cover image URL for a trek id. */
export function getTrekCoverImage(trekId: string): string {
  return TREK_COVER_IMAGES[trekId] ??
    'https://source.unsplash.com/800x500/?himalaya,nepal,mountain';
}
