import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadCityTextures } from '../../src/features/living-city/loadCityTextures';

const owned = vi.hoisted(() => ({ textures: [] as { destroy: ReturnType<typeof vi.fn> }[] }));
vi.mock('pixi.js', () => ({
  ImageSource: class { constructor(readonly options: unknown) {} },
  Texture: class {
    destroy = vi.fn();
    constructor() { owned.textures.push(this); }
  },
}));

function bitmap() { return { width: 1672, height: 941, close: vi.fn() }; }
beforeEach(() => {
  owned.textures.length = 0;
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, blob: async () => new Blob() })));
});
afterEach(() => vi.unstubAllGlobals());

describe('owned city image resources', () => {
  it('loads compact textures with the compact artboard and releases their resources', async () => {
    const images = Array.from({ length: 6 }, () => ({ width: 836, height: 471, close: vi.fn() }));
    let index = 0;
    vi.stubGlobal('createImageBitmap', vi.fn(async () => images[index++]));
    const textures = await loadCityTextures(new AbortController().signal, true);
    expect(vi.mocked(fetch).mock.calls.every(([url]) => String(url).endsWith('-compact.webp'))).toBe(true);
    expect(textures.layers).toHaveLength(5);
    textures.destroy();
    expect(images.every(image => image.close.mock.calls.length === 1)).toBe(true);
  });
  it('closes each owned bitmap and texture exactly once', async () => {
    const images = Array.from({ length: 6 }, bitmap);
    let index = 0;
    vi.stubGlobal('createImageBitmap', vi.fn(async () => images[index++]));
    const textures = await loadCityTextures(new AbortController().signal);
    expect(textures.layers).toHaveLength(5);
    textures.destroy();
    textures.destroy();
    expect(images.every(image => image.close.mock.calls.length === 1)).toBe(true);
    expect(owned.textures.every(texture => texture.destroy.mock.calls.length === 1)).toBe(true);
  });

  it('closes decode results that arrive after cancellation without creating GPU textures', async () => {
    const images = Array.from({ length: 6 }, bitmap);
    const finish: (() => void)[] = [];
    let index = 0;
    vi.stubGlobal('createImageBitmap', vi.fn(() => new Promise(resolve => {
      const image = images[index++];
      finish.push(() => resolve(image));
    })));
    const controller = new AbortController();
    const loading = loadCityTextures(controller.signal);
    const rejected = expect(loading).rejects.toMatchObject({ name: 'AbortError' });
    await vi.waitFor(() => expect(finish).toHaveLength(6));
    controller.abort();
    finish.forEach(resolve => resolve());
    await rejected;
    expect(images.every(image => image.close.mock.calls.length === 1)).toBe(true);
    expect(owned.textures).toHaveLength(0);
  });

  it('releases decoded images and partial textures when an artboard is invalid', async () => {
    const images = Array.from({ length: 6 }, bitmap);
    images[2]!.width = 1;
    let index = 0;
    vi.stubGlobal('createImageBitmap', vi.fn(async () => images[index++]));
    await expect(loadCityTextures(new AbortController().signal)).rejects.toThrow('artboard');
    expect(images.every(image => image.close.mock.calls.length === 1)).toBe(true);
    expect(owned.textures.every(texture => texture.destroy.mock.calls.length === 1)).toBe(true);
  });
});
