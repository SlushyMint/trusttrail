/* global document, window, localStorage, Storage */
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import { log } from 'node:console';
import process from 'node:process';

const url = process.argv[2] || 'http://127.0.0.1:4384/dual-os.html';
const output = new URL('../docs/dual-os-review/', import.meta.url);
await mkdir(output, { recursive: true });
const results = [];
const equivalence = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const check = async (name, action) => { await action(); results.push(name); log(`PASS ${name}`); };
const screenshot = (page, name) => page.screenshot({ path: fileURLToPath(new URL(name, output)), animations: 'disabled' });
const noOverflow = async page => expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

async function ready(page) { await page.goto(url); await page.evaluate(() => document.fonts.ready.then(() => true)); }
async function openApp(page, label, desktop) {
  if (desktop) await page.getByRole('button', { name: `Tampilkan ${label}`, exact: true }).click();
  else {
    await page.getByRole('button', { name: 'Ganti aplikasi', exact: true }).click();
    await page.getByRole('dialog', { name: 'Ganti aplikasi' }).getByRole('button', { name: new RegExp(`^${label}`) }).click();
  }
}
async function evidenceIds(page, desktop) {
  if (!desktop) await openApp(page, 'Case Files', false);
  return page.locator('.px-record-id').allTextContents();
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    localStorage.setItem('trusttrail:save:v1', 'dual-review-existing-save-sentinel');
    window.__reviewStorageCalls = [];
    for (const method of ['getItem', 'setItem', 'removeItem', 'clear']) {
      const original = Storage.prototype[method];
      Storage.prototype[method] = function (...args) { window.__reviewStorageCalls.push([method, ...args]); return original.apply(this, args); };
    }
  });
  const page = await context.newPage();
  const errors = [];
  const external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!['127.0.0.1', 'localhost'].includes(new URL(request.url()).hostname)) external.push(request.url()); });
  await ready(page);
  await check('Desktop uses pixel windows, taskbar and Case Files', async () => {
    await expect(page.locator('.dual-desktop')).toBeVisible();
    await expect(page.locator('.saku-os')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Case Files', exact: true })).toBeVisible();
    await expect(page.locator('.px-evidence-count > span')).toHaveText('00');
  });
  await check('Paired desktop screenshot records only canonical sender clue', async () => {
    const inspect = page.getByRole('button', { name: 'Periksa pengirim', exact: true });
    await inspect.focus(); await page.keyboard.press('Enter');
    await inspect.click(); await inspect.click();
    await expect(page.locator('.px-evidence-count > span')).toHaveText('01');
    await expect(page.locator('.px-inline-detail code')).toHaveText('recruitment@novatech-talenta.example');
    equivalence.push({ screen: 'desktop-mail', chapter: 'C1', evidence: await evidenceIds(page, true), committedChoice: false, sourceInspected: false });
    await screenshot(page, 'desktop-mail.png');
  });
  await check('Live resize to mobile keeps sender clue and switches to fullscreen OS', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.saku-os')).toBeVisible();
    await expect(page.locator('.px-window')).toHaveCount(0);
    await expect(page.locator('.px-taskbar')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Beranda Saku', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Periksa pengirim', exact: true }).click();
    await screenshot(page, 'mobile-mail.png');
    const ids = await evidenceIds(page, false);
    expect(ids).toEqual(equivalence[0].evidence);
    equivalence.push({ screen: 'mobile-mail', chapter: 'C1', evidence: ids, committedChoice: false, sourceInspected: false });
    await screenshot(page, 'mobile-case-files.png');
    await page.locator('.px-evidence-record summary').click();
    await expect(page.locator('.px-evidence-record[open]')).toContainText('Perbedaan domain');
    await page.getByRole('button', { name: 'Beranda Saku', exact: true }).click();
    await screenshot(page, 'mobile-home.png');
    await expect(page.locator('.saku-badge[aria-label="1 bukti"]')).toHaveText('1');
  });
  await check('Browser Back, Forward and in-game Back preserve game evidence', async () => {
    await page.getByRole('button', { name: 'Buka Mail', exact: true }).click();
    await expect(page).toHaveURL(/#mail$/);
    await page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ }).click();
    await expect(page).toHaveURL(/#mail\/read$/);
    await page.goBack(); await expect(page).toHaveURL(/#mail$/);
    await expect(page.locator('.px-mail-list')).toBeVisible();
    await page.goForward(); await expect(page).toHaveURL(/#mail\/read$/);
    await page.locator('.saku-app-header').getByRole('button', { name: 'Kembali', exact: true }).click();
    await expect(page).toHaveURL(/#mail$/);
    await page.goForward(); await expect(page).toHaveURL(/#mail\/read$/);
    expect(await evidenceIds(page, false)).toEqual(['C1-E01']);
  });
  await check('Saku app switcher supports Escape and returns keyboard focus', async () => {
    await page.getByRole('button', { name: 'Ganti aplikasi', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Ganti aplikasi' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#dual-switcher')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Ganti aplikasi', exact: true })).toBeFocused();
  });

  for (const width of [360, 390, 768, 1440]) {
    const desktop = width === 1440;
    await check(`${width}px: all four clues, ordered verification, outcomes and no overflow`, async () => {
      await page.setViewportSize({ width, height: width < 640 ? 844 : 960 }); await ready(page);
      if (width === 360) await screenshot(page, 'mobile-360-home.png');
      if (!desktop) {
        await expect(page.locator('.saku-os')).toBeVisible();
        await expect(page.locator('.px-window-controls')).toHaveCount(0);
        await page.getByRole('button', { name: 'Buka Mail', exact: true }).click();
        await page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ }).click();
      }
      await page.getByRole('button', { name: 'Periksa pengirim', exact: true }).click();
      if (width === 360) await screenshot(page, 'mobile-360-mail.png');
      await page.getByRole('button', { name: 'Periksa batas waktu', exact: true }).click();
      await page.getByRole('button', { name: /karier.novatech.example\/undangan/ }).click();
      await expect(page.locator('.px-inline-detail code')).toHaveText('novatech-kandidat.example/konfirmasi');
      await noOverflow(page);
      await page.getByRole('button', { name: 'Cari sumber terpisah', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Bandingkan dengan undangan', exact: true })).toHaveCount(0);
      await page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true }).click();
      await expect(page.locator('.px-source-reference')).toContainText('novatech.example');
      await expect(page.locator('.px-browser-document')).toContainText('Klaim dalam undangan');
      if (width === 390 || desktop) {
        await page.locator('.px-browser-document').evaluate(element => {
          const heading = element.querySelector('h4');
          if (heading) element.scrollTop += heading.getBoundingClientRect().top - element.getBoundingClientRect().top - 16;
        });
        await screenshot(page, desktop ? 'desktop-verification.png' : 'mobile-verification.png');
      }
      await page.getByRole('button', { name: 'Bandingkan dengan undangan', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Perbandingan selesai', exact: true })).toBeDisabled();
      await noOverflow(page);
      const ids = await evidenceIds(page, desktop);
      expect(ids).toEqual(['C1-E01', 'C1-E02', 'C1-E03', 'C1-E04']);
      if (width === 768) await screenshot(page, 'tablet-case-files.png');
      await openApp(page, 'Mail', desktop);
      if (!desktop && width < 720) await page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ }).click();
      await page.getByRole('button', { name: /Tentukan langkah/ }).click();
      await page.getByRole('radio', { name: /Tahan dulu, verifikasi/ }).check();
      await page.getByRole('button', { name: 'Jalankan pilihan', exact: true }).click();
      await expect(page.locator('.px-case-flow h3')).toHaveText('Klaim bertemu pembanding.');
      await page.getByRole('button', { name: /Lihat refleksi/ }).click();
      await expect(page.locator('.px-facts')).toContainText('4 / 4');
      await expect(page.locator('.px-facts')).toContainText('2 / 2');
      await page.getByRole('button', { name: 'Tutup berkas Bab 1', exact: true }).click();
      await expect(page.locator('.px-case-flow')).toContainText('Bab 1 selesai.');
      expect(await page.evaluate(() => window.__reviewStorageCalls)).toEqual([]);
    });
  }
  await check('Verification survives 1440→360→768→1440 without reset or retroactive awareness', async () => {
    await ready(page);
    await page.getByRole('button', { name: /Tentukan langkah/ }).click();
    await page.getByRole('radio', { name: /Tahan dulu, verifikasi/ }).check();
    await page.getByRole('button', { name: 'Jalankan pilihan', exact: true }).click();
    await page.setViewportSize({ width: 360, height: 844 });
    await expect(page.locator('.px-case-flow h3')).toHaveText('Periksa sebelum menyimpulkan.');
    await page.locator('.px-case-flow').getByRole('button', { name: /Buka Browser/ }).click();
    await page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true }).click();
    await page.setViewportSize({ width: 768, height: 960 });
    await expect(page.getByRole('button', { name: 'Bandingkan dengan undangan', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Bandingkan dengan undangan', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 960 });
    await expect(page.locator('.px-case-flow h3')).toHaveText('Klaim bertemu pembanding.');
    await page.getByRole('button', { name: /Lihat refleksi/ }).click();
    await expect(page.locator('.px-facts')).toContainText('0 / 4');
    await expect(page.locator('.px-facts')).toContainText('2 / 2');
    await expect(page.locator('.px-case-flow')).toContainText('1 bukti ditemukan setelah pilihan');
  });
  await check('Deliberate breakpoint boundaries and short landscape select useful shells', async () => {
    for (const [width, height, desktop] of [[1119, 900, false], [1120, 900, true], [1440, 699, false], [1440, 700, true], [768, 480, false]]) {
      await page.setViewportSize({ width, height });
      await expect(page.locator(desktop ? '.dual-desktop' : '.saku-os')).toBeVisible();
      await noOverflow(page);
    }
  });
  await check('Shared assets fail gracefully; readable UI, no external requests or runtime errors', async () => {
    await page.route('**/pixel/relay-coast.png', route => route.abort());
    await page.setViewportSize({ width: 390, height: 844 }); await ready(page);
    await page.getByRole('button', { name: 'Buka Mail', exact: true }).click();
    await page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ }).click();
    await expect(page.getByRole('button', { name: 'Periksa pengirim', exact: true })).toBeVisible();
    expect(await page.evaluate(() => window.__reviewStorageCalls)).toEqual([]);
    expect(await page.evaluate(() => { const get = Storage.prototype.getItem; return get.call(localStorage, 'trusttrail:save:v1'); })).toBe('dual-review-existing-save-sentinel');
    expect(external).toEqual([]); expect(errors).toEqual([]);
  });
  await context.close();
  const touchContext = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const touch = await touchContext.newPage();
  await check('Real touch emulation reaches sender clue, notifications and Case Files', async () => {
    await ready(touch);
    await touch.getByRole('button', { name: 'Buka Mail', exact: true }).tap();
    await touch.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ }).tap();
    await touch.getByRole('button', { name: 'Periksa pengirim', exact: true }).tap();
    await expect(touch.getByRole('status')).toContainText('Bukti baru dicatat');
    await touch.getByRole('button', { name: 'Ganti aplikasi', exact: true }).tap();
    await touch.getByRole('dialog').getByRole('button', { name: /^Case Files/ }).tap();
    await touch.locator('.px-evidence-record summary').tap();
    await expect(touch.locator('.px-evidence-record[open]')).toContainText('recruitment@novatech-talenta.example');
    await noOverflow(touch);
  });
  await touchContext.close();
  await writeFile(new URL('checks.json', output), JSON.stringify({ url, date: new Date().toISOString(), passed: results.length, checks: results, representativeStateEquivalence: equivalence }, null, 2));
  log(`${results.length} dual-OS review checks passed.`);
} finally { await browser.close(); }
