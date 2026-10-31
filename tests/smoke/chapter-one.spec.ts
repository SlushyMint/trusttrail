import { expect, test, type Locator } from '@playwright/test';
import { commitChoice, enterChapterOne, readRun, saveKey, openGameApp, openMail } from './helpers';

test('fully investigated Chapter 1 verifies independently and preserves its completed record', async ({ page }) => {
  const errors: string[] = [];
  const outbound: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outbound.push(request.url()); });
  await enterChapterOne(page);
  await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  await page.getByRole('button', { name: /Periksa batas waktu/ }).click();
  await page.getByRole('button', { name: /Periksa tujuan tautan/ }).click();
  const beforeSource = await readRun(page);
  await openGameApp(page, 'Browser');
  expect(await readRun(page)).toEqual(beforeSource);
  await page.getByRole('button', { name: 'Periksa catatan lowongan' }).click();
  await page.getByRole('button', { name: 'Bandingkan dengan undangan' }).click();
  await openMail(page);
  await commitChoice(page, /Tahan dulu, verifikasi/);
  await expect(page.getByRole('heading', { name: 'Klaim bertemu pembanding.' })).toBeVisible();
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await expect(page.getByText('4 / 4', { exact: true })).toBeVisible();
  await expect(page.getByText('2 / 2', { exact: true })).toHaveCount(2);
  await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  await expect(page.getByRole('heading', { name: 'Bab 1 selesai', exact: true })).toBeVisible();
  const completed = await readRun(page);
  await page.reload();
  expect(await readRun(page)).toEqual(completed);
  await expect(page.getByText(/Ari belum membuka tautan atau mengirim data/)).toBeVisible();
  expect(completed.events.filter(event => event.type === 'choice.committed')).toHaveLength(1);
  expect(errors).toEqual([]);
  expect(outbound).toEqual([]);
});

test('risky choice remains playable, never opens a real destination and invents no compromise', async ({ page }) => {
  await enterChapterOne(page);
  await commitChoice(page, /Buka tautan undangan/);
  await expect(page.getByRole('heading', { name: 'Satu klik, pertanyaan baru.' })).toBeVisible();
  await expect(page.locator('input, form, iframe')).toHaveCount(0);
  await expect(page.getByText(/Membuka tautan tidak sama dengan membuktikan/)).toBeVisible();
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await expect(page.getByText('0 / 4', { exact: true })).toBeVisible();
  await expect(page.getByText('0 / 2', { exact: true })).toHaveCount(2);
  await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  await expect(page.getByText(/menutup pratinjau kandidat tanpa mengisi/)).toBeVisible();
});

test('unfinished verification survives refresh; later evidence never earns retroactive awareness', async ({ page }) => {
  await enterChapterOne(page);
  await commitChoice(page, /Tahan dulu, verifikasi/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Periksa sebelum menyimpulkan.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Bandingkan dengan undangan' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Periksa catatan lowongan' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Bandingkan dengan undangan' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Klaim bertemu pembanding.' })).toBeVisible();
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await expect(page.getByText('0 / 4', { exact: true })).toBeVisible();
  await expect(page.getByText('2 / 2', { exact: true })).toHaveCount(2);
  await openGameApp(page, 'Case Files');
  const journal = page.getByRole('region', { name: 'Case Files' });
  await expect(journal.getByText('C1-E04 · Setelah pilihan')).toBeVisible();
  expect((await readRun(page)).events.filter(event => event.type === 'choice.committed')).toHaveLength(1);
});

test('ignore protects Ari without requiring clues and restart/reset require confirmation', async ({ page }) => {
  await enterChapterOne(page);
  await commitChoice(page, /Abaikan undangan ini/);
  await expect(page.getByRole('heading', { name: 'Berhenti juga sebuah pilihan.' })).toBeVisible();
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await expect(page.getByText('0 / 4', { exact: true })).toBeVisible();
  await expect(page.getByText('2 / 2', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  await page.evaluate(() => localStorage.setItem('unrelated-progress', 'keep'));
  const previous = await readRun(page);
  await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
  await page.getByRole('button', { name: 'Batal', exact: true }).click();
  expect(await readRun(page)).toEqual(previous);
  await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
  await page.getByRole('button', { name: 'Ya, mulai ulang' }).click();
  expect((await readRun(page)).events).toEqual([{ type: 'run.started' }]);
  await page.getByRole('link', { name: 'TrustTrail, beranda' }).click();
  await page.getByText('Kelola progres tersimpan', { exact: true }).click();
  await page.getByRole('button', { name: 'Hapus progres', exact: true }).click();
  await page.getByRole('button', { name: 'Ya, hapus progres' }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('unrelated-progress'))).toBe('keep');
});

test('corrupt save is not silently overwritten', async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, '{corrupt'), saveKey);
  await page.goto('/play');
  await expect(page.getByText(/Simpanan tidak dapat dibaca/)).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe('{corrupt');
  await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
  await page.getByRole('button', { name: 'Batal', exact: true }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe('{corrupt');
});

