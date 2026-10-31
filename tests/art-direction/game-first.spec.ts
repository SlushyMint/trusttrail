import { expect, test } from '@playwright/test';

test('keyboard inspection records a clue once, journal restores focus, and the real save is untouched', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('trusttrail:save:v1', 'existing-player-save-untouched'));
  await page.goto('/art-direction.html');
  const journal = page.getByRole('button', { name: 'Jurnal 0' });
  const sender = page.getByRole('button', { name: /Periksa pengirim/ });
  await sender.focus();
  await expect(journal).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('Alamat di balik nama pengirim');
  await expect(page.getByRole('button', { name: 'Jurnal 1' })).toBeVisible();
  await sender.press('Enter');
  await sender.press('Enter');
  const openJournal = page.getByRole('button', { name: 'Jurnal 1' });
  await openJournal.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Jurnal bukti' });
  await expect(dialog.getByRole('heading', { name: 'Alamat di balik nama pengirim' })).toBeVisible();
  await expect(dialog.locator('.journal-entries > li')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(openJournal).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem('trusttrail:save:v1'))).toBe('existing-player-save-untouched');
});

test('opening a directory earns nothing and the verification decision retains both deliberate source actions', async ({ page }) => {
  await page.goto('/art-direction.html');
  await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Jurnal 0' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Catat perbandingan' })).toHaveCount(0);
  await page.getByRole('button', { name: /Pertimbangkan langkah/ }).click();
  await expect(page.getByRole('button', { name: 'Jalankan pilihan' })).toBeDisabled();
  await page.getByRole('radio', { name: /Tahan dulu/ }).check();
  await page.getByRole('button', { name: 'Jalankan pilihan' }).click();
  await expect(page.getByRole('heading', { name: 'Periksa sebelum menyimpulkan.' })).toBeVisible();
  await page.getByRole('button', { name: 'Periksa catatan lowongan' }).click();
  await expect(page.getByRole('button', { name: 'Jurnal 0' })).toBeVisible();
  await page.getByRole('button', { name: 'Catat perbandingan' }).click();
  await expect(page.getByRole('button', { name: 'Jurnal 1' })).toBeVisible();
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  await expect(page.getByRole('heading', { name: /Undangannya berhenti/ })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('trusttrail:save:v1'))).toBeNull();
});

test('missing environment and portrait cannot prevent investigation or a forward decision path', async ({ page }) => {
  await page.route('**/*', route => route.request().resourceType() === 'image' && /(?:room-afternoon|ari-(?:curious|uncertain|composed)).*\.webp/.test(route.request().url()) ? route.abort() : route.continue());
  await page.goto('/art-direction.html');
  await expect(page.locator('.gf-stage--fallback')).toBeVisible();
  await expect(page.locator('.gf-portrait-fallback')).toBeVisible();
  await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  await expect(page.getByRole('button', { name: 'Jurnal 1' })).toBeVisible();
  await page.getByRole('button', { name: /Pertimbangkan langkah/ }).click();
  await page.getByRole('radio', { name: /Abaikan undangan/ }).check();
  await page.getByRole('button', { name: 'Jalankan pilihan' }).click();
  await expect(page.getByRole('button', { name: /Lihat refleksi/ })).toBeVisible();
});

test('story advances only through keyboard action and retains its expression and content with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/art-direction.html?scene=story');
  await expect(page.locator('.gf-dialogue__text')).toContainText('Tiga bulan setelah lulus');
  expect(await page.locator('.gf-dialogue').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  for (let index = 0; index < 3; index++) {
    await page.getByRole('button', { name: /Lanjut cerita/ }).focus();
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('.gf-dialogue__text')).toContainText('aku bahkan nggak ingat');
  await expect(page.getByRole('img', { name: /Ari ragu/ })).toBeVisible();
  await page.getByRole('button', { name: /Periksa undangan/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('region', { name: 'Artefak investigasi', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Jurnal 0' })).toBeVisible();
});

test('persistent HUD, readable targets and room return work with touch and reflow', async ({ page, isMobile }) => {
  await page.goto('/art-direction.html');
  const target = page.getByRole('button', { name: /Periksa tujuan tautan/ });
  await target.scrollIntoViewIfNeeded();
  if (isMobile) await target.tap(); else await target.click();
  await expect(page.getByRole('button', { name: 'Jurnal 1' })).toBeVisible();
  const hud = await page.locator('.gf-hud').boundingBox();
  expect(hud!.y).toBeGreaterThanOrEqual(0);
  expect(hud!.y).toBeLessThanOrEqual(44);
  expect(await target.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: /Kembali ke kamar/ }).click();
  const laptop = page.getByRole('button', { name: /Buka laptop/ });
  await expect(laptop).toBeFocused();
  await expect(page.getByRole('region', { name: 'Artefak investigasi', exact: true })).toHaveCount(0);
  if (isMobile) await laptop.tap(); else await laptop.press('Enter');
  await expect(page.getByRole('button', { name: /Periksa pengirim/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Jurnal 1' })).toBeVisible();
});
