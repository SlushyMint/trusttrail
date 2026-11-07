# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage-b2.spec.ts >> repeated homepage visits release detached DOM and event listeners
- Location: tests/smoke/homepage-b2.spec.ts:75:1

# Error details

```
Error: Test timeout of 30000ms exceeded
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Lewati ke konten" [ref=e4] [cursor=pointer]:
    - /url: "#os-main"
  - banner [ref=e5]:
    - link "TrustTrail, beranda" [ref=e6] [cursor=pointer]:
      - /url: /
      - strong [ref=e9]: TRUSTTRAIL
      - generic [ref=e10]: /
      - generic [ref=e11]: Lacak OS
    - generic [ref=e12]: Progres lokal · Tanpa akun
    - navigation "Navigasi utama" [ref=e13]:
      - link "Panduan" [ref=e14] [cursor=pointer]:
        - /url: /guide
      - link "Catatan refleksi" [ref=e15] [cursor=pointer]:
        - /url: /report
    - generic [ref=e16]:
      - text: Sesi Ari
      - generic [ref=e18]: LOCAL / 01
  - main [ref=e19]:
    - navigation "Aplikasi desktop" [ref=e20]:
      - button "Buka Mail" [ref=e21] [cursor=pointer]:
        - generic [ref=e28]: Mail
      - button "Buka Browser" [ref=e29] [cursor=pointer]:
        - generic [ref=e35]: Browser
      - button "Buka Messages" [ref=e36] [cursor=pointer]:
        - generic [ref=e42]: Messages
      - button "Buka Files" [ref=e43] [cursor=pointer]:
        - generic [ref=e49]: Files
      - button "Buka Case Files" [ref=e50] [cursor=pointer]:
        - generic [ref=e57]: Case Files
    - generic [ref=e58]:
      - generic [ref=e59]:
        - paragraph [ref=e60]: TRUSTTRAIL / PERSONAL DESKTOP
        - paragraph [ref=e61]: Panduan
        - paragraph [ref=e62]: Simulasi fiktif · Tanpa data pribadi
      - button "Kelola progres" [ref=e63] [cursor=pointer]
    - navigation "Tata letak jendela" [ref=e64]:
      - button "Rapikan jendela" [ref=e65] [cursor=pointer]
    - region "Panduan" [ref=e67]:
      - generic [ref=e68]:
        - heading "Panduan" [level=2] [ref=e74]
        - group [ref=e75]:
          - generic "Atur posisi Panduan" [ref=e76] [cursor=pointer]:
            - generic [aria-hidden] [ref=e77]: ↔
        - generic [ref=e78]:
          - button "Minimalkan Panduan" [ref=e79] [cursor=pointer]:
            - generic [aria-hidden] [ref=e80]: _
          - button "Maksimalkan Panduan" [ref=e81] [cursor=pointer]:
            - generic [aria-hidden] [ref=e82]: □
          - button "Tutup Panduan" [ref=e83] [cursor=pointer]:
            - generic [aria-hidden] [ref=e84]: ×
      - generic [ref=e86]:
        - heading "Tentang simulasi" [active] [level=1] [ref=e87]
        - paragraph [ref=e88]: Berlatih mengambil langkah yang lebih hati-hati.
        - generic [ref=e89]:
          - heading "Ruang yang aman untuk belajar" [level=2] [ref=e90]
          - paragraph [ref=e91]: Orang, organisasi, percakapan, dan alamat dalam cerita ini bersifat fiktif. Tidak ada tautan rekrutmen yang dibuka ke internet.
          - paragraph [ref=e92]: TrustTrail tidak memerlukan akun, tidak memiliki formulir data pribadi, dan tidak mengirim progres ke layanan lain. Jangan masukkan kata sandi, OTP, dokumen identitas, atau data rekening.
          - heading "Cara memeriksa jejak" [level=2] [ref=e93]
          - list [ref=e94]:
            - listitem [ref=e95]: Buka detail berlabel “Periksa”. Informasi yang kamu telusuri akan masuk ke Jurnal bukti.
            - listitem [ref=e96]: Cari catatan karier dari direktori independen. Periksa detailnya dan bandingkan dengan klaim pesan. Membuka panel saja belum melakukan verifikasi.
            - listitem [ref=e97]: Pilih tindakan lalu tekan “Jalankan pilihan”. Baca akibat dan langkah berikutnya. Semua pilihan tetap memberi jalan untuk belajar.
          - heading "Progres milik browser ini" [level=2] [ref=e98]
          - paragraph [ref=e99]: Hanya urutan tindakan permainan yang disimpan di localStorage. Kamu dapat melanjutkan setelah memuat ulang halaman atau menghapus progres dari menu. Tidak ada nama, alamat email pribadi, kata sandi, atau pengenal pemain yang disimpan.
          - paragraph [ref=e100]: Gunakan satu tab aktif. Penyimpanan dapat diblokir atau dihapus browser. Progres tidak disinkronkan antarperangkat, profil, atau alamat situs. Jika penyimpanan gagal, permainan tetap berjalan dalam tab ini dengan pemberitahuan.
          - link "Kembali ke perjalanan Ari" [ref=e101] [cursor=pointer]:
            - /url: /play
        - complementary [ref=e102]:
          - paragraph [ref=e103]: Latihan, bukan kepastian
          - paragraph [ref=e105]: Satu ciri seperti salah ketik, HTTPS, atau tampilan rapi tidak menentukan kebenaran tawaran. Tiga bab melatih pemeriksaan undangan, identitas perekrut, dan portal. Misi pemulihan menyesuaikan tindakan dengan paparan Ari, lalu Trust Report merangkum jejak permainan.
      - status [ref=e106]
    - complementary "Notifikasi desktop":
      - status [ref=e107]
    - generic [ref=e111]: LACAK PERSONAL DESKTOP
  - contentinfo [ref=e112]:
    - button "LACAK" [ref=e113] [cursor=pointer]
    - navigation "Taskbar aplikasi" [ref=e117]:
      - button "Tampilkan Mail" [ref=e118] [cursor=pointer]:
        - generic [ref=e125]: Mail
      - button "Tampilkan Browser" [ref=e127] [cursor=pointer]:
        - generic [ref=e133]: Browser
      - button "Tampilkan Messages" [ref=e135] [cursor=pointer]:
        - generic [ref=e141]: Messages
      - button "Tampilkan Files" [ref=e143] [cursor=pointer]:
        - generic [ref=e149]: Files
      - button "Tampilkan Case Files" [ref=e151] [cursor=pointer]:
        - generic [ref=e158]: Case Files
    - generic [ref=e160]:
      - generic [aria-hidden] [ref=e161]: ▂▄▆
      - generic [ref=e162]: Simulasi lokal
      - generic [ref=e164]: SORE HARI
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
  90 |     await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  91 |     await expect(page.locator('.living-city canvas')).toHaveCount(0);
  92 |   }
  93 |   // Runtime caches may warm, but old homepage trees/listeners must be released.
> 94 |   await expect.poll(async () => (await readMetrics()).Nodes!).toBeLessThanOrEqual(baseline.Nodes! + 12);
     |                                                               ^ Error: Test timeout of 30000ms exceeded
  95 |   await expect.poll(async () => (await readMetrics()).JSEventListeners!).toBeLessThanOrEqual(baseline.JSEventListeners!);
  96 | });
  97 | 
```