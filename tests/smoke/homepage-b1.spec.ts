import { expect, test } from '@playwright/test';
import { enterChapterOne } from './helpers';

test('OS selectors share preview state without writing to a saved investigation', async ({ page }) => {
  await enterChapterOne(page);
  await page.getByRole('button', { name: 'Periksa pengirim', exact: true }).click();
  await page.goto('/');
  const saved = await page.evaluate(() => JSON.stringify(localStorage));
  const tabs = page.getByRole('group', { name: 'Aplikasi pratinjau' });
  const dock = page.getByRole('group', { name: 'Pilih alat investigasi' });
  await dock.getByRole('button', { name: /Browser/ }).focus();
  await page.keyboard.press('Enter');
  await expect(tabs.getByRole('button', { name: 'Browser', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#os-preview-content')).toContainText('novatech.example/karier');
  await expect(page.locator('#os-preview-content')).not.toContainText('ketidakcocokan');
  await tabs.getByRole('button', { name: 'Case Files', exact: true }).click();
  await expect(dock.getByRole('button', { name: /Case Files/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#os-preview-content')).toContainText('Belum ada bukti diperiksa.');
  await tabs.getByRole('button', { name: 'Mail', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#os-preview-content')).toContainText('Undangan tahap akhir');
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(saved);
  await page.locator('.portal-preview-footer').getByRole('link', { name: /Lanjutkan perjalanan/ }).click();
  await expect(page).toHaveURL(/\/play/);
  await page.getByRole('button', { name: 'Periksa pengirim', exact: true }).click();
  await expect(page.locator('.px-inline-detail code')).toHaveText('recruitment@novatech-talenta.example');
});

test('intelligence files retain scope, period, source and link through keyboard switching', async ({ page }) => {
  await page.goto('/');
  const before = await page.evaluate(() => JSON.stringify(localStorage));
  const group = page.getByRole('group', { name: 'Pilih berkas intelijen' });
  const files = group.getByRole('button');
  const expectations = [
    ['74.243', '22 November 2024–23 Maret 2025', 'bukan korban unik', 'ojk.go.id'],
    ['7.908', 'Januari–Agustus 2026', 'bukan korban atau lowongan unik', 'komdigi.go.id'],
    ['36,3%', 'Survei IMDI 2025', 'tidak mengetahui sama sekali', 'bpsdm.komdigi.go.id'],
  ];
  for (const [index, [number, period, scope, host]] of expectations.entries()) {
    await files.nth(index).focus();
    await page.keyboard.press('Enter');
    const detail = page.locator('#intel-detail');
    await expect(detail).toContainText(number!);
    await expect(detail).toContainText(period!);
    await expect(detail).toContainText(scope!);
    expect(new URL((await detail.locator('a').getAttribute('href'))!).hostname).toContain(host!);
    await expect(files.nth(index)).toHaveAttribute('aria-pressed', 'true');
    await expect(group.locator('[aria-pressed=true]')).toHaveCount(1);
  }
  await expect(page.locator('#intel-detail')).toContainText('bukan hasil tes deteksi phishing atau persentase korban');
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(before);
  await page.getByRole('link', { name: 'Periksa sebuah pesan' }).click();
  await expect(page).toHaveURL(/#latihan$/);
  await page.getByRole('button', { name: 'Periksa alamat pengirim' }).click();
  await expect(page.locator('#practice-sender')).toBeVisible();
});

test('city pause control stops rendering and respects reduced motion', async ({ page }) => {
  await page.goto('/');
  const city = page.locator('.living-city');
  await expect(city).toHaveAttribute('data-city-status', 'ready');
  await page.getByRole('button', { name: /Jeda gerak kota/ }).click();
  await expect(city).toHaveAttribute('data-city-rendering', 'paused');
  await page.getByRole('button', { name: /Lanjutkan gerak kota/ }).click();
  await expect(city).toHaveAttribute('data-city-rendering', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: /Gerak dikurangi/ })).toBeDisabled();
  await expect(city.locator('canvas')).toHaveCount(0);
});
