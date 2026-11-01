import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { CITY_COLORS, CITY_VIEW, cityPlacement, cityQuality } from './sceneConfig';
import { CITY_ASSETS } from './sceneAssets';
import { loadCityTextures, type CityTextures } from './loadCityTextures';
import type { CityLayer, CityScene, CitySceneOptions } from './sceneTypes';

/** Owns one application, one private ticker and all its observers/listeners/resources. */
export async function createCityScene({ host, signal, onError, readScroll }: CitySceneOptions): Promise<CityScene | undefined> {
  if (signal.aborted) return;
  const app = new Application();
  const pointerSurface = host.parentElement;
  const coarse = window.matchMedia('(pointer: coarse)');
  let initialized = false;
  let destroyed = false;
  let active = false;
  let resizeObserver: ResizeObserver | undefined;
  let elapsed = 0;
  let targetX = 0;
  let targetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let compact = false;
  const layers = {} as Record<CityLayer, Container>;
  let ownedTextures: CityTextures | undefined;
  const artwork: { sprite: Container; depth: number }[] = [];
  const particles: Sprite[] = [];
  const windowLights: Sprite[] = [];

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    resizeObserver?.disconnect();
    window.removeEventListener('resize', resize);
    coarse.removeEventListener('change', resize);
    pointerSurface?.removeEventListener('pointermove', move);
    pointerSurface?.removeEventListener('pointerleave', resetPointer);
    signal.removeEventListener('abort', destroy);
    if (initialized) {
      app.canvas.removeEventListener('webglcontextlost', contextLost);
      app.stop();
      // This feature is the app's sole Pixi owner; release unused global pools as well.
      // Texture.WHITE is shared by the particle sprites. Destroy only our owned image sources below.
      app.destroy({ removeView: true, releaseGlobalResources: true }, { children: true, texture: false, textureSource: false, context: true });
    } else {
      // Application.destroy expects initialized plugins and a renderer. init may reject before either exists.
      app.stage.destroy({ children: true });
      app.renderer?.destroy({ removeView: true, releaseGlobalResources: true });
    }
    ownedTextures?.destroy();
    host.dataset.cityRendering = 'stopped';
  }

  function fail() { destroy(); onError(); }
  function contextLost(event: Event) { event.preventDefault(); fail(); }
  function resetPointer() { targetX = 0; targetY = 0; }
  function move(event: PointerEvent) {
    if (!active || coarse.matches || event.pointerType !== 'mouse') return;
    const bounds = host.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
  }

  function resize() {
    if (destroyed || !initialized) return;
    try {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      const quality = cityQuality(width, window.devicePixelRatio, coarse.matches);
      compact = quality.name === 'compact';
      app.renderer.resize(width, height, quality.resolution);
      app.ticker.maxFPS = quality.maxFPS;
      const placement = cityPlacement(width, height);
      app.stage.scale.set(placement.scale);
      app.stage.position.set(placement.x, placement.y);
      host.dataset.cityQuality = quality.name;
      host.dataset.cityResolution = String(quality.resolution);
      particles.forEach((particle, index) => { particle.visible = index < (quality.name === 'compact' ? 8 : 20); });
      if (coarse.matches) resetPointer();
      // Hidden scenes defer their next draw until visibility resumes.
      if (active) app.render();
    } catch { fail(); }
  }

  try {
    const quality = cityQuality(host.clientWidth, window.devicePixelRatio, coarse.matches);
    // Renderer initialization and independent image requests overlap. Wait for both to settle
    // before cleanup, so a late renderer or texture result cannot escape ownership.
    const initialization = app.init({
      width: Math.max(1, host.clientWidth), height: Math.max(1, host.clientHeight),
      preference: ['webgl'], background: CITY_COLORS.sky, antialias: false,
      autoDensity: true, resolution: quality.resolution, roundPixels: true,
      autoStart: false, sharedTicker: false, powerPreference: 'low-power',
      // Decorative graphics need no Pixi hit testing or accessibility DOM.
      eventMode: 'none',
    }).then(() => { initialized = true; });
    const loading = loadCityTextures(signal, quality.name === 'compact').then(result => { ownedTextures = result; });
    const results = await Promise.allSettled([initialization, loading]);
    for (const result of results) if (result.status === 'rejected') throw result.reason;
    if (signal.aborted) { destroy(); return; }
    app.stage.eventMode = 'none';
    app.stage.interactiveChildren = false;
    for (const name of ['background', 'midground', 'foreground'] as const) {
      layers[name] = new Container({ label: name });
      app.stage.addChild(layers[name]);
    }
    const { width, height, overscan } = CITY_VIEW;
    CITY_ASSETS.forEach((asset, index) => {
      const sprite = new Sprite({ texture: ownedTextures!.layers[index]!, label: asset.id, roundPixels: true });
      sprite.scale.set(asset.width / sprite.texture.width);
      sprite.position.set(-overscan, -overscan);
      layers[asset.layer].addChild(sprite);
      artwork.push({ sprite, depth: asset.depth });
    });
    // This mask contains only existing amber/teal window pixels, never facade pixels.
    const lights = new Sprite({ texture: ownedTextures!.lights, blendMode: 'add', roundPixels: true });
    lights.scale.set(CITY_ASSETS[0].width / lights.texture.width);
    lights.position.set(-overscan, -overscan);
    lights.alpha = .1;
    layers.midground.addChild(lights);
    artwork.push({ sprite: lights, depth: 8 });
    // Reuse the existing emission texture; masks reveal just three groups of window pixels.
    // No new imagery, facade blinking, texture requests, filters, or per-frame allocations.
    const windows = [[830, 638, 35, 100], [1230, 740, 60, 48], [1430, 530, 38, 34]];
    for (const [x, y, w, h] of windows) {
      const mask = new Graphics().rect(x!, y!, w!, h!).fill(0xffffff);
      const glow = new Sprite({ texture: ownedTextures!.lights, blendMode: 'add', roundPixels: true });
      glow.scale.set(CITY_ASSETS[0].width / glow.texture.width);
      const group = new Container();
      group.addChild(mask, glow);
      glow.mask = mask;
      layers.midground.addChild(group);
      windowLights.push(glow);
      // Move the mask and source together at the same depth as the original building.
      artwork.push({ sprite: group, depth: 8 });
    }
    const atmosphere = new Container({ label: 'atmospheric-particles' });
    app.stage.addChild(atmosphere);
    for (let index = 0; index < 20; index++) {
      const particle = new Sprite({ texture: Texture.WHITE, tint: index % 4 ? CITY_COLORS.light : CITY_COLORS.warm, roundPixels: true });
      particle.width = index % 5 ? 1 : 2;
      particle.height = particle.width;
      particle.alpha = 0;
      atmosphere.addChild(particle);
      particles.push(particle);
    }

    // Use only the private Pixi ticker. Catch render errors here as well as at init.
    app.ticker.remove(app.render, app);
    app.ticker.add(ticker => {
      if (destroyed || !active) return;
      try {
        const delta = Math.min(ticker.deltaMS, 50);
        elapsed += delta;
        const ease = 1 - Math.exp(-delta / 160);
        pointerX += (targetX - pointerX) * ease;
        pointerY += (targetY - pointerY) * ease;
        // Pointer + scroll + drift stay inside the existing 32px overscan.
        // Scroll is native and reversible; no smoothing lag or second render loop.
        const scroll = Math.max(0, Math.min(1, readScroll?.() ?? 0));
        const scrollDepth = scroll * (compact ? .2 : .65);
        for (const { sprite, depth } of artwork) {
          const clouds = sprite.label === 'sky-far' ? Math.sin(elapsed / 55000) * 14 : 0;
          sprite.position.set(-overscan + pointerX * depth + Math.sin(elapsed / 9000) * depth * .12 + clouds, -overscan + pointerY * depth * .4 - scrollDepth * depth);
        }
        lights.alpha = (.1 + Math.sin(elapsed / 4300) * .045 + Math.sin(elapsed / 6700) * .02) * (1 - scroll * .3);
        windowLights.forEach((light, index) => {
          const phase = (elapsed + index * 11000) % 41000;
          // One quiet, distant dip per cycle; other windows slowly brighten independently.
          light.alpha = index === 2 && phase > 36000 && phase < 36300 ? .015 : .06 + (1 + Math.sin(elapsed / (6500 + index * 2300) + index * 2)) * .07;
        });
        particles.forEach((particle, index) => {
          if (!particle.visible) return;
          const progress = (elapsed / (38000 + index * 1700) + index * .137) % 1;
          particle.position.set(((index * 337 + 113) % width) + Math.sin(elapsed / 8000 + index) * 7, height * (1 - progress));
          particle.alpha = Math.sin(progress * Math.PI) * .2;
        });
        app.render();
      } catch { fail(); }
    });
    resize();
    if (destroyed) return;
    app.render();
    app.canvas.className = 'living-city-canvas';
    app.canvas.setAttribute('aria-hidden', 'true');
    app.canvas.addEventListener('webglcontextlost', contextLost);
    host.appendChild(app.canvas);
    signal.addEventListener('abort', destroy, { once: true });
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener('resize', resize, { passive: true });
    coarse.addEventListener('change', resize);
    pointerSurface?.addEventListener('pointermove', move, { passive: true });
    pointerSurface?.addEventListener('pointerleave', resetPointer, { passive: true });

    return {
      setActive(next) {
        if (destroyed || next === active) return;
        active = next;
        if (next) app.start(); else { app.stop(); resetPointer(); }
        host.dataset.cityRendering = next ? 'running' : 'paused';
      },
      destroy,
    };
  } catch (error) {
    destroy();
    throw error;
  }
}
