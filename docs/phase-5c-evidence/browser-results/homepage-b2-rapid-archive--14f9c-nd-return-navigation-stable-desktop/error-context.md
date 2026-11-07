# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage-b2.spec.ts >> rapid archive selections keep content, focus, save, geometry and return navigation stable
- Location: tests/smoke/homepage-b2.spec.ts:46:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#intel-detail')
Expected substring: "Survei IMDI 2025"
Error: Test timeout of 30000ms exceeded.

Call log:
  - Expect "toContainText" locator('#intel-detail') with timeout 5000ms
  - waiting for locator('#intel-detail')
  - Test timeout of 30000ms exceeded.

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
          - heading "Undangan kerja. Atau perangkap?" [level=1] [ref=e18]:
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
              - button "Mail" [ref=e49] [cursor=pointer]
              - button "Browser" [ref=e56] [cursor=pointer]
              - button "Case Files" [pressed] [ref=e62] [cursor=pointer]
            - generic [ref=e70]:
              - generic [ref=e71]:
                - generic [ref=e78]: Case Files
                - generic [ref=e79]: Pratinjau
              - paragraph [ref=e80]: Berkas Ari / Undangan tanpa lamaran
              - heading "Jejak yang kamu temukan." [level=2] [ref=e81]
              - generic [ref=e89]:
                - strong [ref=e90]: Belum ada bukti diperiksa.
                - paragraph [ref=e91]: Di dalam game, hanya detail yang kamu periksa yang masuk ke Case Files.
              - paragraph [ref=e92]: Baca kembali catatanmu sebelum menentukan langkah.
            - generic [ref=e93]:
              - generic [ref=e94]: Cuplikan fiktif · progres & skor terpisah
              - button "Mulai investigasi" [ref=e95] [cursor=pointer]:
                - text: Mulai investigasi
                - generic [aria-hidden] [ref=e96]: ↗
      - generic [ref=e97]:
        - generic [ref=e98]:
          - generic [ref=e99]: Peralatan investigasimu
          - button "Jeda gerak kota" [ref=e100] [cursor=pointer]: Jeda gerak kota Ⅱ
        - group "Pilih alat investigasi" [ref=e101]:
          - button "Mail Baca di antara baris. Buka" [ref=e102] [cursor=pointer]:
            - generic [ref=e109]:
              - strong [ref=e110]: Mail
              - generic [ref=e111]: Baca di antara baris.
            - generic [ref=e112]:
              - text: Buka
              - generic [aria-hidden] [ref=e113]: ↗
          - button "Browser Cari sumber pembanding. Buka" [ref=e114] [cursor=pointer]:
            - generic [ref=e120]:
              - strong [ref=e121]: Browser
              - generic [ref=e122]: Cari sumber pembanding.
            - generic [ref=e123]:
              - text: Buka
              - generic [aria-hidden] [ref=e124]: ↗
          - button "Case Files Simpan jejak yang kamu temukan. Terbuka" [pressed] [ref=e125] [cursor=pointer]:
            - generic [ref=e132]:
              - strong [ref=e133]: Case Files
              - generic [ref=e134]: Simpan jejak yang kamu temukan.
            - generic [ref=e135]:
              - text: Terbuka
              - generic [aria-hidden] [ref=e136]: ↗
    - region [ref=e137]:
      - generic [ref=e138]:
        - generic [ref=e139]:
          - heading "TrustTrail / Threat Intelligence" [level=2] [ref=e145]: TrustTrail /Threat Intelligence
          - generic [ref=e146]: Arsip sumber publikTiga berkas historis
        - generic [ref=e147]:
          - paragraph [ref=e148]: Kasusnya fiksi.Risikonya nyata.
          - paragraph [ref=e149]: Pesan yang meyakinkan bisa menjadi awal penipuan. Buka catatan dari sumber resmi Indonesia untuk memahami mengapa kebiasaan memeriksa itu penting.
        - generic [ref=e150]:
          - group "Pilih berkas intelijen" [ref=e151]:
            - button "Data File 01 IASC" [ref=e152] [cursor=pointer]:
              - generic [ref=e158]:
                - generic [ref=e159]: Data File 01
                - strong [ref=e160]: IASC
              - generic [aria-hidden] [ref=e161]: +
            - button "Data File 02 Loker fiktif" [ref=e162] [cursor=pointer]:
              - generic [ref=e168]:
                - generic [ref=e169]: Data File 02
                - strong [ref=e170]: Loker fiktif
              - generic [aria-hidden] [ref=e171]: +
            - button "Data File 03 Tanda phishing" [active] [pressed] [ref=e172] [cursor=pointer]:
              - generic [ref=e178]:
                - generic [ref=e179]: Data File 03
                - strong [ref=e180]: Tanda phishing
              - generic [aria-hidden] [ref=e181]: ↳
          - 'article "Data File 03: Tanda phishing" [ref=e182]':
            - generic [ref=e183]:
              - paragraph [ref=e184]: Data File 03 / BPSDM Komdigi
              - paragraph [ref=e185]: 36,3%
              - heading "belum mengenali tanda phishing" [level=3] [ref=e186]
              - generic [ref=e187]:
                - generic [ref=e188]:
                  - term [ref=e189]: Periode
                  - definition [ref=e190]: Survei IMDI 2025
                - generic [ref=e191]:
                  - term [ref=e192]: Sumber
                  - definition [ref=e193]: BPSDM Komdigi
              - paragraph [ref=e194]: Responden survei IMDI 2025 yang menyatakan tidak mengetahui sama sekali tanda-tanda phishing. Jawaban responden, bukan hasil tes deteksi phishing atau persentase korban.
              - paragraph [ref=e195]:
                - strong [ref=e196]: Kenapa ini penting?
                - text: Mengenali tanda perlu latihan. Mulai dengan memeriksa alamat pengirim, tujuan tautan, dan klaim melalui sumber terpisah.
              - group [ref=e197]:
                - generic "Dokumen sumber & konteks" [ref=e198] [cursor=pointer]
              - link "Baca laporan IMDI 2025 (PDF, 38 MB)" [ref=e199] [cursor=pointer]:
                - /url: https://bpsdm.komdigi.go.id/downloads/19/20251003065319-Indeks-Masyarakat-Digital-Indonesia-IMDI-2025-E-book.pdf
                - text: Baca laporan IMDI 2025 (PDF, 38 MB)
                - generic [aria-hidden] [ref=e200]: ↗
        - paragraph [ref=e201]: Cuplikan historis dengan periode dan cakupan berbeda. Ketiga angka ini tidak dijumlahkan, tidak dibandingkan sebagai populasi setara, dan bukan data waktu nyata.
        - generic [ref=e202]:
          - paragraph [ref=e203]: Ribuan laporan. Ribuan tawaran mencurigakan. Tetapi sebuah penipuan sering dimulai dari satu keputusan kecil.
          - link "Periksa sebuah pesan" [ref=e204] [cursor=pointer]:
            - /url: "#latihan"
            - text: Periksa sebuah pesan
            - generic [aria-hidden] [ref=e205]: →
    - region [ref=e206]:
      - generic [ref=e207]:
        - heading "Terlihat resmi. Coba periksa." [level=2] [ref=e208]: Terlihat resmi.Coba periksa.
        - paragraph [ref=e209]: Rasakan cara bermain lewat email fiktif ini. Temukan satu detail di balik pengirimnya, tanpa membocorkan kasus Ari.
      - generic [ref=e210]:
        - article "Email latihan fiktif" [ref=e211]:
          - generic [ref=e212]:
            - generic [ref=e219]: Mail / latihan terpisah
            - generic [aria-hidden] [ref=e220]: □
          - generic [ref=e221]:
            - paragraph [ref=e222]: Undangan diskusi portofolio
            - paragraph [ref=e223]:
              - strong [ref=e224]: Tim Karier Lentera
              - generic [ref=e225]: "kepada: peserta latihan"
            - button "Periksa alamat pengirim" [ref=e226] [cursor=pointer]
            - paragraph [ref=e233]: Halo,
            - paragraph [ref=e234]: Kami mengundangmu ke diskusi portofolio Lentera. Detail acara tersedia di kanal resmi kami.
            - paragraph [ref=e235]: Salam,Tim Karier Lentera
            - generic [ref=e236]: Simulasi fiktif. Semua alamat menggunakan .example.
        - complementary "Catatan latihan" [ref=e237]:
          - heading "Catatan pemeriksaan" [level=3] [ref=e244]
          - status [ref=e245]:
            - paragraph [ref=e246]: Apa yang ada di balik nama pengirim?
            - paragraph [ref=e247]: Buka detail alamat pada email. Satu pemeriksaan kecil bisa mengubah cara kamu membaca sebuah pesan.
          - generic [ref=e248]: Belum ada detail diperiksa. Latihan ini tidak menyimpan progres atau skor.
    - region [ref=e249]:
      - generic [ref=e250]:
        - heading "Satu jejak. Tiga bab." [level=2] [ref=e251]: Satu jejak.Tiga bab.
        - paragraph [ref=e252]: Ikuti perjalanan rekrutmen Ari. Setiap pesan membawa pertanyaan baru tentang siapa yang layak dipercaya.
      - list [ref=e253]:
        - listitem [ref=e254]:
          - generic [ref=e255]:
            - paragraph [ref=e256]: Bab 1 · Tersedia
            - heading "Undangan tanpa lamaran" [level=3] [ref=e257]
          - paragraph [ref=e258]: Sebuah tawaran tiba di kotak masuk. Periksa undangannya sebelum menentukan langkah Ari.
          - 'link "Buka Bab 1: Undangan tanpa lamaran" [ref=e259] [cursor=pointer]':
            - /url: /play
            - text: Buka berkas
            - generic [aria-hidden] [ref=e260]: ↗
        - listitem [ref=e261]:
          - generic [ref=e262]:
            - paragraph [ref=e263]: Bab 2 · Tersedia
            - heading "Perekrut yang ramah" [level=3] [ref=e264]
          - paragraph [ref=e265]: Percakapan menjadi semakin personal. Seberapa jauh sebuah perkenalan bisa dipercaya?
          - 'link "Lanjut perjalanan menuju Bab 2: Perekrut yang ramah" [ref=e266] [cursor=pointer]':
            - /url: /play
            - text: Lanjut perjalanan
            - generic [aria-hidden] [ref=e267]: ↗
        - listitem [ref=e268]:
          - generic [ref=e269]:
            - paragraph [ref=e270]: Bab 3 · Portal kandidat
            - heading "Verifikasi terakhir" [level=3] [ref=e271]
          - paragraph [ref=e272]: Perjalanan mendekati akhir. Sebuah portal membuka pertanyaan baru tentang batas kepercayaan.
          - generic [ref=e273]: Siap dimainkan
    - region [ref=e274]:
      - generic [ref=e275]:
        - generic [ref=e276]:
          - paragraph [ref=e279]: Ruang latihan yang aman
          - heading "Bukti dulu. Percaya kemudian." [level=2] [ref=e280]: Bukti dulu.Percaya kemudian.
        - generic [ref=e281]:
          - paragraph [ref=e282]: Semua tokoh, perusahaan, pesan, dan alamat dalam game adalah fiktif. TrustTrail tidak meminta kata sandi asli, OTP, atau dokumen identitas.
          - paragraph [ref=e283]: Tanpa akun. Progres permainan disimpan di browser ini. Kamu bisa mengelolanya dari menu di dalam game.
          - button "Mulai investigasi" [ref=e285] [cursor=pointer]:
            - text: Mulai investigasi
            - generic [aria-hidden] [ref=e286]: ↗
          - link "Cara bermain & privasi" [ref=e287] [cursor=pointer]:
            - /url: /guide
  - contentinfo [ref=e288]:
    - link "TrustTrail" [ref=e289] [cursor=pointer]:
      - /url: /
    - paragraph [ref=e292]: Game investigasi digital · MIT-WEEK 2026
    - link "Kembali ke awal" [ref=e293] [cursor=pointer]:
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
> 63 |   await expect(page.locator('#intel-detail')).toContainText('Survei IMDI 2025');
     |                                               ^ Error: expect(locator).toContainText(expected) failed
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
  90 |     await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  91 |     await expect(page.locator('.living-city canvas')).toHaveCount(0);
  92 |   }
  93 |   // Runtime caches may warm, but old homepage trees/listeners must be released.
  94 |   await expect.poll(async () => (await readMetrics()).Nodes!).toBeLessThanOrEqual(baseline.Nodes! + 12);
  95 |   await expect.poll(async () => (await readMetrics()).JSEventListeners!).toBeLessThanOrEqual(baseline.JSEventListeners!);
  96 | });
  97 | 
```