test('blocked storage allows a memory-only Chapter 1 playthrough', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'QuotaExceededError'); }; });
  await enterChapterOne(page);
  await expect(page.getByText(/Penyimpanan browser tidak tersedia/)).toBeVisible();
  await commitChoice(page, /Abaikan undangan ini/);
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  await expect(page.getByRole('heading', { name: 'Bab 1 selesai', exact: true })).toBeVisible();
});

test('another tab pauses writes until the player reloads the latest progress', async ({ page, context }) => {
  await enterChapterOne(page);
  const second = await context.newPage();
  await second.goto('/play');
  await second.getByRole('button', { name: /Periksa pengirim/ }).click();
  await expect(page.getByText(/Progres berubah di tab lain/)).toBeVisible();
  const external = await readRun(second);
  await page.getByRole('button', { name: /Periksa batas waktu/ }).click();
  expect(await readRun(page)).toEqual(external);
  await page.getByRole('button', { name: 'Muat progres terbaru' }).click();
  await openGameApp(page, 'Case Files');
  const journal = page.getByRole('region', { name: 'Case Files' });
  await expect(journal.getByRole('heading', { name: 'Alamat di balik nama pengirim' })).toBeVisible();
  await expect(journal.getByRole('heading', { name: 'Batas waktu yang menekan' })).toHaveCount(0);
  await second.close();
});

test('Chapter 1 can be completed using keyboard traversal and activation only', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/play');
  async function tabTo(target: Locator) {
    for (let attempt = 0; attempt < 60; attempt++) {
      if (await target.evaluate(element => element === document.activeElement)) return;
      await page.keyboard.press('Tab');
    }
    throw new Error(`Control was not reachable by Tab: ${await target.innerText()}`);
  }
  async function activate(target: Locator) { await tabTo(target); await page.keyboard.press('Enter'); }
  await activate(page.getByRole('button', { name: /Mulai investigasi/ }));
  await activate(page.getByRole('button', { name: /Buka berkas pertama/ }));
  for (let i = 0; i < 3; i++) await activate(page.getByRole('button', { name: /Lanjut cerita/ }));
  await activate(page.getByRole('button', { name: /Periksa undangan/ }));
  await activate(page.getByRole('button', { name: /Periksa pengirim/ }));
  await activate(page.getByRole('button', { name: /Periksa batas waktu/ }));
  await activate(page.getByRole('button', { name: /Periksa tujuan tautan/ }));
  await activate(page.locator('#os-menu-trigger'));
  await activate(page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: /^Browser/ }));
  await activate(page.getByRole('button', { name: 'Periksa catatan lowongan' }));
  await activate(page.getByRole('button', { name: 'Bandingkan dengan undangan' }));
  await activate(page.locator('#os-menu-trigger'));
  await activate(page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: 'Mail Kotak masuk Ari', exact: true }));
  const invitation = page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ });
  if (await invitation.isVisible()) await activate(invitation);
  await activate(page.getByRole('button', { name: /Tentukan langkah/ }));
  await tabTo(page.getByRole('radio', { name: /Buka tautan undangan/ }));
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: /Tahan dulu, verifikasi/ })).toBeChecked();
  await activate(page.getByRole('button', { name: 'Jalankan pilihan' }));
  await activate(page.getByRole('button', { name: /Lihat refleksi/ }));
  await expect(page.getByText('4 / 4', { exact: true })).toBeVisible();
  await activate(page.getByRole('button', { name: /Tutup berkas Bab 1/ }));
  await expect(page.getByRole('heading', { name: 'Bab 1 selesai', exact: true })).toBeVisible();
});

test('active email and source comparison reflow at 320, 360, 768 and 1440 pixels', async ({ page }) => {
  await enterChapterOne(page);
  for (const width of [320, 360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openMail(page);
    await page.getByRole('button', { name: /Periksa pengirim/ }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await openGameApp(page, 'Browser');
    const inspectSource = page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true });
    if (await inspectSource.isVisible()) await inspectSource.click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Bandingkan dengan undangan' })).toBeVisible();
  }
});
