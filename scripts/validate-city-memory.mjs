import { chromium, expect } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';
import { log } from 'node:console';
import process from 'node:process';
const out = process.env.CITY_REVIEW_OUT || 'docs/living-city-review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  const checkpoints = [];
  for (let cycles = 0; cycles <= 42; cycles++) {
    if ([0, 6, 12, 18, 30, 42].includes(cycles)) {
      await page.waitForTimeout(300);
      await cdp.send('HeapProfiler.collectGarbage');
      const { metrics } = await cdp.send('Performance.getMetrics');
      checkpoints.push({ cycles, ...Object.fromEntries(metrics.filter(m => ['JSHeapUsedSize', 'Nodes', 'JSEventListeners', 'Documents'].includes(m.name)).map(m => [m.name, m.value])) });
    }
    if (cycles === 42) break;
    await page.goBack();
    await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
    await expect(page.locator('.living-city canvas')).toHaveCount(1);
    await page.getByRole('link', { name: 'Panduan & privasi' }).click();
    await expect(page.locator('.living-city canvas')).toHaveCount(0);
  }
  const result = { browser: browser.version(), viewport: { width: 1440, height: 1000 }, checkpoints, errors, notes: 'Forced-GC checkpoints on /guide after SPA city mount/unmount; retained JS/DOM counts, not GPU or native memory.' };
  await writeFile(`${out}/heap-soak.json`, JSON.stringify(result, null, 2) + '\n');
  log(JSON.stringify(result));
} finally { await browser.close(); }
