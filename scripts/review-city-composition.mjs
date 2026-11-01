/* global document, getComputedStyle */
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { log } from 'node:console';
import process from 'node:process';

const out = process.env.CITY_REVIEW_OUT || 'docs/living-city-phase-b/review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const checks = [];
try {
  for (const width of [1440, 768, 390, 360]) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, isMobile: width < 768, hasTouch: width < 768 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
    await page.screenshot({ path: `${out}/${width}-fold.png` });
    await page.screenshot({ path: `${out}/${width}-full.png`, fullPage: true });
    if (width === 1440) {
      const hero = await page.locator('.portal-hero').boundingBox();
      for (const [label, x, y] of [['top-left', hero.x + 2, hero.y + 2], ['bottom-right', hero.x + hero.width - 2, hero.y + hero.height - 2]]) {
        await page.mouse.move(x, y);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${out}/1440-parallax-${label}.png` });
      }
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'reduced-motion');
    await expect(page.locator('.living-city canvas')).toHaveCount(0);
    expect(await page.locator('.living-city-fallback img').evaluate(el => getComputedStyle(el).imageRendering)).toBe('pixelated');
    await page.screenshot({ path: `${out}/${width}-reduced.png` });
    expect(errors).toEqual([]);
    checks.push({ width, reducedMotionStaticSampling: 'pixelated', errors });
    await context.close();
  }
  await writeFile(`${out}/composition-checks.json`, JSON.stringify(checks, null, 2) + '\n');
  log(JSON.stringify(checks));
} finally { await browser.close(); }
