import { expect, test } from '@playwright/test';
import { commitChoice, enterChapterOne, openGameApp, openMail, readRun } from './helpers';

test('one persisted session keeps expanded clues and an uncommitted decision across shells', async ({ page }) => {
  await enterChapterOne(page);
  await page.getByRole('button', { name: 'Periksa pengirim', exact: true }).click();
  const saved = await readRun(page);
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await expect(page.locator('.px-inline-detail code')).toHaveText('recruitment@novatech-talenta.example');
    await expect(page.locator('.trusttrail-os')).toHaveAttribute('data-os', width >= 1120 ? 'desktop' : 'saku');
    expect(await readRun(page)).toEqual(saved);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole('button', { name: /Tentukan langkah/ }).click();
  await page.getByRole('radio', { name: /Tahan dulu, verifikasi/ }).check();
  const beforeCommit = await readRun(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('radio', { name: /Tahan dulu, verifikasi/ })).toBeChecked();
  expect(await readRun(page)).toEqual(beforeCommit);
  expect(beforeCommit.events.some(event => event.type === 'choice.committed')).toBe(false);
});

test('pending source verification persists through resize, reload and later source comparison', async ({ page }) => {
  await enterChapterOne(page);
  await commitChoice(page, /Tahan dulu, verifikasi/);
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await expect(page.getByRole('heading', { name: 'Periksa sebelum menyimpulkan.' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true }).click();
  const sourceRead = await readRun(page);
  await page.setViewportSize({ width: 360, height: 844 });
  await page.reload();
  expect(await readRun(page)).toEqual(sourceRead);
  await page.getByRole('button', { name: 'Bandingkan dengan undangan', exact: true }).click();
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await expect(page.getByText('0 / 4', { exact: true })).toBeVisible();
  await expect(page.getByText('2 / 2', { exact: true })).toHaveCount(2);
  await openGameApp(page, 'Case Files');
  await expect(page.getByText('C1-E04 · Setelah pilihan', { exact: true })).toBeVisible();
});

test('browser back, forward, inbox and home navigation never roll back gameplay', async ({ page }) => {
  await enterChapterOne(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Periksa pengirim', exact: true }).click();
  const saved = await readRun(page);
  await page.getByRole('button', { name: 'Kotak masuk', exact: false }).click();
  await page.getByRole('button', { name: /Pusat Karier Kampus.*Infomasi/ }).click();
  await expect(page.locator('.px-document-heading h3')).toHaveText('Infomasi klinik CV hari Jumat');
  await page.goBack();
  await expect(page.locator('.px-mail-list')).toBeVisible();
  await page.goForward();
  await expect(page.locator('.px-document-heading h3')).toHaveText('Infomasi klinik CV hari Jumat');
  expect(await readRun(page)).toEqual(saved);
  await page.getByRole('link', { name: 'Beranda Saku', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Undangan kerja\.\s*Atau perangkap\?/);
  await page.getByRole('link', { name: /Lanjutkan perjalanan/ }).first().click();
  await openMail(page);
  await expect(page.getByRole('button', { name: 'Periksa pengirim', exact: true })).toBeVisible();
  expect(await readRun(page)).toEqual(saved);
});

test('desktop window controls and Saku fullscreen navigation are deliberate at boundaries', async ({ page }) => {
  await enterChapterOne(page);
  await page.setViewportSize({ width: 1440, height: 960 });
  await openGameApp(page, 'Browser');
  const before = await readRun(page);
  await page.getByRole('button', { name: 'Maksimalkan Browser', exact: true }).click();
  await expect(page.locator('#os-app-browser')).toHaveClass(/is-maximized/);
  await page.getByRole('button', { name: 'Pulihkan Browser', exact: true }).click();
  await page.getByRole('button', { name: 'Minimalkan Browser', exact: true }).click();
  await expect(page.locator('#os-app-browser')).toBeHidden();
  await openGameApp(page, 'Browser');
  await page.getByRole('button', { name: 'Tutup Browser', exact: true }).click();
  await expect(page.locator('#os-app-browser')).toBeHidden();
  for (const [width, height, shell] of [[1119, 900, 'saku'], [1120, 900, 'desktop'], [1440, 699, 'saku'], [1440, 700, 'desktop']] as const) {
    await page.setViewportSize({ width, height });
    await expect(page.locator('.trusttrail-os')).toHaveAttribute('data-os', shell);
    if (shell === 'saku') await expect(page.locator('.px-window-controls')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(await readRun(page)).toEqual(before);
});
