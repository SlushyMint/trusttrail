/* global document, window, localStorage, innerWidth, innerHeight, getComputedStyle, scrollTo */
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { log } from 'node:console';

const out = 'docs/phase-b1-review/after';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = { browser: browser.version(), viewports: [] };
try {
  for (const width of [360, 390, 768, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, isMobile: width < 768, hasTouch: width < 768 });
    const page = await context.newPage();
    const errors = [], consoleErrors = [], broken = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) broken.push(response.url()); });
    page.on('request', request => requests.push(request.url()));
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => document.fonts.ready);
    const city = page.locator('.living-city');
    await expect(city).toHaveAttribute('data-city-status', 'ready');
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${out}/${width}-fold.png` });
    async function captureState(path) {
      // Fresh viewport captures avoid Chrome's sequential element/resize capture artifacts.
      const capture = await context.newPage();
      try {
        await capture.setViewportSize({ width, height: 1100 });
        await capture.emulateMedia({ reducedMotion: 'reduce' });
        await capture.bringToFront();
        await capture.goto('http://127.0.0.1:4173/');
        await capture.evaluate(() => document.fonts.ready);
        let target;
        if (path.includes('-os-')) {
          const name = path.includes('-browser') ? 'Browser' : path.includes('-case-files') ? 'Case Files' : 'Mail';
          const button = capture.getByRole('group', { name: 'Aplikasi pratinjau' }).getByRole('button', { name, exact: true });
          await button.focus(); await capture.keyboard.press('Enter');
          target = capture.locator('.portal-game-preview');
        } else if (path.includes('-intel-')) {
          const index = Number(path.match(/-intel-(\d)/)[1]) - 1;
          await capture.locator('.portal-intel-files button').nth(index).focus();
          await capture.keyboard.press('Enter');
          target = capture.locator('.portal-intelligence');
        } else {
          await capture.getByRole('button', { name: 'Periksa alamat pengirim', exact: true }).click();
          target = capture.locator('.portal-demo');
        }
        await capture.waitForTimeout(1000);
        await target.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await capture.waitForTimeout(350);
        await capture.screenshot({ path });
      } finally { await capture.close(); await page.bringToFront(); }
    }
    const saved = await page.evaluate(() => JSON.stringify(localStorage));
    const preview = page.locator('.portal-game-preview');
    const heights = [], intelHeights = [];
    for (const name of ['Browser', 'Case Files', 'Mail']) {
      const button = page.getByRole('group', { name: 'Aplikasi pratinjau' }).getByRole('button', { name, exact: true });
      await button.focus(); await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await page.waitForTimeout(220);
      heights.push((await preview.boundingBox()).height);
      if (width === 390 || width === 1440) await captureState(`${out}/${width}-os-${name.replace(' ', '-').toLowerCase()}.png`);
    }
    const intelFiles = page.locator('.portal-intel-files button');
    for (let index = 0; index < 3; index++) {
      await intelFiles.nth(index).focus(); await page.keyboard.press('Space');
      await expect(intelFiles.nth(index)).toHaveAttribute('aria-pressed', 'true');
      await page.waitForTimeout(220);
      intelHeights.push((await page.locator('.portal-intelligence').boundingBox()).height);
      if (width === 390 || width === 1440) await captureState(`${out}/${width}-intel-${index + 1}.png`);
    }
    await intelFiles.first().click();
    await page.getByRole('link', { name: 'Periksa sebuah pesan' }).click();
    await page.getByRole('button', { name: 'Periksa alamat pengirim', exact: true }).click();
    await expect(page.locator('#practice-sender')).toBeVisible();
    const storageUnchanged = saved === await page.evaluate(() => JSON.stringify(localStorage));
    if (width === 390 || width === 1440) await captureState(`${out}/${width}-practice.png`);
    const measure = await page.evaluate(() => {
      const visible = el => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
      const controls = [...document.querySelectorAll('.portal a, .portal button, .portal summary')].filter(visible);
      const headingLines = [...document.querySelectorAll('.portal h1, .portal h2, .portal h3')].map(el => ({ text: el.textContent, lines: Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)) }));
      const cta = document.querySelector('.portal-start .button').getBoundingClientRect();
      const bounds = document.querySelector('.living-city').getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        ctaTop: cta.top + window.scrollY, ctaBottom: cta.bottom + window.scrollY, viewportHeight: innerHeight,
        cityWidth: bounds.width, headingLines,
        smallTargets: controls.filter(el => el.getBoundingClientRect().height < 44).map(el => el.textContent.trim()),
        missingNames: controls.filter(el => !(el.getAttribute('aria-label') || el.textContent).trim()).length,
        images: [...document.querySelectorAll('.portal img')].map(img => ({ path: img.currentSrc, loaded: img.complete && img.naturalWidth > 0 })),
      };
    });
    await page.getByRole('link', { name: 'Berkas kasus', exact: true }).click();
    await page.waitForTimeout(250);
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(250);
    await page.getByRole('button', { name: 'Tutup detail pengirim', exact: true }).click();
    await page.evaluate(() => scrollTo(0, 0));
    await expect(city).toHaveAttribute('data-city-rendering', 'running');
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${out}/${width}-full.png`, fullPage: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(city).toHaveAttribute('data-city-status', 'reduced-motion');
    await expect(city.locator('canvas')).toHaveCount(0);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${width}-reduced.png` });
    const focused = page.getByRole('group', { name: 'Aplikasi pratinjau' }).getByRole('button', { name: 'Browser', exact: true });
    await page.keyboard.press('Tab');
    await focused.focus();
    const focus = await focused.evaluate(el => ({ outline: getComputedStyle(el).outlineStyle, width: getComputedStyle(el).outlineWidth, transition: getComputedStyle(el).transitionDuration }));
    const entry = { width, ...measure, previewHeights: heights, intelHeights, storageUnchanged, focus, errors, consoleErrors, broken, cityRequests: requests.filter(url => url.includes('/assets/living-city/')), outbound: requests.filter(url => !url.startsWith('http://127.0.0.1:4173')) };
    results.viewports.push(entry);
    log(JSON.stringify(entry));
    expect(entry.overflow).toBe(false);
    expect(entry.ctaBottom).toBeLessThan(entry.viewportHeight);
    expect(entry.cityWidth).toBe(width);
    expect(entry.missingNames).toBe(0);
    expect(entry.smallTargets).toEqual([]);
    expect(entry.storageUnchanged).toBe(true);
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
    expect(Math.max(...intelHeights) - Math.min(...intelHeights)).toBeLessThan(1);
    expect(entry.focus.outline).toBe('solid');
    expect(entry.focus.transition).toBe('0s');
    expect(entry.headingLines.every(item => item.lines <= 2)).toBe(true);
    expect(entry.errors).toEqual([]); expect(entry.consoleErrors).toEqual([]); expect(entry.broken).toEqual([]);
    await context.close();
  }
} finally {
  await writeFile('docs/phase-b1-review/browser-results.json', JSON.stringify(results, null, 2));
  await browser.close();
}
