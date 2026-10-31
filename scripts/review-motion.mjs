/* global document, localStorage, getComputedStyle, innerWidth */
import { chromium } from '@playwright/test';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import { log } from 'node:console';

const folder = 'docs/motion-review';
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: folder, size: { width: 1440, height: 1000 } } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:4173/');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(450);
await page.screenshot({ path: `${folder}/homepage-desktop.png` });
for (const section of ['#intel', '#latihan', '#berkas']) {
  await page.locator(section).scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
}
await page.locator('#latihan').scrollIntoViewIfNeeded();
await page.getByRole('button', { name: 'Periksa alamat pengirim' }).click();
await page.waitForTimeout(250);
await page.locator('.portal-demo').screenshot({ path: `${folder}/email-feedback.png` });
await page.goto('http://127.0.0.1:4173/play');
await page.getByRole('button', { name: /Mulai investigasi/ }).click();
await page.getByRole('button', { name: /Buka berkas pertama/ }).click();
for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
await page.getByRole('button', { name: /Periksa undangan/ }).click();
const saved = await page.evaluate(() => localStorage.getItem('trusttrail:save:v1'));
await page.waitForTimeout(200);
await page.screenshot({ path: `${folder}/desktop-default.png` });
const journal = page.locator('#os-app-journal');
const title = await journal.locator('.px-titlebar h2').boundingBox();
await page.mouse.move(title.x + 18, title.y + 9);
await page.mouse.down();
for (let step = 1; step <= 20; step++) {
  await page.mouse.move(title.x + 18 - step * 10, title.y + 9 - step * 4);
  await page.waitForTimeout(20);
}
await page.mouse.up();
await page.waitForTimeout(200);
await page.screenshot({ path: `${folder}/desktop-arranged.png` });
await page.getByLabel('Atur posisi Case Files', { exact: true }).click();
await page.waitForTimeout(150);
await page.screenshot({ path: `${folder}/position-controls.png` });
await page.keyboard.press('Escape');
await page.locator('#os-menu-trigger').click();
await page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: 'Mail & sumber berdampingan' }).click();
await page.waitForTimeout(250);
await page.screenshot({ path: `${folder}/desktop-comparison.png` });
const windows = await page.locator('.px-window:visible').evaluateAll(elements => elements.map(element => {
  const bounds = element.getBoundingClientRect();
  return { name: element.getAttribute('aria-label'), x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, layer: getComputedStyle(element).zIndex };
}));
const storageUnchanged = saved === await page.evaluate(() => localStorage.getItem('trusttrail:save:v1'));
await page.setViewportSize({ width: 1120, height: 800 });
await page.waitForTimeout(200);
await page.screenshot({ path: `${folder}/compact-desktop-comparison.png` });
const video = page.video();
await context.close();
await rename(await video.path(), `${folder}/interaction-demo.webm`);

const responsive = [];
for (const width of [360, 390, 768]) {
  const phone = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', hasTouch: true });
  const screen = await phone.newPage();
  await screen.goto('http://127.0.0.1:4173/');
  await screen.evaluate(() => document.fonts.ready);
  await screen.screenshot({ path: `${folder}/homepage-${width}.png` });
  await screen.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  await screen.screenshot({ path: `${folder}/game-${width}.png` });
  responsive.push({ width, noOverflow: await screen.evaluate(() => document.documentElement.scrollWidth <= innerWidth), noWindowHandles: await screen.locator('.os-draggable-titlebar').count() === 0 });
  await phone.close();
}
await browser.close();
const result = { errors, storageUnchanged, windows, responsive };
await writeFile(`${folder}/review-results.json`, JSON.stringify(result, null, 2));
log(JSON.stringify(result, null, 2));
