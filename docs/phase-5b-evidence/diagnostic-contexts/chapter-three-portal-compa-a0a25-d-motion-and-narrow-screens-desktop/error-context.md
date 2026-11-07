# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chapter-three.spec.ts >> portal comparison handles mistakes, keyboard input, reduced motion and narrow screens
- Location: tests/smoke/chapter-three.spec.ts:135:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('region', { name: 'Rekomendasi latihan' })
Expected substring: "Periksa pengirim"
Received string:    "Langkah latihan berikutnyaBab 1 · Undangan tanpa lamaranPeriksa batas waktu sebelum menentukan pilihan berikutnya.Mengapa penting: Tekanan waktu bisa membuat kita melewatkan pemeriksaan. Kamu tetap boleh berhenti dan mencari informasi dari kanal yang kamu temukan sendiri.Belum diperiksa sebelum pilihan: Batas waktu yang menekan; Tulisan tautan dan tujuan berbeda; Undangan tidak cocok dengan catatan karier. Bukti yang dibuka belakangan tidak mengubah catatan saat memilih. Verifikasi 0/2: periksa sumber terpisah, lalu bandingkan klaimnya. Ada ketidakcocokan domain dan tahapan. Tahan konfirmasi melalui email ini. Hubungi kanal karier yang kamu temukan dari sumber terpisah untuk memastikan detailnya.Bab 2 · Perekrut yang ramahPeriksa riwayat profil sebelum menentukan pilihan berikutnya.Mengapa penting: Klaim di bio dan riwayat yang tersedia belum saling mendukung. Pengetahuan tentang portofolio publik tidak membuktikan kewenangan merekrut.Belum diperiksa sebelum pilihan: Riwayat profil belum mendukung peran; Bantuan bersyarat pindah kanal; Data identitas sebelum wawancara; Penugasan dan kebutuhan data belum cocok. Bukti yang dibuka belakangan tidak mengubah catatan saat memilih. Verifikasi 0/2: periksa sumber terpisah, lalu bandingkan klaimnya. Kewenangan Mira belum didukung direktori, dan kebutuhan datanya berbeda dari pedoman penjadwalan. Tahan dokumen. Konfirmasikan penugasan ke karier@novatech.example yang ditemukan di direktori ini."
Timeout: 5000ms

Call log:
  - Expect "toContainText" getByRole('region', { name: 'Rekomendasi latihan' }) with timeout 5000ms
  - waiting for getByRole('region', { name: 'Rekomendasi latihan' })
    14 × locator resolved to <section class="tt-report-chapter" aria-label="Rekomendasi latihan">…</section>
       - unexpected value "Langkah latihan berikutnyaBab 1 · Undangan tanpa lamaranPeriksa batas waktu sebelum menentukan pilihan berikutnya.Mengapa penting: Tekanan waktu bisa membuat kita melewatkan pemeriksaan. Kamu tetap boleh berhenti dan mencari informasi dari kanal yang kamu temukan sendiri.Belum diperiksa sebelum pilihan: Batas waktu yang menekan; Tulisan tautan dan tujuan berbeda; Undangan tidak cocok dengan catatan karier. Bukti yang dibuka belakangan tidak mengubah catatan saat memilih. Verifikasi 0/2: periksa sumber terpisah, lalu bandingkan klaimnya. Ada ketidakcocokan domain dan tahapan. Tahan konfirmasi melalui email ini. Hubungi kanal karier yang kamu temukan dari sumber terpisah untuk memastikan detailnya.Bab 2 · Perekrut yang ramahPeriksa riwayat profil sebelum menentukan pilihan berikutnya.Mengapa penting: Klaim di bio dan riwayat yang tersedia belum saling mendukung. Pengetahuan tentang portofolio publik tidak membuktikan kewenangan merekrut.Belum diperiksa sebelum pilihan: Riwayat profil belum mendukung peran; Bantuan bersyarat pindah kanal; Data identitas sebelum wawancara; Penugasan dan kebutuhan data belum cocok. Bukti yang dibuka belakangan tidak mengubah catatan saat memilih. Verifikasi 0/2: periksa sumber terpisah, lalu bandingkan klaimnya. Kewenangan Mira belum didukung direktori, dan kebutuhan datanya berbeda dari pedoman penjadwalan. Tahan dokumen. Konfirmasikan penugasan ke karier@novatech.example yang ditemukan di direktori ini."

