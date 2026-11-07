# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: living-city.spec.ts >> repeated client navigation owns one canvas and handles lost rendering
- Location: tests/smoke/living-city.spec.ts:22:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Panduan & privasi' })

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
  1   | import { expect, test } from '@playwright/test';
  2   | 
  3   | test('city canvas remains behind HTML and pauses outside the hero', async ({ page }) => {
  4   |   await page.goto('/');
  5   |   const city = page.locator('.living-city');
  6   |   await expect(city).toHaveAttribute('data-city-status', 'ready');
  7   |   await expect(city.locator('canvas')).toHaveCount(1);
  8   |   await expect(city).toHaveAttribute('aria-hidden', 'true');
  9   |   expect(await city.evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none');
  10  |   await expect(city).toHaveAttribute('data-city-rendering', 'running');
  11  |   await page.getByRole('link', { name: 'Coba periksa', exact: true }).click();
  12  |   await expect(city).toHaveAttribute('data-city-rendering', 'paused');
  13  |   await page.getByRole('button', { name: 'Periksa alamat pengirim', exact: true }).click();
  14  |   await expect(page.locator('#practice-sender')).toBeVisible();
  15  |   await page.evaluate(() => scrollTo(0, 0));
  16  |   await expect(city).toHaveAttribute('data-city-rendering', 'running');
  17  |   await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  18  |   await expect(page).toHaveURL(/\/play/);
  19  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  20  | });
  21  | 
  22  | test('repeated client navigation owns one canvas and handles lost rendering', async ({ page }) => {
  23  |   const errors: string[] = [];
  24  |   page.on('pageerror', error => errors.push(error.message));
  25  |   await page.goto('/');
  26  |   for (let i = 0; i < 4; i++) {
  27  |     await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  28  |     await expect(page.locator('.living-city-canvas')).toHaveCount(1);
> 29  |     await page.getByRole('link', { name: 'Panduan & privasi' }).click();
      |                                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  30  |     await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  31  |     await page.goBack();
  32  |   }
  33  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  34  |   await page.locator('.living-city-canvas').evaluate(el => el.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  35  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  36  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  37  |   await expect(page.locator('.living-city-fallback')).toBeVisible();
  38  |   await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  39  |   await expect(page).toHaveURL(/\/play/);
  40  |   expect(errors).toEqual([]);
  41  | });
  42  | 
  43  | test('homepage works when the lazy renderer cannot be downloaded', async ({ page }) => {
  44  |   await page.route('**/createCityScene-*.js', route => route.abort());
  45  |   await page.goto('/');
  46  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  47  |   await expect(page.locator('.living-city-fallback')).toBeVisible();
  48  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  49  |   await page.getByRole('link', { name: 'Buka Bab 1: Undangan tanpa lamaran' }).click();
  50  |   await expect(page).toHaveURL(/\/play/);
  51  | });
  52  | 
  53  | test('reduced motion avoids renderer downloads and supports a live preference change', async ({ page }) => {
  54  |   const rendererRequests: string[] = [];
  55  |   page.on('request', request => { if (/createCityScene-/.test(request.url())) rendererRequests.push(request.url()); });
  56  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  57  |   await page.goto('/');
  58  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'reduced-motion');
  59  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  60  |   expect(rendererRequests).toEqual([]);
  61  |   await page.emulateMedia({ reducedMotion: 'no-preference' });
  62  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  63  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  64  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'reduced-motion');
  65  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  66  | });
  67  | 
  68  | test('init can finish after client navigation without appending a stale canvas', async ({ page }) => {
  69  |   let release!: () => void;
  70  |   let requested!: () => void;
  71  |   const requestedPromise = new Promise<void>(resolve => { requested = resolve; });
  72  |   const gate = new Promise<void>(resolve => { release = resolve; });
  73  |   await page.route('**/WebGLRenderer-*.js', async route => { requested(); await gate; await route.continue(); });
  74  |   await page.goto('/');
  75  |   await requestedPromise;
  76  |   await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  77  |   release();
  78  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  79  |   await page.goBack();
  80  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  81  |   await expect(page.locator('.living-city-canvas')).toHaveCount(1);
  82  | });
  83  | 
  84  | test('one scene resizes at all four requested widths without overflowing or blocking controls', async ({ page }) => {
  85  |   await page.goto('/');
  86  |   const city = page.locator('.living-city');
  87  |   await expect(city).toHaveAttribute('data-city-status', 'ready');
  88  |   for (const width of [1440, 768, 390, 360]) {
  89  |     await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
  90  |     // Measure one settled frame per width; separate renderer round trips can consume
  91  |     // the whole test budget on software WebGL even when every assertion passes.
  92  |     await expect.poll(() => page.evaluate(() => {
  93  |       const canvases = document.querySelectorAll('.living-city canvas');
  94  |       const canvas = canvases[0];
  95  |       const button = document.querySelector('.portal-start button');
  96  |       return {
  97  |         canvasCount: canvases.length,
  98  |         canvasFits: !!canvas && Math.abs(canvas.getBoundingClientRect().width - canvas.parentElement!.clientWidth) <= 1,
  99  |         documentFits: document.documentElement.scrollWidth <= innerWidth,
  100 |         buttonAboveFold: !!button && button.getBoundingClientRect().bottom < innerHeight,
  101 |       };
  102 |     })).toEqual({ canvasCount: 1, canvasFits: true, documentFits: true, buttonAboveFold: true });
  103 |     const button = page.getByRole('button', { name: /Mulai investigasi/ }).first();
  104 |     await button.focus();
  105 |     await expect(button).toBeFocused();
  106 |   }
  107 | });
  108 | 
  109 | test('unsupported WebGL keeps the static city and start control available', async ({ page }) => {
  110 |   await page.addInitScript(() => {
  111 |     const getContext = HTMLCanvasElement.prototype.getContext;
  112 |     const original = getContext as (this: HTMLCanvasElement, type: string, options?: unknown) => RenderingContext | null;
  113 |     HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, options?: unknown) {
  114 |       if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
  115 |       return original.call(this, type, options);
  116 |     } as typeof getContext;
  117 |   });
  118 |   await page.goto('/');
  119 |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  120 |   await expect(page.locator('.living-city-fallback')).toBeVisible();
  121 |   await expect(page.locator('.living-city canvas')).toHaveCount(0);
  122 |   await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  123 |   await expect(page).toHaveURL(/\/play/);
  124 | });
  125 | 
  126 | test('a missing city layer selects the static composite and leaves navigation usable', async ({ page }) => {
  127 |   await page.route(/\/city-mid(-compact)?\.webp$/, route => route.abort());
  128 |   await page.goto('/');
  129 |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
```