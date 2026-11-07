# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> keyboard app activation and missing launch target never trap the player
- Location: tests/smoke/onboarding.spec.ts:54:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /app=cases/
Received string:  "http://127.0.0.1:4173/play?app=browser"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="id">…</html>
       - unexpected value "http://127.0.0.1:4173/play?app=browser"

```

```yaml
- link "Lewati ke konten":
  - /url: "#os-main"
- banner:
  - link "TrustTrail, beranda":
    - /url: /
    - strong: TRUSTTRAIL
    - text: / Lacak OS
  - text: Tersimpan di browser ini
  - navigation "Navigasi utama":
    - link "Panduan":
      - /url: /guide
    - link "Catatan refleksi":
      - /url: /report
  - button "Bisukan semua suara"
  - button "Suara"
  - text: Sesi Ari
- complementary "Tutorial investigasi":
  - status:
    - paragraph: Investigasi pertamamu · 4 dari 5
    - heading "Bukti membantumu mengambil keputusan." [level=2]
    - paragraph: Buka Case Files untuk melihat temuan dan perkembangan investigasimu.
    - paragraph: Buka aplikasi melalui kontrol yang ditandai. Jika belum terlihat, buka Aplikasi.
  - button "Lewati tutorial"
- main:
  - navigation "Aplikasi desktop":
    - button "Buka Mail": Mail
    - button "Buka Browser": Browser
    - button "Buka Messages": Messages
    - button "Buka Files": Files
    - button "Buka Case Files": Case Files
  - paragraph: TRUSTTRAIL / Bab 1 · Sebuah kesempatan yang datang tiba-tiba
  - heading "Undangan tanpa lamaran" [level=1]
  - paragraph: Simulasi fiktif · Tanpa data pribadi
  - button "Kelola progres"
  - navigation "Tata letak jendela":
    - button "Mail & sumber berdampingan"
    - button "Rapikan jendela"
  - region "Mail":
    - heading "Mail" [level=2]
    - group
    - button "Minimalkan Mail"
    - button "Maksimalkan Mail"
    - button "Tutup Mail"
    - text: ari@lacak.local 2 pesan diterima
    - navigation "Kotak masuk":
      - text: KOTAK MASUK 02
      - button "NovaTech Baru Undangan tahap akhir NovaTech Internship Program Selamat! Profilmu terpilih…" [pressed]:
        - text: NovaTech Baru
        - strong: Undangan tahap akhir
        - text: NovaTech Internship Program Selamat! Profilmu terpilih…
      - button "Pusat Karier Kampus Infomasi klinik CV Hari Jumat · Alumni Halo alumni, klinik CV…":
        - text: Pusat Karier Kampus
        - strong: Infomasi klinik CV
        - text: Hari Jumat · Alumni Halo alumni, klinik CV…
      - text: Semua pesan tersimpan di perangkat ini.
    - article:
      - paragraph: PESAN MASUK / 01
      - heading "Undangan tahap akhir NovaTech Internship Program" [level=3]
      - text: Identitas belum diverifikasi
      - strong: NovaTech Recruitment
      - paragraph: "kepada: Ari sore ini"
      - button "Periksa pengirim"
      - paragraph: Halo Ari,
      - paragraph: Selamat! Profilmu terpilih untuk mengikuti tahap akhir NovaTech Internship Program. Kami menawarkan pengalaman kerja bersama tim produk dan kesempatan bergabung setelah program berakhir.
      - paragraph: Kuota sangat terbatas. Konfirmasikan kesediaanmu dalam 30 menit setelah membaca pesan ini. Jika tidak, posisi akan dialihkan kepada kandidat berikutnya.
      - button "Periksa batas waktu"
      - paragraph: Buka halaman kandidat di bawah untuk mengamankan jadwal wawancara. Tahapan selanjutnya akan disampaikan oleh tim rekrutmen.
      - text: HALAMAN KANDIDAT
      - button "Periksa tujuan tautan karier.novatech.example/undangan": karier.novatech.example/undangan
      - text: Periksa tujuan tautan · tidak membuka situs
      - paragraph:
        - text: Salam,
        - strong: Tim Rekrutmen NovaTech
    - button "Cari sumber terpisah"
    - button "Tentukan langkah"
    - text: Tidak ada data dikirim Semua alamat fiktif
    - status
  - region "Browser":
    - heading "Browser" [level=2]
    - group
    - button "Minimalkan Browser"
    - button "Maksimalkan Browser"
    - button "Tutup Browser"
    - text: novatech.example/karier SIMULASI
    - paragraph: DIREKTORI PERUSAHAAN / SUMBER TERPISAH
    - heading "Catatan karier NovaTech" [level=3]
    - paragraph: Sumber ini dibuka dari direktori perusahaan di ruang investigasi, bukan dari tautan dalam email. Seluruh catatan tetap fiktif untuk latihan.
    - text: Desktop Browser
    - strong: Direktori perusahaan
    - button "Periksa catatan lowongan"
    - paragraph: Buka detail catatan sebelum membandingkan. Membuka Browser saja belum dihitung sebagai verifikasi.
    - text: Direktori dibuka secara terpisah Tidak terhubung ke internet
    - status
  - region "Case Files":
    - heading "Case Files" [level=2]
    - group
    - button "Minimalkan Case Files"
    - button "Maksimalkan Case Files"
    - button "Tutup Case Files"
    - paragraph: CATATAN INVESTIGASI
    - heading "Jejak yang kamu temukan." [level=3]
    - text: "00"
    - paragraph: bukti diperiksa Catat, lalu pertimbangkan.
    - paragraph: Kamu bebas memilih tanpa mengumpulkan semua bukti.
    - paragraph: Belum ada bukti dicatat.
    - text: Mulai dengan memeriksa pengirim di Mail.
    - strong: Undangan belum terverifikasi
    - paragraph: Nama dan tampilan rapi belum membuktikan identitas pengirim.
    - button "Periksa sumber terpisah"
    - text: Bukti dulu. Percaya kemudian.
    - status
  - complementary "Notifikasi desktop":
    - status
