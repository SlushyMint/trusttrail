export type CityLayer = 'background' | 'midground' | 'foreground';

export interface CityScene {
  setActive(active: boolean): void;
  destroy(): void;
}

export interface CitySceneOptions {
  host: HTMLDivElement;
  signal: AbortSignal;
  onError(): void;
  /** Read the shared Motion value inside the private ticker, without React updates. */
  readScroll?(): number;
}

export interface CityAsset {
  id: 'sky-far' | 'city-back' | 'city-mid' | 'city-front' | 'office-props';
  layer: CityLayer;
  src: string;
  width: number;
  height: number;
  alpha: boolean;
  anchor: 'center' | 'bottom-center';
  depth: number;
  notes: string;
}
