// Native generated art is 1672 × 941; inset 32px on every edge for parallax.
export const CITY_VIEW = { width: 1608, height: 877, overscan: 32 } as const;

export const CITY_COLORS = {
  sky: 0x0b1423,
  haze: 0x142231,
  back: 0x1a2a3a,
  mid: 0x203746,
  front: 0x101f2c,
  light: 0x78d8c3,
  warm: 0xf0bf79,
} as const;

export const CITY_DEPTH = { background: 3, midground: 8, foreground: 18 } as const;

export function cityQuality(width: number, dpr: number, coarsePointer: boolean) {
  const compact = width < 768 || coarsePointer;
  return {
    name: compact ? 'compact' : 'desktop',
    resolution: Math.min(Math.max(dpr || 1, 1), compact ? 1.25 : 1.5),
    maxFPS: compact ? 30 : 60,
  } as const;
}

/** Cover the host, keep the street at its bottom, reserve space for bounded parallax. */
export function cityPlacement(width: number, height: number) {
  const scale = Math.max(width / CITY_VIEW.width, height / CITY_VIEW.height);
  return { scale, x: (width - CITY_VIEW.width * scale) / 2, y: height - CITY_VIEW.height * scale };
}

