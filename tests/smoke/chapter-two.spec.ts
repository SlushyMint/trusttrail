import { expect, test, type Locator, type Page } from '@playwright/test';
import { commitChoice, enterChapterOne, openGameApp, readRun, saveKey } from './helpers';

async function enterChapterTwo(page: Page) {
  await enterChapterOne(page);
  await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  await commitChoice(page, /Abaikan undangan ini/);
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  const chapterOne = await readRun(page);
  await page.getByRole('button', { name: /Lanjut ke Bab 2/ }).click();
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
  await page.getByRole('button', { name: /Buka pesan perekrut/ }).click();
  await expect(page.getByRole('heading', { name: 'Mira Pranesti', exact: true })).toBeVisible();
  return chapterOne;
}
async function conversation(page: Page) {
  await page.getByRole('button', { name: /Boleh jelaskan peran dan prosesnya/ }).click();
  await page.getByRole('button', { name: /Bisakah prosesnya lewat kanal perusahaan/ }).click();
  await page.getByRole('button', { name: /Apa yang dibutuhkan untuk penjadwalan/ }).click();
}
async function finish(page: Page) {
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await page.getByRole('button', { name: /Tutup berkas Bab 2/ }).click();
  await expect(page.getByRole('heading', { name: 'Bab 2 selesai', exact: true })).toBeVisible();
  await expect(page.getByText(/Berikutnya: Bab 3/)).toBeVisible();
}