```

```yaml
- region "Rekomendasi latihan":
  - heading "Langkah latihan berikutnya" [level=2]
  - list:
    - listitem:
      - heading "Bab 1 · Undangan tanpa lamaran" [level=3]
      - paragraph: Periksa batas waktu sebelum menentukan pilihan berikutnya.
      - paragraph:
        - strong: "Mengapa penting:"
        - text: Tekanan waktu bisa membuat kita melewatkan pemeriksaan. Kamu tetap boleh berhenti dan mencari informasi dari kanal yang kamu temukan sendiri.
      - paragraph: "Belum diperiksa sebelum pilihan: Batas waktu yang menekan; Tulisan tautan dan tujuan berbeda; Undangan tidak cocok dengan catatan karier. Bukti yang dibuka belakangan tidak mengubah catatan saat memilih. Verifikasi 0/2: periksa sumber terpisah, lalu bandingkan klaimnya. Ada ketidakcocokan domain dan tahapan. Tahan konfirmasi melalui email ini. Hubungi kanal karier yang kamu temukan dari sumber terpisah untuk memastikan detailnya."
    - listitem:
      - heading "Bab 2 · Perekrut yang ramah" [level=3]
      - paragraph: Periksa riwayat profil sebelum menentukan pilihan berikutnya.
      - paragraph:
        - strong: "Mengapa penting:"
        - text: Klaim di bio dan riwayat yang tersedia belum saling mendukung. Pengetahuan tentang portofolio publik tidak membuktikan kewenangan merekrut.
      - paragraph: "Belum diperiksa sebelum pilihan: Riwayat profil belum mendukung peran; Bantuan bersyarat pindah kanal; Data identitas sebelum wawancara; Penugasan dan kebutuhan data belum cocok. Bukti yang dibuka belakangan tidak mengubah catatan saat memilih. Verifikasi 0/2: periksa sumber terpisah, lalu bandingkan klaimnya. Kewenangan Mira belum didukung direktori, dan kebutuhan datanya berbeda dari pedoman penjadwalan. Tahan dokumen. Konfirmasikan penugasan ke karier@novatech.example yang ditemukan di direktori ini."