- contentinfo:
  - button "LACAK"
  - navigation "Taskbar aplikasi":
    - button "Tampilkan Mail": Mail
    - button "Tampilkan Browser" [pressed]: Browser
    - button "Tampilkan Messages": Messages
    - button "Tampilkan Files": Files
    - button "Tampilkan Case Files": Case Files
  - text: Simulasi lokal SORE HARI
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { enterChapterOne, openGameApp, openMail, saveKey } from './helpers';
  3   | const tutorial = (page: import('@playwright/test').Page) => page.getByRole('complementary', { name: 'Tutorial investigasi' });
  4   | test('real tutorial journey preserves save and resumes interrupted steps', async ({ page }, info) => {
  5   |   await enterChapterOne(page);
  6   |   const before = await page.evaluate(key => localStorage.getItem(key), saveKey);
  7   |   await expect(tutorial(page)).toContainText('Selamat datang');
  8   |   await page.screenshot({ animations: 'disabled', path: `docs/phase-5d-evidence/${info.project.name}-welcome.png` });
  9   |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  10  |   await page.reload();
  11  |   await expect(tutorial(page)).toContainText('Mulai dari Mail');
  12  |   for (const [app, stage] of [['Mail', 'mail'], ['Browser', 'browser'], ['Case Files', 'cases']] as const) {
  13  |     await page.screenshot({ animations: 'disabled', path: `docs/phase-5d-evidence/${info.project.name}-${stage}.png` });
  14  |     await openGameApp(page, app);
  15  |   }
  16  |   await expect(tutorial(page)).toContainText('Peralatanmu sudah siap');
  17  |   await page.screenshot({ animations: 'disabled', path: `docs/phase-5d-evidence/${info.project.name}-ready.png` });
  18  |   await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).click();
  19  |   await expect(tutorial(page)).toHaveCount(0);
  20  |   expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(before);
  21  |   await page.reload();
  22  |   await expect(tutorial(page)).toHaveCount(0);
  23  | });
  24  | test('skip, collect evidence, replay and keyboard dismissal preserve progress', async ({ page }) => {
  25  |   await enterChapterOne(page);
  26  |   await page.getByRole('button', { name: 'Lewati tutorial', exact: true }).click();
  27  |   await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  28  |   const before = await page.evaluate(key => localStorage.getItem(key), saveKey);
  29  |   await page.goto('/guide');
  30  |   await page.getByRole('button', { name: 'Ulangi tutorial' }).click();
  31  |   await expect(tutorial(page)).toContainText('Selamat datang');
  32  |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).focus();
  33  |   await page.keyboard.press('Space');
  34  |   await openGameApp(page, 'Browser');
  35  |   await expect(tutorial(page)).toContainText('Mulai dari Mail');
  36  |   await page.keyboard.press('Escape');
  37  |   await expect(tutorial(page)).toHaveCount(0);
  38  |   await openMail(page);
  39  |   expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(before);
  40  | });
  41  | for (const width of [320, 360, 390, 768, 1440]) test(`tutorial fits ${width}px with reduced motion`, async ({ page }) => {
  42  |   await page.setViewportSize({ width, height: 900 });
  43  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  44  |   await enterChapterOne(page);
  45  |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  46  |   await openGameApp(page, 'Mail');
  47  |   await openGameApp(page, 'Browser');
  48  |   await openGameApp(page, 'Case Files');
  49  |   const box = await tutorial(page).boundingBox();
  50  |   expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
  51  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  52  |   await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).click();
  53  | });
  54  | test('keyboard app activation and missing launch target never trap the player', async ({ page }) => {
  55  |   await enterChapterOne(page);
  56  |   await expect(tutorial(page).getByRole('heading', { name: 'Selamat datang di TrustTrail OS.' })).toBeFocused();
  57  |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).focus();
  58  |   await page.keyboard.press('Enter');
  59  |   for (const name of ['Mail', 'Browser', 'Case Files'] as const) {
  60  |     const desktop = await page.locator('.trusttrail-os').getAttribute('data-os') === 'desktop';
  61  |     if (desktop) {
  62  |       await page.getByRole('button', { name: `Tampilkan ${name}`, exact: true }).focus();
  63  |     } else {
  64  |       await page.getByRole('button', { name: 'Ganti aplikasi', exact: true }).focus();
  65  |       await page.keyboard.press('Enter');
  66  |       await page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: new RegExp(`^${name}`) }).focus();
  67  |     }
  68  |     await page.keyboard.press('Enter');
  69  |     // Let the new route finish its documented heading-focus restoration before
  70  |     // focusing the next launcher; otherwise that effect can steal the next Enter.
  71  |     if (!desktop && name !== 'Case Files') {
  72  |       await expect(page.locator('.saku-app-header h1')).toHaveText(name);
  73  |       await expect(page.locator('.saku-app-header h1')).toBeFocused();
  74  |     }
  75  |   }
  76  |   // Ready can appear before the concurrent Case Files route commits. Complete
  77  |   // only after that actual app selection has settled, as a player would observe.
