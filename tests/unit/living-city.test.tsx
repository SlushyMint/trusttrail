import { StrictMode } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LivingCityScene } from '../../src/features/living-city/LivingCityScene';
import { cityPlacement, cityQuality, CITY_DEPTH, CITY_VIEW } from '../../src/features/living-city/sceneConfig';
import { CITY_ASSETS } from '../../src/features/living-city/sceneAssets';
import type { CityScene } from '../../src/features/living-city/sceneTypes';
import { motionValue } from 'motion/react';

const create = vi.hoisted(() => vi.fn());
vi.mock('../../src/features/living-city/createCityScene', () => ({ createCityScene: create }));

let intersection: IntersectionObserverCallback;
let reduced = false;
let change: (() => void) | undefined;
let disconnect: ReturnType<typeof vi.fn>;

async function show(visible = true) {
  await act(async () => intersection([{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver));
}

beforeEach(() => {
  reduced = false;
  change = undefined;
  create.mockReset();
  disconnect = vi.fn();
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) { intersection = callback; }
    observe() {}
    disconnect = disconnect;
  });
  vi.stubGlobal('matchMedia', () => ({
    get matches() { return reduced; },
    addEventListener: (_event: string, callback: () => void) => { change = callback; },
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe('living city lifecycle', () => {
  it('samples live scroll progress without recreating the renderer', async () => {
    const scene = { destroy: vi.fn(), setActive: vi.fn() };
    create.mockResolvedValue(scene);
    const progress = motionValue(0);
    const view = render(<LivingCityScene scrollProgress={progress} />);
    await show();
    await waitFor(() => expect(create).toHaveBeenCalledOnce());
    const readScroll = create.mock.calls[0]![0].readScroll;
    expect(readScroll()).toBe(0);
    act(() => progress.set(.7));
    expect(readScroll()).toBe(.7);
    act(() => progress.set(.1));
    expect(readScroll()).toBe(.1);
    expect(create).toHaveBeenCalledOnce();
    view.unmount();
    expect(scene.destroy).toHaveBeenCalledOnce();
  });
  it('loads only on visibility, pauses and cleans up its scene in StrictMode', async () => {
    const scene = { destroy: vi.fn(), setActive: vi.fn() };
    create.mockResolvedValue(scene);
    const view = render(<StrictMode><LivingCityScene /></StrictMode>);
    expect(create).not.toHaveBeenCalled();
    await show();
    await waitFor(() => expect(create).toHaveBeenCalledTimes(1));
    expect(scene.setActive).toHaveBeenLastCalledWith(true);
    await show(false);
    expect(scene.setActive).toHaveBeenLastCalledWith(false);
    view.unmount();
    expect(scene.destroy).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0]![0].signal.aborted).toBe(true);
    expect(disconnect).toHaveBeenCalled();
  });

  it('disposes an initialization that finishes after navigation', async () => {
    let resolve!: (scene: CityScene) => void;
    create.mockImplementation(() => new Promise<CityScene>(done => { resolve = done; }));
    const view = render(<LivingCityScene />);
    await show();
    await waitFor(() => expect(create).toHaveBeenCalledOnce());
    view.unmount();
    const scene = { destroy: vi.fn(), setActive: vi.fn() };
    await act(async () => resolve(scene));
    expect(scene.destroy).toHaveBeenCalledOnce();
    expect(scene.setActive).not.toHaveBeenCalled();
  });

  it('retains a static fallback without loading Pixi for reduced motion, including live changes', async () => {
    reduced = true;
    const scene = { destroy: vi.fn(), setActive: vi.fn() };
    create.mockResolvedValue(scene);
    const view = render(<LivingCityScene />);
    await show();
    expect(create).not.toHaveBeenCalled();
    expect(view.container.querySelector('[data-city-status="reduced-motion"]')).toBeTruthy();
    await act(async () => { reduced = false; change?.(); });
    await waitFor(() => expect(create).toHaveBeenCalledOnce());
    await act(async () => { reduced = true; change?.(); });
    expect(scene.destroy).toHaveBeenCalledOnce();
    expect(view.container.querySelector('.living-city-fallback')).toBeTruthy();
  });

  it('keeps the fallback after an initialization error without retry loops', async () => {
    create.mockRejectedValue(new Error('Renderer unavailable'));
    const view = render(<LivingCityScene />);
    await show();
    await waitFor(() => expect(view.container.querySelector('[data-city-status="fallback"]')).toBeTruthy());
    await show(false);
    await show();
    expect(create).toHaveBeenCalledOnce();
  });

  it('pauses and resumes for document visibility changes', async () => {
    const scene = { destroy: vi.fn(), setActive: vi.fn() };
    create.mockResolvedValue(scene);
    const view = render(<LivingCityScene />);
    await show();
    await waitFor(() => expect(create).toHaveBeenCalledOnce());
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(scene.setActive).toHaveBeenLastCalledWith(false);
    hidden.mockReturnValue(false);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(scene.setActive).toHaveBeenLastCalledWith(true);
    view.unmount();
  });
});

describe('city artboard and quality constraints', () => {
  it('covers narrow, tall and wide hosts with enough overscan for all layer movement', () => {
    for (const [width, height] of [[360, 950], [390, 900], [768, 1100], [1440, 600], [2500, 500]]) {
      const p = cityPlacement(width!, height!);
      expect(CITY_VIEW.width * p.scale).toBeGreaterThanOrEqual(width!);
      expect(CITY_VIEW.height * p.scale).toBeGreaterThanOrEqual(height!);
      expect(p.x).toBeLessThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(0);
    }
    expect(Math.max(...Object.values(CITY_DEPTH)) * 1.12).toBeLessThan(CITY_VIEW.overscan);
    expect(cityQuality(390, 3, true)).toMatchObject({ resolution: 1.25, maxFPS: 30 });
    expect(cityQuality(1440, 3, false)).toMatchObject({ resolution: 1.5, maxFPS: 60 });
    expect(CITY_ASSETS).toHaveLength(5);
    expect(CITY_ASSETS.every(asset => asset.src.endsWith('.webp'))).toBe(true);
    expect(CITY_ASSETS.every(asset => asset.width === CITY_VIEW.width + CITY_VIEW.overscan * 2 && asset.height === CITY_VIEW.height + CITY_VIEW.overscan * 2)).toBe(true);
    expect(Math.max(...CITY_ASSETS.map(asset => asset.depth)) * 1.12).toBeLessThan(CITY_VIEW.overscan);
    // Worst-case vertical pointer + scroll and horizontal pointer + ambient drift.
    expect(Math.max(...CITY_ASSETS.map(asset => asset.depth)) * (.4 + .65)).toBeLessThan(CITY_VIEW.overscan);
  });
});
