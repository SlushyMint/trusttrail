/* global document, getComputedStyle, scrollTo, innerHeight */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { log } from 'node:console';

const out = 'docs/phase-b2-review/reference';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const [width, reducedMotion] of [[1440, 'no-preference'], [390, 'no-preference'], [390, 'reduce']]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion });
    const page = await context.newPage();
    try {
      const response = await page.goto('https://www.accenture.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.screenshot({ path: `${out}/${width}-${reducedMotion}-entrance.png` });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${out}/${width}-${reducedMotion}-settled.png` });
      await page.waitForTimeout(5000);
      const reject = page.getByRole('button', { name: 'Reject All', exact: true });
      if (await reject.isVisible()) await reject.click();
      await page.screenshot({ path: `${out}/${width}-${reducedMotion}-hero.png` });
      const sample = () => page.evaluate(() => ({ title: document.title, text: document.body.innerText.slice(0, 1600), headings: [...document.querySelectorAll('h1,h2')].map(el => el.textContent), sticky: [...document.querySelectorAll('header, main section')].map(el => ({ tag: el.tagName, position: getComputedStyle(el).position })).filter(el => ['sticky', 'fixed'].includes(el.position)) }));
      results.push({ width, reducedMotion, url: page.url(), status: response?.status(), ...await sample() });
      await page.evaluate(() => scrollTo(0, innerHeight * .8));
      await page.waitForTimeout(650);
      await page.screenshot({ path: `${out}/${width}-${reducedMotion}-scroll.png` });
      if (width === 1440) {
        const card = page.getByText('Future of work: Explore five trends shaping work that matters', { exact: true }).first();
        if (await card.isVisible()) {
          await card.hover();
          await page.waitForTimeout(500);
          await page.screenshot({ path: `${out}/1440-hover.png` });
        }
      }
    } catch (error) { results.push({ width, reducedMotion, error: error.message }); }
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(`${out}/observations.json`, JSON.stringify(results, null, 2));
log(JSON.stringify(results));
