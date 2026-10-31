/* global document */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
const page = await context.newPage();
await mkdir('docs/homepage-review', { recursive: true });
await mkdir('public/preview', { recursive: true });
await page.goto('http://127.0.0.1:5173/');
await page.screenshot({ path: 'docs/homepage-review/before-desktop.png' });
await page.goto('http://127.0.0.1:5173/play');
await page.getByRole('button', { name: /Mulai investigasi/ }).click();
await page.getByRole('button', { name: /Buka berkas pertama/ }).click();
for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
await page.getByRole('button', { name: /Periksa undangan/ }).click();
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'docs/homepage-review/chapter-one-reference.png' });
await page.screenshot({ path: 'public/preview/chapter-one.jpg', type: 'jpeg', quality: 90 });
for (const [id, name] of [['mail', 'mail'], ['journal', 'journal']]) {
  await page.locator(`#os-app-${id}`).screenshot({ path: `public/preview/${name}.png` });
}
await page.getByRole('button', { name: 'Tampilkan Browser', exact: true }).click();
await page.locator('#os-app-browser').screenshot({ path: 'public/preview/browser.png' });
await browser.close();
