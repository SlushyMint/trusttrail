/* global window, document, performance, PerformanceObserver, WebGLRenderingContext, WebGL2RenderingContext, innerWidth, scrollTo, localStorage, Event, setTimeout */
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { log } from 'node:console';

const out = process.env.CITY_REVIEW_OUT || 'docs/living-city-review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
const results = { browser: browser.version(), environment: 'Local headless browser; mobile emulation, no CPU/network throttle; not physical-device or GPU-memory measurements.', viewports: [] };

try {
  for (const width of [360, 390, 768, 1440]) {
    const mobile = width < 768;
    const context = await browser.newContext({ viewport: { width, height: mobile ? 844 : 1000 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 2 });
    await context.addInitScript(() => {
      window.__cityProbe = { frames: [], shifts: [], longTasks: [] };
      // Count actual frame clears, without retaining canvas/context references.
      for (const proto of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
        const clear = proto.clear;
        proto.clear = function (...args) {
          if (this.canvas.className === 'living-city-canvas') window.__cityProbe.frames.push(performance.now());
          return clear.apply(this, args);
        };
      }
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cityProbe.shifts.push(entry.value);
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => {
        window.__cityProbe.longTasks.push(...list.getEntries().map(entry => entry.duration));
      }).observe({ type: 'longtask', buffered: true });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await page.route('**/createCityScene-*.js', async route => { await gate; await route.continue(); });
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    const before = await page.locator('.portal-hero').boundingBox();
    await page.evaluate(() => { window.__cityProbe.longTasks = []; });
    const initStarted = performance.now();
    release();
    const city = page.locator('.living-city');
    await expect(city).toHaveAttribute('data-city-status', 'ready');
    const initializationMS = Number((performance.now() - initStarted).toFixed(1));
    const initializationLongTasks = await page.evaluate(() => [...window.__cityProbe.longTasks]);
    const after = await page.locator('.portal-hero').boundingBox();
    await page.waitForTimeout(500);
    await page.evaluate(() => { window.__cityProbe.frames = []; window.__cityProbe.longTasks = []; });
    await page.waitForTimeout(3000);
    const measurements = await page.evaluate(() => {
      const { frames, shifts, longTasks } = window.__cityProbe;
      const intervals = frames.slice(1).map((time, i) => time - frames[i]).sort((a, b) => a - b);
      const canvas = document.querySelector('.living-city canvas');
      const city = document.querySelector('.living-city');
      const cta = document.querySelector('.portal-start .button').getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        ctaAboveFold: cta.bottom <= window.innerHeight,
        quality: city.dataset.cityQuality,
        resolution: Number(city.dataset.cityResolution),
        canvasPixels: { width: canvas.width, height: canvas.height },
        sampledFrames: frames.length,
        measuredFPS: frames.length > 1 ? Number(((frames.length - 1) * 1000 / (frames.at(-1) - frames[0])).toFixed(1)) : 0,
        frameIntervalMedianMS: intervals[Math.floor(intervals.length * .5)] ?? null,
        frameIntervalP95MS: intervals[Math.floor(intervals.length * .95)] ?? null,
        totalLayoutShiftValue: shifts.reduce((sum, value) => sum + value, 0),
        longTasksDuringSample: longTasks,
        cityAssetRequests: performance.getEntriesByType('resource').filter(entry => entry.name.includes('/assets/living-city/')).map(entry => ({ file: entry.name.split('/').at(-1), transferBytes: entry.transferSize, encodedBodyBytes: entry.encodedBodySize })),
      };
    });
    await page.screenshot({ path: `${out}/${width}-fold.png`, scale: 'css' });
    await page.screenshot({ path: `${out}/${width}-full.png`, fullPage: true, scale: 'css' });
    // Confirm actual WebGL rendering stops while the hero is outside the viewport.
    await page.getByRole('link', { name: 'Coba periksa', exact: true }).click();
    await expect(city).toHaveAttribute('data-city-rendering', 'paused');
    await page.waitForTimeout(100);
    const pausedStart = await page.evaluate(() => window.__cityProbe.frames.length);
    await page.waitForTimeout(500);
    const offscreenDraws = await page.evaluate(start => window.__cityProbe.frames.length - start, pausedStart);
    const saved = await page.evaluate(() => JSON.stringify(localStorage));
    const inspect = page.getByRole('button', { name: 'Periksa alamat pengirim', exact: true });
    if (mobile) await inspect.tap(); else await inspect.click();
    await expect(page.locator('#practice-sender')).toBeVisible();
    const storageUnchanged = saved === await page.evaluate(() => JSON.stringify(localStorage));
    await page.evaluate(() => scrollTo(0, 0));
    await expect(city).toHaveAttribute('data-city-rendering', 'running');
    // Simulate only the visibility signal; the offscreen check above uses real layout/IntersectionObserver.
    const hiddenDraws = await page.evaluate(async () => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
      const count = window.__cityProbe.frames.length;
      await new Promise(resolve => setTimeout(resolve, 500));
      const draws = window.__cityProbe.frames.length - count;
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
      return draws;
    });
    await expect(city).toHaveAttribute('data-city-rendering', 'running');
    // Repeated SPA mount/unmount with forced GC measures retained JS heap only.
    const cdp = await context.newCDPSession(page);
    await cdp.send('Performance.enable');
    const heap = async () => {
      await cdp.send('HeapProfiler.collectGarbage');
      const { metrics } = await cdp.send('Performance.getMetrics');
      return metrics.find(metric => metric.name === 'JSHeapUsedSize').value;
    };
    await page.getByRole('link', { name: 'Panduan & privasi' }).click();
    await page.waitForTimeout(200);
    const heapBefore = await heap();
    let maxCanvasCount = 0;
    const heapCheckpoints = [];
    for (let i = 0; i < (width === 1440 ? 18 : 6); i++) {
      await page.goBack();
      await page.evaluate(() => scrollTo(0, 0));
      await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
      maxCanvasCount = Math.max(maxCanvasCount, await page.locator('.living-city canvas').count());
      await page.getByRole('link', { name: 'Panduan & privasi' }).click();
      await expect(page.locator('.living-city canvas')).toHaveCount(0);
      if ((i + 1) % 6 === 0) {
        await page.waitForTimeout(200);
        heapCheckpoints.push({ cycles: i + 1, bytes: await heap() });
      }
    }
    await page.waitForTimeout(200);
    const heapAfter = await heap();
    const removedStart = await page.evaluate(() => window.__cityProbe.frames.length);
    await page.waitForTimeout(500);
    const drawsAfterUnmount = await page.evaluate(start => window.__cityProbe.frames.length - start, removedStart);
    const result = { width, initializationMS, initializationLongTasks, ...measurements, heroBoundsStable: JSON.stringify(before) === JSON.stringify(after), offscreenDraws, simulatedHiddenDocumentDraws: hiddenDraws, storageUnchanged, maxCanvasCount, drawsAfterUnmount, heapBeforeBytes: heapBefore, heapCheckpoints, heapFinalBytes: heapAfter, heapDeltaBytes: heapAfter - heapBefore, errors };
    results.viewports.push(result);
    log(JSON.stringify(result));
    await context.close();
  }
  await writeFile(`${out}/measurements.json`, JSON.stringify(results, null, 2) + '\n');
} finally { await browser.close(); }
