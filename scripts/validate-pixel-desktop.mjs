/* global document, window, localStorage, Storage */
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { log } from 'node:console';
import { URL } from 'node:url';
import process from 'node:process';

// Built review entry only. Run after review-art-direction.mjs (or --build-only).
const url = process.argv[2] || 'http://127.0.0.1:4384/art-direction.html';
const out = new URL('../docs/pixel-desktop-review/', import.meta.url);
await mkdir(out, { recursive: true });
const results = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function check(name, task) { await task(); results.push(name); log(`PASS ${name}`); }
async function ready(page) { await page.goto(url); await page.evaluate(() => document.fonts.ready.then(() => true)); }
const shots = name => new URL(name, out).pathname.replace(/^\/([A-Za-z]:)/, '$1');

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!['127.0.0.1', 'localhost'].includes(new URL(request.url()).hostname)) external.push(request.url()); });
  await page.addInitScript(() => {
    localStorage.setItem('trusttrail:save:v1', 'existing-player-save-sentinel');
    window.__pixelStorageWrites = [];
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) { window.__pixelStorageWrites.push(key); original.call(this, key, value); };
  });
  await ready(page);
  await check('Real fonts load, one h1, empty journal, zero external requests', async () => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.px-evidence-count > span')).toHaveText('00');
    expect(await page.evaluate(() => document.fonts.check('12px Silkscreen') && document.fonts.check('14px Inter'))).toBe(true);
    expect(external).toEqual([]);
  });
  await page.screenshot({ path: shots('desktop.png'), animations: 'disabled' });
  await check('Keyboard inspection records exactly one clue and announces it', async () => {
    const sender = page.getByRole('button', { name: 'Periksa pengirim', exact: true });
    await sender.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.px-evidence-count > span')).toHaveText('01');
    await expect(page.getByRole('status')).toContainText('Bukti baru dicatat');
    await expect(page.locator('.px-inline-detail code')).toHaveText('recruitment@novatech-talenta.example');
    await sender.click(); await sender.click();
    await expect(page.locator('.px-evidence-count > span')).toHaveText('01');
  });
  await page.screenshot({ path: shots('desktop-evidence.png'), animations: 'disabled' });
  await check('Deadline and inert destination discovery use canonical evidence', async () => {
    await page.getByRole('button', { name: 'Periksa batas waktu', exact: true }).click();
    await page.getByRole('button', { name: /karier.novatech.example\/undangan/ }).click();
    await expect(page.locator('.px-inline-detail code')).toHaveText('novatech-kandidat.example/konfirmasi');
    await expect(page.locator('.px-evidence-count > span')).toHaveText('03');
    expect(context.pages()).toHaveLength(1);
  });
  await check('Browser opening earns nothing; source inspect precedes comparison', async () => {
    await page.getByRole('button', { name: 'Tampilkan Browser', exact: true }).click();
    await expect(page.locator('.px-evidence-count > span')).toHaveText('03');
    await expect(page.getByRole('button', { name: 'Bandingkan dengan undangan', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true }).click();
    await expect(page.locator('.px-evidence-count > span')).toHaveText('03');
    await page.getByRole('button', { name: 'Bandingkan dengan undangan', exact: true }).click();
    await expect(page.locator('.px-evidence-count > span')).toHaveText('04');
    await expect(page.getByRole('button', { name: 'Perbandingan selesai', exact: true })).toBeDisabled();
  });
  await page.screenshot({ path: shots('browser.png'), animations: 'disabled' });
  await check('Minimize, restore, maximize, close and shortcut reopening work', async () => {
    await page.getByRole('button', { name: 'Maksimalkan Browser', exact: true }).click();
    await expect(page.locator('#px-window-browser')).toHaveClass(/is-maximized/);
    await page.getByRole('button', { name: 'Pulihkan Browser', exact: true }).click();
    await page.getByRole('button', { name: 'Minimalkan Browser', exact: true }).click();
    await expect(page.locator('#px-window-browser')).toBeHidden();
    await expect(page.locator('#task-browser')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#px-window-browser')).toBeVisible();
    await page.getByRole('button', { name: 'Tutup Browser', exact: true }).click();
    await expect(page.locator('#shortcut-browser')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#px-window-browser')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Perbandingan selesai', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: 'Tutup Browser', exact: true }).click();
  });
  await check('Benign campus message, Files and honest Messages empty state', async () => {
    await page.getByRole('button', { name: /Pusat Karier Kampus Infomasi/ }).click();
    await page.getByRole('button', { name: 'Periksa konteks kampus', exact: true }).click();
    await expect(page.locator('.px-inline-detail')).toContainText('Salah ketik tidak otomatis');
    await expect(page.locator('.px-evidence-count > span')).toHaveText('04');
    await page.getByRole('button', { name: 'Tampilkan Files', exact: true }).click();
    await page.getByRole('button', { name: 'catatan-kampus.txt', exact: true }).click();
    await expect(page.locator('.px-files article')).toContainText(chapterText());
    await page.getByRole('button', { name: 'Tutup Files', exact: true }).click();
    await page.getByRole('button', { name: 'Tampilkan Messages', exact: true }).click();
    await expect(page.locator('.px-empty-app')).toContainText('Belum ada percakapan.');
    await expect(page.locator('.px-empty-app')).toContainText('belum tersedia pada build M1');
    await page.getByRole('button', { name: 'Tutup Messages', exact: true }).click();
  });
  await check('Canonical verify outcome, reflection and M1 handoff remain playable', async () => {
    await page.getByRole('button', { name: 'Tentukan langkah', exact: false }).click();
    await page.getByRole('radio', { name: /Tahan dulu, verifikasi/ }).check();
    await page.getByRole('button', { name: 'Jalankan pilihan', exact: true }).click();
    await expect(page.locator('.px-case-flow h3')).toHaveText('Klaim bertemu pembanding.');
    await page.getByRole('button', { name: 'Lihat refleksi', exact: false }).click();
    await expect(page.locator('.px-facts')).toContainText('4 / 4');
    await expect(page.locator('.px-facts')).toContainText('2 / 2');
    await page.getByRole('button', { name: 'Tutup berkas Bab 1', exact: true }).click();
    await expect(page.locator('.px-case-flow')).toContainText('Bab 1 selesai.');
  });
  await check('Production save untouched, preview uses no storage writes or external requests', async () => {
    expect(await page.evaluate(() => localStorage.getItem('trusttrail:save:v1'))).toBe('existing-player-save-sentinel');
    expect(await page.evaluate(() => window.__pixelStorageWrites)).toEqual([]);
    expect(errors).toEqual([]); expect(external).toEqual([]);
  });
  await check('Uninspected verify choice requires both source steps; late evidence stays late', async () => {
    await ready(page);
    await page.getByRole('button', { name: 'Tentukan langkah', exact: false }).click();
    await page.getByRole('radio', { name: /Tahan dulu, verifikasi/ }).check();
    await page.getByRole('button', { name: 'Jalankan pilihan', exact: true }).click();
    await expect(page.locator('.px-case-flow h3')).toHaveText('Periksa sebelum menyimpulkan.');
    await page.locator('.px-case-flow').getByRole('button', { name: 'Buka Browser', exact: false }).click();
    await page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true }).click();
    await page.getByRole('button', { name: 'Bandingkan dengan undangan', exact: true }).click();
    await expect(page.locator('.px-case-flow h3')).toHaveText('Klaim bertemu pembanding.');
    await page.getByRole('button', { name: 'Lihat refleksi', exact: false }).click();
    await expect(page.locator('.px-facts')).toContainText('0 / 4');
    await expect(page.locator('.px-facts')).toContainText('2 / 2');
    await expect(page.locator('.px-case-flow')).toContainText('1 bukti ditemukan setelah pilihan');
  });
  for (const [label, outcome] of [[/Buka tautan undangan/, 'Satu klik, pertanyaan baru.'], [/Abaikan undangan ini/, 'Berhenti juga sebuah pilihan.']]) {
    await check(`No clue quota: ${outcome}`, async () => {
      await ready(page);
      await page.getByRole('button', { name: 'Tentukan langkah', exact: false }).click();
      await page.getByRole('radio', { name: label }).check();
      await page.getByRole('button', { name: 'Jalankan pilihan', exact: true }).click();
      await expect(page.locator('.px-case-flow h3')).toHaveText(outcome);
    });
  }
  await check('390px touch composition supports inbox, sender inspection and journal switching', async () => {
    await page.setViewportSize({ width: 390, height: 844 }); await ready(page);
    await page.screenshot({ path: shots('mobile.png'), animations: 'disabled' });
    await page.getByRole('button', { name: 'Kotak masuk', exact: false }).click();
    await page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ }).click();
    await page.getByRole('button', { name: 'Periksa pengirim', exact: true }).click();
    await page.getByRole('button', { name: 'Tampilkan Evidence Journal', exact: true }).click();
    await expect(page.locator('.px-evidence-count > span')).toHaveText('01');
    await page.locator('.px-evidence-record summary').click();
    await expect(page.locator('.px-evidence-record[open]')).toContainText('recruitment@novatech-talenta.example');
    await page.screenshot({ path: shots('mobile-journal.png'), animations: 'disabled' });
  });
  await check('320/390/768/1440px reflow, 200% layout equivalent, wallpaper failure and keyboard launcher', async () => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 }); await ready(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await expect(page.getByRole('button', { name: 'Tentukan langkah', exact: false })).toBeVisible();
      if (width === 768) await page.screenshot({ path: shots('tablet.png'), animations: 'disabled' });
    }
    await page.setViewportSize({ width: 720, height: 450 }); await ready(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Tampilkan Browser', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true })).toBeVisible();
    await page.route('**/pixel/relay-coast.png', route => route.abort()); await ready(page);
    await expect(page.getByRole('button', { name: 'Periksa pengirim', exact: true })).toBeVisible();
    await page.locator('#px-launcher-button').click();
    await page.locator('#px-launcher-menu button').first().focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('#px-launcher-menu')).toHaveCount(0);
    await expect(page.locator('#px-launcher-button')).toBeFocused();
  });
  await context.close();
  await writeFile(new URL('checks.json', out), JSON.stringify({ url, date: new Date().toISOString(), passed: results.length, checks: results }, null, 2));
  log(`${results.length} pixel desktop checks passed. Screenshots saved in docs/pixel-desktop-review.`);
} finally { await browser.close(); }

function chapterText() { return 'Salah ketik tidak otomatis membuat pesan palsu.'; }