> 78  |   await expect(page).toHaveURL(/app=cases/);
      |                      ^ Error: expect(page).toHaveURL(expected) failed
  79  |   if (await page.locator('.trusttrail-os').getAttribute('data-os') === 'saku') {
  80  |     await expect(page.locator('.saku-app-header h1')).toHaveText('Case Files');
  81  |   }
  82  |   await expect(tutorial(page).getByRole('heading', { name: 'Peralatanmu sudah siap.' })).toBeFocused();
  83  |   await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).focus();
  84  |   await page.keyboard.press('Space');
  85  |   await expect(tutorial(page)).toHaveCount(0);
  86  |   await expect(page.locator(await page.locator('.trusttrail-os').getAttribute('data-os') === 'desktop' ? '#task-journal' : '#os-menu-trigger')).toBeFocused();
  87  |   await page.goto('/guide');
  88  |   await page.getByRole('button', { name: 'Ulangi tutorial' }).click();
  89  |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  90  |   await page.locator('[data-tutorial-target=true]').evaluateAll(elements => elements.forEach(element => element.remove()));
  91  |   await expect(tutorial(page)).toContainText('Mulai dari Mail');
  92  |   await page.getByRole('button', { name: 'Lewati tutorial' }).click();
  93  |   await expect(tutorial(page)).toHaveCount(0);
  94  | });
  95  | 
  96  | test('skip inside the modal menu restores reachable focus', async ({ page }) => {
  97  |   await enterChapterOne(page);
  98  |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  99  |   await page.locator('#os-menu-trigger').click();
  100 |   await page.getByRole('button', { name: 'Lewati tutorial' }).click();
  101 |   await expect(tutorial(page)).toHaveCount(0);
  102 |   await expect(page.getByRole('button', { name: 'Tutup Menu TrustTrail' })).toBeFocused();
  103 |   await page.keyboard.press('Escape');
  104 |   await expect(page.locator('#os-menu-trigger')).toBeFocused();
  105 | });
  106 | 
```