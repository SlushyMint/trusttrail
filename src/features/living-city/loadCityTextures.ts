import { ImageSource, Texture } from 'pixi.js';
import { CITY_ASSETS, CITY_LIGHT_MASK } from './sceneAssets';

export interface CityTextures {
  layers: Texture[];
  lights: Texture;
  destroy(): void;
}

/** Own GPU textures per scene; the browser may reuse HTTP bytes, never Pixi cache entries. */
export async function loadCityTextures(signal: AbortSignal, compact = false): Promise<CityTextures> {
  if (typeof createImageBitmap !== 'function') throw new Error('City texture decoding is unavailable');
  const controller = new AbortController();
  const bitmaps: ImageBitmap[] = [];
  const textures: Texture[] = [];
  const abort = () => controller.abort();
  signal.addEventListener('abort', abort, { once: true });
  if (signal.aborted) controller.abort();

  async function load(src: string): Promise<ImageBitmap> {
    const response = await fetch(src, { signal: controller.signal });
    if (!response.ok) throw new Error(`City asset unavailable: ${src}`);
    const bitmap = await createImageBitmap(await response.blob(), { premultiplyAlpha: 'premultiply' });
    // Bitmap decoding itself cannot be aborted. Close a result that arrives after cancellation.
    if (controller.signal.aborted) {
      bitmap.close();
      throw new DOMException('City image loading cancelled', 'AbortError');
    }
    bitmaps.push(bitmap);
    return bitmap;
  }

  let disposed = false;
  function destroy() {
    if (disposed) return;
    disposed = true;
    textures.forEach(texture => texture.destroy(true));
    bitmaps.forEach(bitmap => bitmap.close());
    textures.length = 0;
    bitmaps.length = 0;
  }

  try {
    const paths = [...CITY_ASSETS.map(asset => asset.src), CITY_LIGHT_MASK];
    const decoded = await Promise.all(paths.map(src => load(compact ? src.replace('.webp', '-compact.webp') : src)));
    if (signal.aborted) throw new DOMException('City image loading cancelled', 'AbortError');
    for (const [index, bitmap] of decoded.entries()) {
      const expected = CITY_ASSETS[index] ?? CITY_ASSETS[0];
      const width = compact ? Math.ceil(expected.width / 2) : expected.width;
      const height = compact ? Math.ceil(expected.height / 2) : expected.height;
      if (bitmap.width !== width || bitmap.height !== height) {
        throw new Error('City assets must share their declared native artboard');
      }
      textures.push(new Texture({ source: new ImageSource({ resource: bitmap, alphaMode: 'premultiplied-alpha', scaleMode: 'nearest', autoGenerateMipmaps: false }) }));
    }
    return { layers: textures.slice(0, CITY_ASSETS.length), lights: textures[CITY_ASSETS.length]!, destroy };
  } catch (error) {
    controller.abort();
    destroy();
    throw error;
  } finally { signal.removeEventListener('abort', abort); }
}
