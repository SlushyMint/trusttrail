/* global document, window, getComputedStyle, innerWidth, innerHeight, scrollTo, performance, PerformanceObserver, requestAnimationFrame, setTimeout, localStorage */
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import process from 'node:process';
import { log } from 'node:console';

const phase = process.argv[2] || 'after';
const out = `docs/phase-b2-review/${phase}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = { browser: browser.version(), conditions: 'Production Vite preview, local headless Chrome, no network or CPU throttling; emulated touch below 768px. rAF cadence is not GPU presentation FPS.', viewports: [] };
try {
  for (const width of [1440, 768, 390, 360]) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, hasTouch: width < 768, isMobile: width < 768, recordVideo: phase === 'after' && [1440, 390].includes(width) ? { dir: out, size: { width, height: width < 768 ? 844 : 1000 } } : undefined });
    await context.addInitScript(() => {
      window.__b2 = { shifts: [], longTasks: [] };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__b2.shifts.push(entry.value);
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => window.__b2.longTasks.push(...list.getEntries().map(entry => entry.duration))).observe({ type: 'longtask', buffered: true });
    });
    const page = await context.newPage();
    const errors = [], consoleErrors = [], broken = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) broken.push(response.url()); });
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${out}/${width}-fold.png`, scale: 'css' });
    const ctaAboveFold = await page.locator('.portal-start .button').first().evaluate(el => el.getBoundingClientRect().bottom < innerHeight);
    const storage = await page.evaluate(() => JSON.stringify(localStorage));
    // Scheduled native scroll updates: sample scroll + DOM animation cadence together.
    const cadence = await page.evaluate(async () => {
      window.__b2.longTasks = [];
      const frames = [];
      const start = performance.now();
      await new Promise(resolve => {
        function frame(now) {
          frames.push(now);
          if (now - start < 2200) requestAnimationFrame(frame); else resolve();
        }
        requestAnimationFrame(frame);
        let steps = 0;
        function scroll() { window.scrollBy(0, 24); if (++steps < 50) setTimeout(scroll, 32); }
        scroll();
      });
      const intervals = frames.slice(1).map((t, i) => t - frames[i]).sort((a, b) => a - b);
      return { sampledFrames: frames.length, rafFPS: (frames.length - 1) * 1000 / (frames.at(-1) - frames[0]), p95IntervalMS: intervals[Math.floor(intervals.length * .95)], longTasks: [...window.__b2.longTasks] };
    });
    const previewHeights = [];
    for (const name of ['Browser', 'Case Files', 'Mail']) {
      const button = page.getByRole('group', { name: 'Aplikasi pratinjau' }).getByRole('button', { name, exact: true });
      await button.focus(); await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await page.waitForTimeout(350);
      previewHeights.push((await page.locator('.portal-game-preview').boundingBox()).height);
    }
    await page.locator('.portal-game-preview').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${out}/${width}-os.png`, scale: 'css' });
    const intelHeights = [];
    for (let i = 0; i < 3; i++) {
      await page.locator('.portal-intel-files button').nth(i).focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(650);
      intelHeights.push((await page.locator('.portal-intelligence').boundingBox()).height);
    }
    await page.locator('.portal-intel-files button').first().click();
    await page.locator('.portal-intelligence').scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${out}/${width}-intel.png`, scale: 'css' });
    await page.getByRole('button', { name: 'Periksa alamat pengirim', exact: true }).click();
    await expect(page.locator('#practice-sender')).toBeVisible();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/${width}-practice.png`, scale: 'css' });
    await page.locator('#berkas').scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${out}/${width}-cases.png`, scale: 'css' });
    await page.locator('.portal-safety').scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${out}/${width}-decision.png`, scale: 'css' });
    const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    const stableStorage = storage === await page.evaluate(() => JSON.stringify(localStorage));
    const shifts = await page.evaluate(() => window.__b2.shifts);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${width}-full.png`, fullPage: true, scale: 'css' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.living-city canvas')).toHaveCount(0);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${width}-reduced.png`, scale: 'css' });
    const transforms = await page.locator('.portal-showcase, .portal h1, .portal h2').evaluateAll(els => els.map(el => ({ text: el.textContent.slice(0, 28), transform: getComputedStyle(el).transform, opacity: getComputedStyle(el).opacity })));
    const result = { width, ctaAboveFold, noOverflow, stableStorage, previewHeights, intelHeights, cadence, layoutShift: shifts.reduce((a, b) => a + b, 0), reducedTransforms: transforms, errors, consoleErrors, broken };
    results.viewports.push(result);
    log(JSON.stringify(result));
    const video = page.video();
    await context.close();
    if (video) await rename(await video.path(), `${out}/${width}-motion.webm`);
  }
} finally {
  await writeFile(`${out}/browser-results.json`, JSON.stringify(results, null, 2));
  await browser.close();
}