test('investigates the recruiter across apps and preserves Chapter 1 records through completion', async ({ page }, info) => {
  const errors: string[] = [], outbound: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outbound.push(request.url()); });
  const c1 = await enterChapterTwo(page);
  await expect(page.getByRole('button', { name: /Periksa permintaan data/ })).toHaveCount(0);
  const before = await readRun(page);
  const profileButton = page.getByRole('button', { name: 'Lihat profil', exact: true });
  if (info.project.name === 'mobile') await profileButton.tap(); else await profileButton.click();
  expect(await readRun(page)).toEqual(before);
  await page.getByRole('button', { name: /Periksa riwayat profil/ }).click();
  await expect(page.getByRole('region', { name: 'Profil Mira' }).getByText(/Akun baru atau pekerjaan sebelumnya/)).toBeVisible();
  await page.getByRole('button', { name: /Periksa riwayat profil/ }).click();
  await page.getByRole('button', { name: 'Tutup profil', exact: true }).click();
  await conversation(page);
  await page.getByRole('button', { name: /Periksa perpindahan kanal/ }).click();
  await page.getByRole('button', { name: /Periksa permintaan data/ }).click();
  await page.screenshot({ path: info.outputPath('recruiter-conversation.png') });
  const investigated = await readRun(page);
  await openGameApp(page, 'Browser');
  expect(await readRun(page)).toEqual(investigated);
  await expect(page.getByRole('button', { name: 'Bandingkan dengan percakapan' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Periksa direktori perekrut' }).click();
  await page.getByRole('button', { name: 'Bandingkan dengan percakapan' }).click();
  await openGameApp(page, 'Messages');
  await commitChoice(page, /Tahan data dan verifikasi penugasan/);
  await expect(page.getByRole('heading', { name: 'Keramahan mendapat pembanding.' })).toBeVisible();
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await expect(page.getByText('4 / 4', { exact: true })).toBeVisible();
  await expect(page.getByText('2 / 2', { exact: true })).toHaveCount(2);
  await page.getByRole('button', { name: /Tutup berkas Bab 2/ }).click();
  await expect(page.getByRole('heading', { name: 'Bab 2 selesai', exact: true })).toBeVisible();
  const complete = await readRun(page);
  expect(complete.events.slice(0, c1.events.length)).toEqual(c1.events);
  expect(complete.events.filter(event => event.type === 'choice.committed')).toHaveLength(2);
  expect(complete.events.filter(event => event.evidenceId === 'C2-E01')).toHaveLength(1);
  await page.reload();
  expect(await readRun(page)).toEqual(complete);
  await openGameApp(page, 'Case Files');
  const journal = page.getByRole('region', { name: 'Case Files' });
  await expect(journal.getByRole('heading', { name: 'Penugasan dan kebutuhan data belum cocok' })).toBeVisible();
  const archive = journal.getByRole('region', { name: 'Arsip Bab 1' });
  await expect(archive.getByText(/Pilihan tercatat: Abaikan undangan/)).toBeVisible();
  await archive.getByText(/C1-E01 · Alamat di balik nama/).click();
  await expect(archive.getByText(/Nama tampilannya/)).toBeVisible();
  expect(errors).toEqual([]);
  expect(outbound).toEqual([]);
});

for (const branch of [
  { option: /Ikuti Mira dan bagikan berkas simulasi/, title: 'Bantuan berubah menjadi paparan.', safety: '0 / 2', bridge: /Dokumen fiktif Ari sudah dibagikan/ },
  { option: /Tolak permintaan dan akhiri percakapan/, title: 'Batas yang tetap terjaga.', safety: '2 / 2', bridge: /Ari tetap memegang dokumennya/ },
]) test(`branch: ${branch.title} remains playable without collecting evidence`, async ({ page }) => {
  await enterChapterTwo(page);
  await conversation(page);
  await commitChoice(page, branch.option);
  await expect(page.getByRole('heading', { name: branch.title, exact: true })).toBeVisible();
  await expect(page.locator('input, form, iframe')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: branch.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await expect(page.getByText('0 / 4', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Catatan tindakan Bab 2').getByText(branch.safety, { exact: true }).last()).toBeVisible();
  await page.getByRole('button', { name: /Tutup berkas Bab 2/ }).click();
  await expect(page.getByText(branch.bridge)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bab 2 selesai', exact: true })).toBeVisible();
});

test('resumes conversation and partial verification without duplicate credit or retroactive awareness', async ({ page }) => {
  await enterChapterTwo(page);
  await page.getByRole('button', { name: /Boleh jelaskan peran dan prosesnya/ }).click();
  const replied = await readRun(page);
  await page.reload();
  expect(await readRun(page)).toEqual(replied);
  await expect(page.getByRole('button', { name: /Boleh jelaskan peran dan prosesnya/ })).toHaveCount(0);
  await page.getByRole('button', { name: /Bisakah prosesnya lewat kanal perusahaan/ }).click();
  await page.getByRole('button', { name: /Apa yang dibutuhkan untuk penjadwalan/ }).click();
  await commitChoice(page, /Tahan data dan verifikasi penugasan/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Periksa sebelum menyimpulkan.' })).toBeVisible();
  await page.getByRole('button', { name: 'Periksa direktori perekrut' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Bandingkan dengan percakapan' }).click();
  await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  await expect(page.getByText('0 / 4', { exact: true })).toBeVisible();
  await expect(page.getByText('2 / 2', { exact: true })).toHaveCount(2);
  await openGameApp(page, 'Case Files');
  await expect(page.getByText('C2-E04 · Setelah pilihan', { exact: true })).toBeVisible();
  expect((await readRun(page)).events.filter(event => event.type === 'choice.committed')).toHaveLength(2);
});

test('reflows profile, chat and source at 320, 390, 768 and 1440 without losing conversation', async ({ page }, info) => {
  await enterChapterTwo(page);
  await conversation(page);
  const previous = await readRun(page);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openGameApp(page, 'Messages');
    const profile = page.getByRole('button', { name: 'Lihat profil', exact: true });
    if (await profile.isVisible()) await profile.click();
    await expect(page.getByRole('heading', { name: 'Profil perekrut' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`profile-${width}.png`) });
    await openGameApp(page, 'Browser');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await readRun(page)).toEqual(previous);
  }
});

test('Chapter 2 conversation and decision are operable by keyboard', async ({ page }) => {
  await enterChapterTwo(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  async function tabTo(target: Locator) {
    for (let attempt = 0; attempt < 90; attempt++) {
      if (await target.evaluate(element => element === document.activeElement)) return;
      await page.keyboard.press('Tab');
    }
    throw new Error('Chapter 2 control unreachable by keyboard');
  }
  async function activate(name: string | RegExp) { await tabTo(page.getByRole('button', { name })); await page.keyboard.press('Enter'); }
  await activate('Lihat profil');
  await activate(/Periksa riwayat profil/);
  await activate('Tutup profil');
  await activate(/Boleh jelaskan peran dan prosesnya/);
  await activate(/Bisakah prosesnya lewat kanal perusahaan/);
  await activate(/Apa yang dibutuhkan untuk penjadwalan/);
  await activate(/Tentukan langkah/);
  await tabTo(page.getByRole('radio', { name: /Ikuti Mira/ }));
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: /Tolak permintaan/ })).toBeChecked();
  await activate('Jalankan pilihan');
  await activate(/Lihat refleksi/);
  await activate(/Tutup berkas Bab 2/);
  await expect(page.getByRole('heading', { name: 'Bab 2 selesai', exact: true })).toBeVisible();
});

test('restarts Chapter 2 without retaining old conversation or journal state', async ({ page }) => {
  await enterChapterTwo(page);
  await conversation(page);
  await commitChoice(page, /Tolak permintaan/);
  await finish(page);
  await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
  await page.getByRole('button', { name: 'Ya, mulai ulang' }).click();
  await expect(page.getByRole('button', { name: /Buka berkas pertama/ })).toBeVisible();
  const run = await readRun(page);
  expect(run.events).toEqual([{ type: 'run.started' }]);
  await openGameApp(page, 'Messages');
  await expect(page.getByRole('heading', { name: 'Belum ada percakapan.' })).toBeVisible();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).events.length, saveKey)).toBe(1);
});
