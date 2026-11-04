import { expect, test, type Page } from '@playwright/test';
import { commitChoice, enterChapterOne, openGameApp, readRun } from './helpers';

async function enterChapterThree(page: Page, exposed = false) {
  await enterChapterOne(page);
  await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  await commitChoice(page, /Abaikan undangan ini/);
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  await page.getByRole('button', { name: /Lanjut ke Bab 2/ }).click();
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
  await page.getByRole('button', { name: /Buka pesan perekrut/ }).click();
  for (const name of [/Boleh jelaskan peran/, /Bisakah prosesnya/, /Apa yang dibutuhkan/]) await page.getByRole('button', { name }).click();
  await commitChoice(page, exposed ? /Ikuti Mira/ : /Tolak permintaan/);
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await page.getByRole('button', { name: /Tutup berkas Bab 2/ }).click();
  const c2 = await readRun(page);
  await page.getByRole('button', { name: /Lanjut ke Bab 3/ }).click();
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
  await page.getByRole('button', { name: /Buka instruksi terakhir/ }).click();
  await page.getByRole('button', { name: 'Baca instruksi di Mail' }).click();
  await expect(page.getByRole('heading', { name: 'Ari, verifikasi akhir untuk intern riset pengguna' })).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Jejak keputusan sebelumnya' })).toContainText(exposed ? 'Aku sudah membagikan identitas' : 'Aku menolak permintaan data Mira');
  await page.getByRole('button', { name: 'Buka portal simulasi' }).click();
  await expect(page.getByRole('heading', { name: 'Aktivasi kandidat', exact: true })).toBeVisible();
  return c2;
}

