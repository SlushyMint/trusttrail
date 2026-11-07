# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-dossier.spec.ts >> OS application browsing is keyboard accessible and never creates gameplay progress
- Location: tests/smoke/visual-dossier.spec.ts:4:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Mulai investigasi/ }).first()
    - locator resolved to <button type="button" class="button button--primary ">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    33 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable

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
  2  | import { enterChapterOne, readRun, saveKey, openGameApp } from './helpers';
  3  | 
  4  | test('OS application browsing is keyboard accessible and never creates gameplay progress', async ({ page }) => {
  5  |   await page.goto('/play');
  6  |   const before = await page.evaluate(key => localStorage.getItem(key), saveKey);
  7  |   await page.locator('#os-menu-trigger').focus();
  8  |   await page.keyboard.press('Enter');
  9  |   const cases = page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: /^Case Files/ });
  10 |   await cases.focus();
  11 |   await page.keyboard.press('Enter');
  12 |   await expect(page.getByRole('region', { name: 'Case Files', exact: true })).toBeVisible();
  13 |   expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(before);
  14 |   await page.getByRole('link', { name: 'TrustTrail, beranda' }).click();
> 15 |   await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
     |                                                                         ^ Error: locator.click: Test timeout of 30000ms exceeded.
  16 |   await expect(page.getByRole('button', { name: /Buka berkas pertama/ })).toBeVisible();
  17 | });
  18 | 
  19 | test('interactive homepage preview reserves layout while city artwork is delayed', async ({ page }) => {
  20 |   let release!: () => void;
  21 |   const gate = new Promise<void>(resolve => { release = resolve; });
  22 |   await page.route(/\/city-mid(-compact)?\.webp$/, async route => { await gate; await route.continue(); });
  23 |   await page.goto('/', { waitUntil: 'domcontentloaded' });
  24 |   await page.evaluate(() => document.fonts.ready);
  25 |   const frame = page.locator('.portal-game-preview');
  26 |   const before = await frame.evaluate(element => ({ width: (element as HTMLElement).offsetWidth, height: (element as HTMLElement).offsetHeight }));
  27 |   await expect(page.locator('#os-preview-content')).toContainText('Undangan tahap akhir');
  28 |   await expect(page.getByRole('button', { name: /Mulai investigasi/ }).first()).toBeVisible();
  29 |   release();
  30 |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  31 |   const after = await frame.evaluate(element => ({ width: (element as HTMLElement).offsetWidth, height: (element as HTMLElement).offsetHeight }));
  32 |   expect(before).not.toBeNull(); expect(after).not.toBeNull();
  33 |   expect(after!.width).toBeCloseTo(before!.width, 1);
  34 |   expect(after!.height).toBeCloseTo(before!.height, 1);
  35 |   await expect(page.getByRole('button', { name: /Mulai investigasi/ }).first()).toBeVisible();
  36 | });
  37 | 
  38 | test('failed wallpaper leaves the OS, narrative and game actions usable', async ({ page }) => {
  39 |   await page.route('**/pixel/relay-coast.png', route => route.abort());
  40 |   await page.goto('/');
  41 |   await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  42 |   await expect(page.getByRole('button', { name: /Buka berkas pertama/ })).toBeVisible();
  43 |   await page.getByRole('button', { name: /Buka berkas pertama/ }).click();
  44 |   await expect(page.getByRole('region', { name: 'Cerita Ari' })).toContainText('Tiga bulan setelah lulus');
  45 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  46 | });
  47 | 
  48 | test('touch and keyboard discovery feedback respects reduced motion and records only one clue', async ({ page, isMobile }) => {
  49 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  50 |   await enterChapterOne(page);
  51 |   const inspect = page.getByRole('button', { name: /Periksa pengirim/ });
  52 |   const before = await readRun(page);
  53 |   await inspect.focus();
  54 |   expect(await readRun(page)).toEqual(before);
  55 |   if (isMobile) await inspect.tap(); else await page.keyboard.press('Enter');
  56 |   await expect(page.locator('.discovery-receipt')).toContainText('Bukti tercatat: Alamat di balik nama pengirim.');
  57 |   expect(await page.locator('.discovery-receipt').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  58 |   expect(await inspect.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  59 |   await inspect.click(); await inspect.click();
  60 |   expect((await readRun(page)).events.filter(event => event.type === 'evidence.inspected')).toHaveLength(1);
  61 |   await openGameApp(page, 'Case Files');
  62 |   await expect(page.getByRole('region', { name: 'Case Files', exact: true }).getByRole('heading', { name: 'Alamat di balik nama pengirim' })).toBeVisible();
  63 | });
  64 | 
```