import type { CityAsset } from './sceneTypes';

/** Original generated layers; native dimensions and alpha are retained in WebP. */
export const CITY_ASSETS = [
  { id: 'sky-far', layer: 'background', src: '/assets/living-city/sky-far.webp', width: 1672, height: 941, alpha: false, anchor: 'center', depth: 3, notes: 'Opaque midnight sky; quiet left copy area.' },
  { id: 'city-back', layer: 'background', src: '/assets/living-city/city-back.webp', width: 1672, height: 941, alpha: true, anchor: 'bottom-center', depth: 5, notes: 'Distant towers and bridge with transparent sky.' },
  { id: 'city-mid', layer: 'midground', src: '/assets/living-city/city-mid.webp', width: 1672, height: 941, alpha: true, anchor: 'bottom-center', depth: 8, notes: 'Warm-lit apartments and offices.' },
  { id: 'city-front', layer: 'foreground', src: '/assets/living-city/city-front.webp', width: 1672, height: 941, alpha: true, anchor: 'bottom-center', depth: 14, notes: 'Near parapets, vents and maintenance architecture.' },
  { id: 'office-props', layer: 'foreground', src: '/assets/living-city/office-props.webp', width: 1672, height: 941, alpha: true, anchor: 'bottom-center', depth: 18, notes: 'Sparse rooftop service cabinet, cables and leaves.' },
] as const satisfies readonly CityAsset[];

export const CITY_LIGHT_MASK = '/assets/living-city/city-mid-lights.webp';
export const CITY_STATIC = '/assets/living-city/city-static.webp';