async function inspectPortal(page: Page) {
  for (const name of ['Periksa alamat portal', 'Periksa indikator HTTPS', 'Periksa syarat verifikasi']) {
    await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
  }
}
async function comparePortal(page: Page, reload = false) {
  await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
  await page.getByRole('button', { name: 'Baca prosedur resmi', exact: true }).click();
  const domain = page.getByRole('group', { name: 'Alamat portal resmi', exact: true });
  await domain.getByRole('radio', { name: 'novatech.example/karier', exact: true }).check();
  await domain.getByRole('button', { name: 'Cocokkan alamat portal resmi' }).click();
  if (reload) {
    const before = await readRun(page); await page.reload(); expect(await readRun(page)).toEqual(before);
    await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Klaim sudah dicocokkan', exact: true })).toBeDisabled();
  }
  const policy = page.getByRole('group', { name: 'Syarat rekrutmen', exact: true });
  await policy.getByRole('radio', { name: /Tidak meminta OTP/ }).check();
  await policy.getByRole('button', { name: 'Cocokkan syarat rekrutmen' }).click();
  await page.getByRole('button', { name: 'Catat hasil perbandingan', exact: true }).click();
}
async function choose(page: Page, label: RegExp) {
  await page.getByRole('button', { name: /Tentukan langkah Ari/ }).click();
  await page.getByRole('radio', { name: label }).check();
  await page.getByRole('button', { name: 'Jalankan pilihan' }).click();
}
async function recovery(page: Page, account = false, identity = false) {
  await page.getByRole('button', { name: /Mulai misi pemulihan/ }).click();
  await expect(page.getByRole('region', { name: 'Misi pemulihan' })).toBeVisible();
  await page.getByRole('button', { name: 'Minta Mira memulihkan akun' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Pihak yang meminta kode' })).toBeVisible();
  await expect(page.getByLabel('Progres pemulihan')).toHaveText(`0 / ${4 + Number(account) + Number(identity)} tindakan pemulihan selesai`);
  const beforeRetry = await readRun(page);
  await page.reload();
  expect(await readRun(page)).toEqual(beforeRetry);
  await expect(page.locator('.tt-recovery-feedback')).toBeEmpty();
  await expect(page.getByText(/Pilihan yang belum tepat tidak disimpan/)).toBeVisible();
  await page.getByRole('button', { name: 'Hentikan balasan dan permintaan baru' }).click();
  const saved = await readRun(page); await page.reload(); expect(await readRun(page)).toEqual(saved);
  await expect(page.getByRole('heading', { name: 'Simpan jejak yang relevan' })).toBeVisible();
  await page.getByRole('button', { name: 'Simpan alamat, profil, pesan, dan waktu secara privat' }).click();
  await page.getByRole('button', { name: 'Gunakan karier@novatech.example dari direktori' }).click();
  if (account) await page.getByRole('button', { name: 'Pulihkan lewat aplikasi resmi dan cabut sesi asing' }).click();
  if (identity) await page.getByRole('button', { name: 'Hubungi penerbit identitas lewat kanal resmi dan pantau penyalahgunaan' }).click();
  await page.getByRole('button', { name: 'Laporkan akun dan portal melalui kanal resmi platform' }).click();
  await page.getByRole('button', { name: /Selesaikan misi pemulihan/ }).click();
  await page.getByRole('button', { name: /Tutup berkas Bab 3/ }).click();
  await expect(page.getByRole('heading', { name: 'Bab 3 selesai', exact: true })).toBeVisible();
  await page.getByRole('link', { name: /Buka Trust Report/ }).click();
  await expect(page.getByText('Trust Report · Perjalanan Ari lengkap', { exact: true })).toBeVisible();
  const advice = page.getByRole('region', { name: 'Rekomendasi latihan' });
  await expect(advice.getByRole('listitem')).toHaveCount(account ? 3 : 2);
  await expect(advice).toContainText('Mengapa penting:');
  await expect(advice).toContainText(account ? 'aplikasi resmi layanan email' : 'Periksa batas waktu');
  await expect(page.getByText(/Penyelesaian tidak berarti semua jawaban tepat/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('finishes C1–C3 safely with meaningful comparisons, archived evidence and reloads', async ({ page }, info) => {
  const errors: string[] = [], outbound: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outbound.push(request.url()); });
  const c2 = await enterChapterThree(page);
  await expect(page.getByRole('button', { name: /Tentukan langkah Ari/ })).toHaveCount(0);
  await inspectPortal(page);
  await expect(page.getByText('Tidak ada tenggat sungguhan.', { exact: false }).first()).toBeVisible();
  const found = await readRun(page);
  await page.getByRole('button', { name: /^Periksa syarat verifikasi/ }).click();
  await page.getByRole('button', { name: /^Periksa syarat verifikasi/ }).click();
  expect(await readRun(page)).toEqual(found);
  await page.screenshot({ path: info.outputPath('portal-inspection.png') });
  await comparePortal(page, true);
  const compared = await readRun(page);
  await openGameApp(page, 'Case Files');
  await expect(page.getByRole('region', { name: 'Arsip Bab 1' })).toContainText('Abaikan undangan ini');
  await openGameApp(page, 'Messages');
  await expect(page.getByRole('heading', { name: 'Percakapan Mira tersimpan' })).toBeVisible();
  expect(await readRun(page)).toEqual(compared);
  await openGameApp(page, 'Browser');
  // Tabs are presentation state and may remount on mobile; use the persistent comparison result.
  await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
  await choose(page, /Hentikan portal dan konfirmasi/);
  await recovery(page);
  const final = await readRun(page);
  expect(final.events.slice(0, c2.events.length)).toEqual(c2.events);
  expect(final.events.filter(event => event.type === 'choice.committed')).toHaveLength(3);
  expect(final.events.filter(event => event.type === 'source.compared')).toHaveLength(1);
  expect(final.events.filter(event => event.type === 'recovery.acted')).toHaveLength(4);
  await page.reload(); expect(await readRun(page)).toEqual(final);
  await expect(page.getByRole('region', { name: 'Laporan Bab 3' })).toContainText('4 / 4');
  expect(errors).toEqual([]); expect(outbound).toEqual([]);
  expect(await page.locator('input[type="password"],input[type="file"],input[type="text"],form').count()).toBe(0);
});

test('unsafe code and earlier identity disclosure lead to six recovery actions without a game over', async ({ page }, info) => {
  await enterChapterThree(page, true);
  await inspectPortal(page); await comparePortal(page);
  await choose(page, /Bagikan kode fiktif/);
  await expect(page.getByRole('heading', { name: 'Kode kandidat ternyata akses akun.' })).toBeVisible();
  await page.reload();
  await recovery(page, true, true);
  await expect(page.getByText(/6 \/ 6 tindakan latihan selesai/)).toBeVisible();
  await expect(page.getByRole('region', { name: 'Laporan Bab 3' })).toContainText('0 / 2');
  await page.screenshot({ path: info.outputPath('recovery-report.png') });
  await page.getByRole('heading', { name: 'Langkah latihan berikutnya' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('recommendations.png'), animations: 'disabled' });
});

test('portal comparison handles mistakes, keyboard input, reduced motion and narrow screens', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enterChapterThree(page);
  const before = await readRun(page);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openGameApp(page, 'Browser');
    const address = page.getByRole('button', { name: /^Periksa alamat portal/ });
    await expect(address).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`portal-${width}.png`) });
    expect(await readRun(page)).toEqual(before);
  }
  await inspectPortal(page);
  await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
  await page.getByRole('button', { name: 'Baca prosedur resmi', exact: true }).click();
  const domain = page.getByRole('group', { name: 'Alamat portal resmi', exact: true });
  const wrong = domain.getByRole('radio', { name: 'karier.novatech.example.verify-candidate.example', exact: true });
  await wrong.focus(); await page.keyboard.press('Space');
  const match = domain.getByRole('button', { name: 'Cocokkan alamat portal resmi' });
  await match.focus(); await page.keyboard.press('Enter');
  await expect(domain.getByRole('status')).toContainText('Belum cocok');
  const save = await readRun(page);
  expect(save.events.filter(event => event.type === 'claim.matched')).toHaveLength(0);
  await expect(page.getByRole('button', { name: 'Catat hasil perbandingan', exact: true })).toBeDisabled();
  await wrong.focus(); await page.keyboard.press('ArrowDown'); await match.focus(); await page.keyboard.press('Enter');
  await expect(domain.getByRole('button', { name: 'Klaim sudah dicocokkan' })).toBeDisabled();
  await page.getByRole('group', { name: 'Syarat rekrutmen' }).getByRole('radio', { name: /Tidak meminta OTP/ }).check();
  await page.getByRole('button', { name: 'Cocokkan syarat rekrutmen' }).click();
  await page.getByRole('button', { name: 'Catat hasil perbandingan', exact: true }).click();
  await choose(page, /Tutup portal dan simpan bukti/);
  await recovery(page);
});
