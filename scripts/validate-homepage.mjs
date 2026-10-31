/* global document, localStorage, scrollTo, innerWidth, getComputedStyle */
import process from 'node:process';
import { log } from 'node:console';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const out = 'docs/homepage-review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
const report = [];
for (const width of [1440, 768, 390, 360]) {
  const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, isMobile: width < 768, hasTouch: width < 768 });
  const page = await context.newPage();
  const errors = [], outbound = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) outbound.push(request.url()); });
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator('.portal img').all()) await image.scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: `${out}/${width}-fold.png` });
  await page.screenshot({ path: `${out}/${width}-full.png`, fullPage: true });
  const measurements = await page.evaluate(() => {
    const portal = document.querySelector('.portal');
    const visible = el => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
    const controls = [...portal.querySelectorAll('a,button,summary')].filter(visible);
    const headings = [...portal.querySelectorAll('h1,h2')].map(el => ({ text: el.textContent, lines: Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)) }));
    const missingNames = controls.filter(el => !(el.getAttribute('aria-label') || el.textContent).trim()).length;
    const contrast = (foreground, background) => {
      const luminance = hex => {
        const rgb = hex.trim().slice(1).match(/.{2}/g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
        return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
      };
      const a = luminance(foreground), b = luminance(background);
      return Math.round((Math.max(a, b) + .05) / (Math.min(a, b) + .05) * 100) / 100;
    };
    const token = name => getComputedStyle(portal).getPropertyValue(name).trim();
    const contrastRatios = [
      ['Main text', '--px-text', '--px-ground'],
      ['Reading text', '--px-text', '--px-reading'],
      ['Secondary text', '--px-muted', '--px-surface'],
      ['Window title', '--px-text', '--px-raised'],
      ['Primary action', '--px-ground', '--px-teal'],
      ['Inspection control', '--px-teal', '--px-teal-dark'],
    ].map(([label, fg, bg]) => ({ label, ratio: contrast(token(fg), token(bg)) }));
    return { pageHeight: document.documentElement.scrollHeight, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, headings, missingNames, contrastRatios, images: [...portal.querySelectorAll('img')].map(img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0, alt: img.alt })), fonts: document.fonts.check('16px Inter') && document.fonts.check('16px Silkscreen'), smallTargets: controls.filter(el => { const r = el.getBoundingClientRect(); return r.height < 44 || r.width < 24; }).map(el => el.textContent.trim()) };
  });
  const before = await page.evaluate(() => JSON.stringify(localStorage));
  const control = page.locator('.portal-inspect');
  if (width < 768) await control.tap();
  else { await control.focus(); await page.keyboard.press('Enter'); }
  await page.locator('.portal-demo').screenshot({ path: `${out}/${width}-interaction.png` });
  const previewWorks = await page.locator('#practice-sender').isVisible() && await page.locator('.portal-notebook').innerText().then(text => text.includes('bukan bukti pasti penipuan'));
  const storageUnchanged = before === await page.evaluate(() => JSON.stringify(localStorage));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reducedMotion = await control.evaluate(el => getComputedStyle(el).transitionDuration === '0s');
  report.push({ width, ...measurements, previewWorks, storageUnchanged, reducedMotion, errors, outbound });
  await context.close();
}
await browser.close();
await writeFile(`${out}/browser-results.json`, JSON.stringify(report, null, 2));
log(JSON.stringify(report, null, 2));
