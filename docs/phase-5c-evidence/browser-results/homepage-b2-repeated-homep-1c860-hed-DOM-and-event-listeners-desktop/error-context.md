# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage-b2.spec.ts >> repeated homepage visits release detached DOM and event listeners
- Location: tests/smoke/homepage-b2.spec.ts:75:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Panduan & privasi' })
    - locator resolved to <a href="/guide" class="portal-guide" data-discover="true">Panduan & privasi</a>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Lewati ke konten" [ref=e4] [cursor=pointer]:
    - /url: "#portal-main"
  - banner [ref=e5]:
    - link "TrustTrail, beranda" [ref=e6] [cursor=pointer]:
      - /url: /
      - text: TrustTrail
    - navigation "Navigasi beranda" [ref=e9]:
      - link "Intelijen" [ref=e10] [cursor=pointer]:
        - /url: "#intel"
      - link "Coba periksa" [ref=e11] [cursor=pointer]:
        - /url: "#latihan"
      - link "Berkas kasus" [ref=e12] [cursor=pointer]:
        - /url: "#berkas"
    - link "Panduan & privasi" [ref=e13] [cursor=pointer]:
      - /url: /guide
  - main [ref=e14]:
    - generic [ref=e15]:
      - region [ref=e16]:
        - generic [ref=e17]:
          - heading "Undangan kerja. Atau perangkap?" [active] [level=1] [ref=e18]:
            - generic [ref=e19]: Undangan kerja.
            - generic [ref=e21]: Atau perangkap?
          - paragraph [ref=e23]:
            - strong [ref=e24]: Game investigasi keamanan digital.
            - text: Ari mendapat undangan rekrutmen yang tak ia ingat pernah lamar. Bantu ia memeriksa jejaknya sebelum percaya.
          - button "Mulai investigasi" [ref=e26] [cursor=pointer]:
            - text: Mulai investigasi
            - generic [aria-hidden] [ref=e27]: ↗
          - paragraph [ref=e28]: Main langsung di browser. Tanpa akun.Tiga bab dan misi pemulihan siap dimainkan · Progres tersimpan lokal.
          - link "Coba satu pemeriksaan dulu" [ref=e29] [cursor=pointer]:
            - /url: "#latihan"
        - generic [ref=e30]:
          - generic [ref=e31]:
            - generic [ref=e38]:
              - strong [ref=e39]: Pesan masuk untuk Ari
              - generic [ref=e40]: NovaTech Recruitment · cuplikan cerita fiktif
            - generic [aria-hidden] [ref=e41]: ↙
          - region "Pratinjau interaktif TrustTrail OS" [ref=e42]:
            - generic [ref=e43]:
              - generic [ref=e46]: TrustTrail OS
              - generic [ref=e47]: CASE 01
            - group "Aplikasi pratinjau" [ref=e48]:
              - button "Mail" [pressed] [ref=e49] [cursor=pointer]
              - button "Browser" [ref=e56] [cursor=pointer]
              - button "Case Files" [ref=e62] [cursor=pointer]
            - generic [ref=e70]:
              - generic [ref=e71]:
                - generic [ref=e78]: Mail
                - generic [ref=e79]: Pratinjau
              - paragraph [ref=e80]: Kotak masuk Ari / NovaTech Recruitment
              - heading "Undangan tahap akhir" [level=2] [ref=e81]
              - paragraph [ref=e82]: NovaTech Internship Program
              - generic [ref=e83]:
                - paragraph [ref=e84]: Halo Ari,
                - paragraph [ref=e85]: Selamat! Profilmu terpilih untuk mengikuti tahap akhir NovaTech Internship Program. Kami menawarkan pengalaman kerja bersama tim produk dan kesempatan bergabung setelah program berakhir.
              - paragraph [ref=e86]: “Tapi… aku bahkan nggak ingat kapan daftar ke sini.” — Ari
            - generic [ref=e87]:
              - generic [ref=e88]: Cuplikan fiktif · progres & skor terpisah
              - button "Mulai investigasi" [ref=e89] [cursor=pointer]:
                - text: Mulai investigasi
                - generic [aria-hidden] [ref=e90]: ↗
      - generic [ref=e91]:
        - generic [ref=e92]:
          - generic [ref=e93]: Peralatan investigasimu
          - button "Jeda gerak kota" [ref=e94] [cursor=pointer]: Jeda gerak kota Ⅱ
        - group "Pilih alat investigasi" [ref=e95]:
          - button "Mail Baca di antara baris. Terbuka" [pressed] [ref=e96] [cursor=pointer]:
            - generic [ref=e103]:
              - strong [ref=e104]: Mail
              - generic [ref=e105]: Baca di antara baris.
            - generic [ref=e106]:
              - text: Terbuka
              - generic [aria-hidden] [ref=e107]: ↗
          - button "Browser Cari sumber pembanding. Buka" [ref=e108] [cursor=pointer]:
            - generic [ref=e114]:
              - strong [ref=e115]: Browser
              - generic [ref=e116]: Cari sumber pembanding.
            - generic [ref=e117]:
              - text: Buka
              - generic [aria-hidden] [ref=e118]: ↗
          - button "Case Files Simpan jejak yang kamu temukan. Buka" [ref=e119] [cursor=pointer]:
            - generic [ref=e126]:
              - strong [ref=e127]: Case Files
              - generic [ref=e128]: Simpan jejak yang kamu temukan.
            - generic [ref=e129]:
              - text: Buka
              - generic [aria-hidden] [ref=e130]: ↗
    - region [ref=e131]:
      - generic [ref=e132]:
        - generic [ref=e133]:
          - heading "TrustTrail / Threat Intelligence" [level=2] [ref=e139]: TrustTrail /Threat Intelligence
          - generic [ref=e140]: Arsip sumber publikTiga berkas historis
        - generic [ref=e141]:
          - paragraph [ref=e142]: Kasusnya fiksi.Risikonya nyata.
          - paragraph [ref=e143]: Pesan yang meyakinkan bisa menjadi awal penipuan. Buka catatan dari sumber resmi Indonesia untuk memahami mengapa kebiasaan memeriksa itu penting.
        - generic [ref=e144]:
          - group "Pilih berkas intelijen" [ref=e145]:
            - button "Data File 01 IASC" [pressed] [ref=e146] [cursor=pointer]:
              - generic [ref=e152]:
                - generic [ref=e153]: Data File 01
                - strong [ref=e154]: IASC
              - generic [aria-hidden] [ref=e155]: ↳
            - button "Data File 02 Loker fiktif" [ref=e156] [cursor=pointer]:
              - generic [ref=e162]:
                - generic [ref=e163]: Data File 02
                - strong [ref=e164]: Loker fiktif
              - generic [aria-hidden] [ref=e165]: +
            - button "Data File 03 Tanda phishing" [ref=e166] [cursor=pointer]:
              - generic [ref=e172]:
                - generic [ref=e173]: Data File 03
                - strong [ref=e174]: Tanda phishing
              - generic [aria-hidden] [ref=e175]: +
          - 'article "Data File 01: IASC" [ref=e176]':
            - generic [ref=e177]:
              - paragraph [ref=e178]: Data File 01 / OJK / Satgas PASTI
              - paragraph [ref=e179]: "74.243"
              - heading "laporan diterima IASC" [level=3] [ref=e180]
              - generic [ref=e181]:
                - generic [ref=e182]:
                  - term [ref=e183]: Periode
                  - definition [ref=e184]: 22 November 2024–23 Maret 2025
                - generic [ref=e185]:
                  - term [ref=e186]: Sumber
                  - definition [ref=e187]: OJK / Satgas PASTI
              - paragraph [ref=e188]: Laporan penipuan transaksi keuangan yang diterima Indonesia Anti-Scam Centre sejak awal beroperasi hingga 23 Maret 2025. Jumlah laporan, bukan korban unik atau seluruh penipuan di Indonesia.
              - paragraph [ref=e189]:
                - strong [ref=e190]: Kenapa ini penting?
                - text: Sebuah permintaan transaksi layak diperiksa sebelum ditindaklanjuti. Luangkan waktu untuk mengecek identitas dan kanal yang digunakan.
              - group [ref=e191]:
                - generic "Dokumen sumber & konteks" [ref=e192] [cursor=pointer]
              - link "Baca siaran pers OJK" [ref=e193] [cursor=pointer]:
                - /url: https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Waspada-Penipuan-Website-Mengatasnamakan-Indonesia-Anti-Scam-Centre-IASC.aspx
                - text: Baca siaran pers OJK
                - generic [aria-hidden] [ref=e194]: ↗
        - paragraph [ref=e195]: Cuplikan historis dengan periode dan cakupan berbeda. Ketiga angka ini tidak dijumlahkan, tidak dibandingkan sebagai populasi setara, dan bukan data waktu nyata.
        - generic [ref=e196]:
          - paragraph [ref=e197]: Ribuan laporan. Ribuan tawaran mencurigakan. Tetapi sebuah penipuan sering dimulai dari satu keputusan kecil.
          - link "Periksa sebuah pesan" [ref=e198] [cursor=pointer]:
            - /url: "#latihan"
            - text: Periksa sebuah pesan
            - generic [aria-hidden] [ref=e199]: →
    - region [ref=e200]:
      - generic [ref=e201]:
        - heading "Terlihat resmi. Coba periksa." [level=2] [ref=e202]: Terlihat resmi.Coba periksa.
        - paragraph [ref=e203]: Rasakan cara bermain lewat email fiktif ini. Temukan satu detail di balik pengirimnya, tanpa membocorkan kasus Ari.
      - generic [ref=e204]:
        - article "Email latihan fiktif" [ref=e205]:
          - generic [ref=e206]:
            - generic [ref=e213]: Mail / latihan terpisah
            - generic [aria-hidden] [ref=e214]: □
          - generic [ref=e215]:
            - paragraph [ref=e216]: Undangan diskusi portofolio
            - paragraph [ref=e217]:
              - strong [ref=e218]: Tim Karier Lentera
              - generic [ref=e219]: "kepada: peserta latihan"
            - button "Periksa alamat pengirim" [ref=e220] [cursor=pointer]
            - paragraph [ref=e227]: Halo,
            - paragraph [ref=e228]: Kami mengundangmu ke diskusi portofolio Lentera. Detail acara tersedia di kanal resmi kami.
            - paragraph [ref=e229]: Salam,Tim Karier Lentera
            - generic [ref=e230]: Simulasi fiktif. Semua alamat menggunakan .example.
        - complementary "Catatan latihan" [ref=e231]:
          - heading "Catatan pemeriksaan" [level=3] [ref=e238]
          - status [ref=e239]:
            - paragraph [ref=e240]: Apa yang ada di balik nama pengirim?
            - paragraph [ref=e241]: Buka detail alamat pada email. Satu pemeriksaan kecil bisa mengubah cara kamu membaca sebuah pesan.
          - generic [ref=e242]: Belum ada detail diperiksa. Latihan ini tidak menyimpan progres atau skor.
    - region [ref=e243]:
      - generic [ref=e244]:
        - heading "Satu jejak. Tiga bab." [level=2] [ref=e245]: Satu jejak.Tiga bab.
        - paragraph [ref=e246]: Ikuti perjalanan rekrutmen Ari. Setiap pesan membawa pertanyaan baru tentang siapa yang layak dipercaya.
      - list [ref=e247]:
        - listitem [ref=e248]:
          - generic [ref=e249]:
            - paragraph [ref=e250]: Bab 1 · Tersedia
            - heading "Undangan tanpa lamaran" [level=3] [ref=e251]
          - paragraph [ref=e252]: Sebuah tawaran tiba di kotak masuk. Periksa undangannya sebelum menentukan langkah Ari.
          - 'link "Buka Bab 1: Undangan tanpa lamaran" [ref=e253] [cursor=pointer]':
            - /url: /play
            - text: Buka berkas
            - generic [aria-hidden] [ref=e254]: ↗
        - listitem [ref=e255]:
          - generic [ref=e256]:
            - paragraph [ref=e257]: Bab 2 · Tersedia
            - heading "Perekrut yang ramah" [level=3] [ref=e258]
          - paragraph [ref=e259]: Percakapan menjadi semakin personal. Seberapa jauh sebuah perkenalan bisa dipercaya?
          - 'link "Lanjut perjalanan menuju Bab 2: Perekrut yang ramah" [ref=e260] [cursor=pointer]':
            - /url: /play
            - text: Lanjut perjalanan
            - generic [aria-hidden] [ref=e261]: ↗
        - listitem [ref=e262]:
          - generic [ref=e263]:
            - paragraph [ref=e264]: Bab 3 · Portal kandidat
            - heading "Verifikasi terakhir" [level=3] [ref=e265]
          - paragraph [ref=e266]: Perjalanan mendekati akhir. Sebuah portal membuka pertanyaan baru tentang batas kepercayaan.
          - generic [ref=e267]: Siap dimainkan
    - region [ref=e268]:
      - generic [ref=e269]:
        - generic [ref=e270]:
          - paragraph [ref=e273]: Ruang latihan yang aman
          - heading "Bukti dulu. Percaya kemudian." [level=2] [ref=e274]: Bukti dulu.Percaya kemudian.
        - generic [ref=e275]:
          - paragraph [ref=e276]: Semua tokoh, perusahaan, pesan, dan alamat dalam game adalah fiktif. TrustTrail tidak meminta kata sandi asli, OTP, atau dokumen identitas.
          - paragraph [ref=e277]: Tanpa akun. Progres permainan disimpan di browser ini. Kamu bisa mengelolanya dari menu di dalam game.
          - button "Mulai investigasi" [ref=e279] [cursor=pointer]:
            - text: Mulai investigasi
            - generic [aria-hidden] [ref=e280]: ↗
          - link "Cara bermain & privasi" [ref=e281] [cursor=pointer]:
            - /url: /guide
  - contentinfo [ref=e282]:
    - link "TrustTrail" [ref=e283] [cursor=pointer]:
      - /url: /
    - paragraph [ref=e286]: Game investigasi digital · MIT-WEEK 2026
    - link "Kembali ke awal" [ref=e287] [cursor=pointer]:
      - /url: "#portal-title"
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | test('native scroll choreography reverses and reduced motion settles every presentation layer', async ({ page }, info) => {
  4  |   await page.goto('/');
  5  |   await page.evaluate(() => document.fonts.ready);
  6  |   const city = page.locator('.living-city');
  7  |   await expect(city).toHaveAttribute('data-city-status', 'ready');
  8  |   const showcaseY = () => page.locator('.portal-showcase').evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);
  9  |   await page.evaluate(() => scrollTo(0, 0));
  10 |   await expect.poll(showcaseY).toBe(0);
  11 |   await page.evaluate(() => scrollTo(0, 320));
  12 |   if (info.project.name === 'desktop') await expect.poll(showcaseY).toBeLessThan(-1);
  13 |   else await expect.poll(showcaseY).toBe(0);
  14 |   await page.evaluate(() => scrollTo(0, 0));
  15 |   await expect.poll(showcaseY).toBe(0);
  16 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  17 |   await expect(city.locator('canvas')).toHaveCount(0);
  18 |   await page.evaluate(() => scrollTo(0, 350));
  19 |   await expect.poll(showcaseY).toBe(0);
  20 |   const states = await page.locator('[data-investigation-motion]').evaluateAll(els => els.map(el => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform })));
  21 |   expect(states.every(state => state.opacity === '1' && state.transform === 'none')).toBe(true);
  22 |   await page.locator('.portal-start .button').first().focus();
  23 |   await page.keyboard.press('Enter');
  24 |   await expect(page).toHaveURL(/\/play/);
  25 | });
  26 | 
  27 | test('rapid OS selections keep final content, focus, save and geometry stable', async ({ page }) => {
  28 |   await page.goto('/');
  29 |   await page.evaluate(() => document.fonts.ready);
  30 |   const stored = await page.evaluate(() => JSON.stringify(localStorage));
  31 |   const tabs = page.getByRole('group', { name: 'Aplikasi pratinjau' });
  32 |   const previewHeight = (await page.locator('.portal-game-preview').boundingBox())!.height;
  33 |   for (const name of ['Browser', 'Case Files', 'Browser', 'Mail', 'Case Files']) {
  34 |     const tab = tabs.getByRole('button', { name, exact: true });
  35 |     await tab.focus();
  36 |     await page.keyboard.press('Space');
  37 |     await expect(tab).toBeFocused();
  38 |     await expect(tab).toHaveAttribute('aria-pressed', 'true');
  39 |   }
  40 |   await expect(page.locator('#os-preview-content')).toContainText('Jejak yang kamu temukan.');
  41 |   await expect(tabs.locator('[aria-pressed=true]')).toHaveCount(1);
  42 |   expect((await page.locator('.portal-game-preview').boundingBox())!.height).toBeCloseTo(previewHeight, 1);
  43 |   expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(stored);
  44 | });
  45 | 
  46 | test('rapid archive selections keep content, focus, save, geometry and return navigation stable', async ({ page }) => {
  47 |   await page.goto('/');
  48 |   await page.evaluate(() => document.fonts.ready);
  49 |   const stored = await page.evaluate(() => JSON.stringify(localStorage));
  50 |   // Recreate the preceding preview state while keeping archive failures independent.
  51 |   const cases = page.getByRole('group', { name: 'Aplikasi pratinjau' }).getByRole('button', { name: 'Case Files', exact: true });
  52 |   await cases.focus();
  53 |   await page.keyboard.press('Space');
  54 |   await expect(cases).toHaveAttribute('aria-pressed', 'true');
  55 |   const files = page.locator('.portal-intel-files button');
  56 |   const terminalHeight = (await page.locator('.portal-intelligence').boundingBox())!.height;
  57 |   for (const index of [1, 2, 0, 2]) {
  58 |     await files.nth(index).focus();
  59 |     await page.keyboard.press('Enter');
  60 |     await expect(files.nth(index)).toBeFocused();
  61 |   }
  62 |   await expect(page.locator('.portal-stat-number')).toHaveText('36,3%');
  63 |   await expect(page.locator('#intel-detail')).toContainText('Survei IMDI 2025');
  64 |   expect((await page.locator('.portal-intelligence').boundingBox())!.height).toBeCloseTo(terminalHeight, 1);
  65 |   expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(stored);
  66 |   // Continue the keyboard journey without racing End scrolling against click auto-scroll.
  67 |   const returnToTop = page.getByRole('link', { name: 'Kembali ke awal' });
  68 |   await returnToTop.focus();
  69 |   await expect(returnToTop).toBeFocused();
  70 |   await page.keyboard.press('Enter');
  71 |   await expect(page).toHaveURL(/#portal-title$/);
  72 |   await expect(page.locator('#portal-title')).toBeInViewport();
  73 | });
  74 | 
  75 | test('repeated homepage visits release detached DOM and event listeners', async ({ page }) => {
  76 |   const cdp = await page.context().newCDPSession(page);
  77 |   await cdp.send('Performance.enable');
  78 |   async function readMetrics() {
  79 |     await cdp.send('HeapProfiler.collectGarbage');
  80 |     const { metrics } = await cdp.send('Performance.getMetrics');
  81 |     return Object.fromEntries(metrics.filter(metric => ['Nodes', 'JSEventListeners'].includes(metric.name)).map(metric => [metric.name, metric.value]));
  82 |   }
  83 |   await page.goto('/');
  84 |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  85 |   await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  86 |   const baseline = await readMetrics();
  87 |   for (let cycle = 0; cycle < 6; cycle++) {
  88 |     await page.goBack();
  89 |     await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
> 90 |     await page.getByRole('link', { name: 'Panduan & privasi' }).click();
     |                                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  91 |     await expect(page.locator('.living-city canvas')).toHaveCount(0);
  92 |   }
  93 |   // Runtime caches may warm, but old homepage trees/listeners must be released.
  94 |   await expect.poll(async () => (await readMetrics()).Nodes!).toBeLessThanOrEqual(baseline.Nodes! + 12);
  95 |   await expect.poll(async () => (await readMetrics()).JSEventListeners!).toBeLessThanOrEqual(baseline.JSEventListeners!);
  96 | });
  97 | 
```