```

# Test source

```ts
  1   | import { expect, test, type Page } from '@playwright/test';
  2   | import { commitChoice, enterChapterOne, openGameApp, readRun } from './helpers';
  3   | 
  4   | async function enterChapterThree(page: Page, exposed = false) {
  5   |   await enterChapterOne(page);
  6   |   await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  7   |   await commitChoice(page, /Abaikan undangan ini/);
  8   |   await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  9   |   await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  10  |   await page.getByRole('button', { name: /Lanjut ke Bab 2/ }).click();
  11  |   for (let i = 0; i < 2; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
  12  |   await page.getByRole('button', { name: /Buka pesan perekrut/ }).click();
  13  |   for (const name of [/Boleh jelaskan peran/, /Bisakah prosesnya/, /Apa yang dibutuhkan/]) await page.getByRole('button', { name }).click();
  14  |   await commitChoice(page, exposed ? /Ikuti Mira/ : /Tolak permintaan/);
  15  |   await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  16  |   await page.getByRole('button', { name: /Tutup berkas Bab 2/ }).click();
  17  |   const c2 = await readRun(page);
  18  |   await page.getByRole('button', { name: /Lanjut ke Bab 3/ }).click();
  19  |   for (let i = 0; i < 2; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
  20  |   await page.getByRole('button', { name: /Buka instruksi terakhir/ }).click();
  21  |   await page.getByRole('button', { name: 'Baca instruksi di Mail' }).click();
  22  |   await expect(page.getByRole('heading', { name: 'Ari, verifikasi akhir untuk intern riset pengguna' })).toBeVisible();
  23  |   await expect(page.getByRole('complementary', { name: 'Jejak keputusan sebelumnya' })).toContainText(exposed ? 'Aku sudah membagikan identitas' : 'Aku menolak permintaan data Mira');
  24  |   await page.getByRole('button', { name: 'Buka portal simulasi' }).click();
  25  |   await expect(page.getByRole('heading', { name: 'Aktivasi kandidat', exact: true })).toBeVisible();
  26  |   return c2;
  27  | }
  28  | 
  29  | async function inspectPortal(page: Page) {
  30  |   for (const name of ['Periksa alamat portal', 'Periksa indikator HTTPS', 'Periksa syarat verifikasi']) {
  31  |     await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
  32  |   }
  33  | }
  34  | async function comparePortal(page: Page, reload = false) {
  35  |   await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
  36  |   await page.getByRole('button', { name: 'Baca prosedur resmi', exact: true }).click();
  37  |   const domain = page.getByRole('group', { name: 'Alamat portal resmi', exact: true });
  38  |   await domain.getByRole('radio', { name: 'novatech.example/karier', exact: true }).check();
  39  |   await domain.getByRole('button', { name: 'Cocokkan alamat portal resmi' }).click();
  40  |   if (reload) {
  41  |     const before = await readRun(page); await page.reload(); expect(await readRun(page)).toEqual(before);
  42  |     await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
  43  |     await expect(page.getByRole('button', { name: 'Klaim sudah dicocokkan', exact: true })).toBeDisabled();
  44  |   }
  45  |   const policy = page.getByRole('group', { name: 'Syarat rekrutmen', exact: true });
  46  |   await policy.getByRole('radio', { name: /Tidak meminta OTP/ }).check();
  47  |   await policy.getByRole('button', { name: 'Cocokkan syarat rekrutmen' }).click();
  48  |   await page.getByRole('button', { name: 'Catat hasil perbandingan', exact: true }).click();
  49  | }
  50  | async function choose(page: Page, label: RegExp) {
  51  |   await page.getByRole('button', { name: /Tentukan langkah Ari/ }).click();
  52  |   await page.getByRole('radio', { name: label }).check();
  53  |   await page.getByRole('button', { name: 'Jalankan pilihan' }).click();
  54  | }
  55  | async function recovery(page: Page, account = false, identity = false) {
  56  |   await page.getByRole('button', { name: /Mulai misi pemulihan/ }).click();
  57  |   await expect(page.getByRole('region', { name: 'Misi pemulihan' })).toBeVisible();
  58  |   await page.getByRole('button', { name: 'Minta Mira memulihkan akun' }).click();
  59  |   await expect(page.getByRole('status').filter({ hasText: 'Pihak yang meminta kode' })).toBeVisible();
  60  |   await expect(page.getByLabel('Progres pemulihan')).toHaveText(`0 / ${4 + Number(account) + Number(identity)} tindakan pemulihan selesai`);
  61  |   const beforeRetry = await readRun(page);
  62  |   await page.reload();
  63  |   expect(await readRun(page)).toEqual(beforeRetry);
  64  |   await expect(page.locator('.tt-recovery-feedback')).toBeEmpty();
  65  |   await expect(page.getByText(/Pilihan yang belum tepat tidak disimpan/)).toBeVisible();
  66  |   await page.getByRole('button', { name: 'Hentikan balasan dan permintaan baru' }).click();
  67  |   const saved = await readRun(page); await page.reload(); expect(await readRun(page)).toEqual(saved);
  68  |   await expect(page.getByRole('heading', { name: 'Simpan jejak yang relevan' })).toBeVisible();
  69  |   await page.getByRole('button', { name: 'Simpan alamat, profil, pesan, dan waktu secara privat' }).click();
  70  |   await page.getByRole('button', { name: 'Gunakan karier@novatech.example dari direktori' }).click();
  71  |   if (account) await page.getByRole('button', { name: 'Pulihkan lewat aplikasi resmi dan cabut sesi asing' }).click();
  72  |   if (identity) await page.getByRole('button', { name: 'Hubungi penerbit identitas lewat kanal resmi dan pantau penyalahgunaan' }).click();
  73  |   await page.getByRole('button', { name: 'Laporkan akun dan portal melalui kanal resmi platform' }).click();
  74  |   await page.getByRole('button', { name: /Selesaikan misi pemulihan/ }).click();
  75  |   await page.getByRole('button', { name: /Tutup berkas Bab 3/ }).click();
  76  |   await expect(page.getByRole('heading', { name: 'Bab 3 selesai', exact: true })).toBeVisible();
  77  |   await page.getByRole('link', { name: /Buka Trust Report/ }).click();
  78  |   await expect(page.getByText('Trust Report · Perjalanan Ari lengkap', { exact: true })).toBeVisible();
  79  |   const advice = page.getByRole('region', { name: 'Rekomendasi latihan' });
  80  |   await expect(advice.getByRole('listitem')).toHaveCount(account ? 3 : 2);
  81  |   await expect(advice).toContainText('Mengapa penting:');
> 82  |   await expect(advice).toContainText(account ? 'aplikasi resmi layanan email' : 'Periksa pengirim');
      |                        ^ Error: expect(locator).toContainText(expected) failed
  83  |   await expect(page.getByText(/Penyelesaian tidak berarti semua jawaban tepat/)).toBeVisible();
  84  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  85  | }
  86  | 
  87  | test('finishes C1–C3 safely with meaningful comparisons, archived evidence and reloads', async ({ page }, info) => {
  88  |   const errors: string[] = [], outbound: string[] = [];
  89  |   page.on('pageerror', error => errors.push(error.message));
  90  |   page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outbound.push(request.url()); });
  91  |   const c2 = await enterChapterThree(page);
  92  |   await expect(page.getByRole('button', { name: /Tentukan langkah Ari/ })).toHaveCount(0);
  93  |   await inspectPortal(page);
  94  |   await expect(page.getByText('Tidak ada tenggat sungguhan.', { exact: false }).first()).toBeVisible();
  95  |   const found = await readRun(page);
  96  |   await page.getByRole('button', { name: /^Periksa syarat verifikasi/ }).click();
  97  |   await page.getByRole('button', { name: /^Periksa syarat verifikasi/ }).click();
  98  |   expect(await readRun(page)).toEqual(found);
  99  |   await page.screenshot({ path: info.outputPath('portal-inspection.png') });
  100 |   await comparePortal(page, true);
  101 |   const compared = await readRun(page);
  102 |   await openGameApp(page, 'Case Files');
  103 |   await expect(page.getByRole('region', { name: 'Arsip Bab 1' })).toContainText('Abaikan undangan ini');
  104 |   await openGameApp(page, 'Messages');
  105 |   await expect(page.getByRole('heading', { name: 'Percakapan Mira tersimpan' })).toBeVisible();
  106 |   expect(await readRun(page)).toEqual(compared);
  107 |   await openGameApp(page, 'Browser');
  108 |   // Tabs are presentation state and may remount on mobile; use the persistent comparison result.
  109 |   await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
  110 |   await choose(page, /Hentikan portal dan konfirmasi/);
  111 |   await recovery(page);
  112 |   const final = await readRun(page);
  113 |   expect(final.events.slice(0, c2.events.length)).toEqual(c2.events);
  114 |   expect(final.events.filter(event => event.type === 'choice.committed')).toHaveLength(3);
  115 |   expect(final.events.filter(event => event.type === 'source.compared')).toHaveLength(1);
  116 |   expect(final.events.filter(event => event.type === 'recovery.acted')).toHaveLength(4);
  117 |   await page.reload(); expect(await readRun(page)).toEqual(final);
  118 |   await expect(page.getByRole('region', { name: 'Laporan Bab 3' })).toContainText('4 / 4');
  119 |   expect(errors).toEqual([]); expect(outbound).toEqual([]);
  120 |   expect(await page.locator('input[type="password"],input[type="file"],input[type="text"],form').count()).toBe(0);
  121 | });
  122 | 
  123 | test('unsafe code and earlier identity disclosure lead to six recovery actions without a game over', async ({ page }, info) => {
  124 |   await enterChapterThree(page, true);
  125 |   await inspectPortal(page); await comparePortal(page);
  126 |   await choose(page, /Bagikan kode fiktif/);
  127 |   await expect(page.getByRole('heading', { name: 'Kode kandidat ternyata akses akun.' })).toBeVisible();
  128 |   await page.reload();
  129 |   await recovery(page, true, true);
  130 |   await expect(page.getByText(/6 \/ 6 tindakan latihan selesai/)).toBeVisible();
  131 |   await expect(page.getByRole('region', { name: 'Laporan Bab 3' })).toContainText('0 / 2');
  132 |   await page.screenshot({ path: info.outputPath('recovery-report.png') });
  133 | });
  134 | 
  135 | test('portal comparison handles mistakes, keyboard input, reduced motion and narrow screens', async ({ page }, info) => {
  136 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  137 |   await enterChapterThree(page);
  138 |   const before = await readRun(page);
  139 |   for (const width of [320, 390, 768, 1440]) {
  140 |     await page.setViewportSize({ width, height: 900 });
  141 |     await openGameApp(page, 'Browser');
  142 |     const address = page.getByRole('button', { name: /^Periksa alamat portal/ });
  143 |     await expect(address).toBeVisible();
  144 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  145 |     await page.screenshot({ path: info.outputPath(`portal-${width}.png`) });
  146 |     expect(await readRun(page)).toEqual(before);
  147 |   }
  148 |   await inspectPortal(page);
  149 |   await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
  150 |   await page.getByRole('button', { name: 'Baca prosedur resmi', exact: true }).click();
  151 |   const domain = page.getByRole('group', { name: 'Alamat portal resmi', exact: true });
  152 |   const wrong = domain.getByRole('radio', { name: 'karier.novatech.example.verify-candidate.example', exact: true });
  153 |   await wrong.focus(); await page.keyboard.press('Space');
  154 |   const match = domain.getByRole('button', { name: 'Cocokkan alamat portal resmi' });
  155 |   await match.focus(); await page.keyboard.press('Enter');
  156 |   await expect(domain.getByRole('status')).toContainText('Belum cocok');
  157 |   const save = await readRun(page);
  158 |   expect(save.events.filter(event => event.type === 'claim.matched')).toHaveLength(0);
  159 |   await expect(page.getByRole('button', { name: 'Catat hasil perbandingan', exact: true })).toBeDisabled();
  160 |   await wrong.focus(); await page.keyboard.press('ArrowDown'); await match.focus(); await page.keyboard.press('Enter');
  161 |   await expect(domain.getByRole('button', { name: 'Klaim sudah dicocokkan' })).toBeDisabled();
  162 |   await page.getByRole('group', { name: 'Syarat rekrutmen' }).getByRole('radio', { name: /Tidak meminta OTP/ }).check();
  163 |   await page.getByRole('button', { name: 'Cocokkan syarat rekrutmen' }).click();
  164 |   await page.getByRole('button', { name: 'Catat hasil perbandingan', exact: true }).click();
  165 |   await choose(page, /Tutup portal dan simpan bukti/);
  166 |   await recovery(page);
  167 | });
  168 | 
```