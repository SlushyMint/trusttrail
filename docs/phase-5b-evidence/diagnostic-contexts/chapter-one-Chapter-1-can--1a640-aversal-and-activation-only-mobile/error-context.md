# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chapter-one.spec.ts >> Chapter 1 can be completed using keyboard traversal and activation only
- Location: tests/smoke/chapter-one.spec.ts:129:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.evaluate: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Tentukan langkah/ })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Lewati ke konten" [ref=e4] [cursor=pointer]:
    - /url: "#os-main"
  - generic [ref=e5]:
    - link "TrustTrail, beranda" [ref=e6] [cursor=pointer]:
      - /url: /
      - text: LACAK / SAKU
    - generic [ref=e9]:
      - text: LOKAL
      - generic [aria-hidden] [ref=e11]: ▂▄▆
  - generic [ref=e12]: SIMULASI FIKTIF · Tersimpan di browser ini
  - banner [ref=e13]:
    - button "Kembali" [ref=e14] [cursor=pointer]:
      - generic [aria-hidden] [ref=e15]: ←
    - generic [ref=e16]:
      - paragraph [ref=e17]: KOTAK SURAT ARI
      - heading "Mail" [active] [level=1] [ref=e18]
  - complementary "Notifikasi Saku" [ref=e26]:
    - generic [ref=e27]:
      - status [ref=e28]: "Bukti tercatat: Undangan tidak cocok dengan catatan karier."
      - generic [ref=e29]:
        - generic [ref=e36]:
          - strong [ref=e37]: Bukti tercatat
          - paragraph [ref=e38]: Undangan tidak cocok dengan catatan karier
        - button "Tutup notifikasi" [ref=e39] [cursor=pointer]: ×
  - main [ref=e40]:
    - region "Mail" [ref=e42]:
      - heading "Mail" [level=2] [ref=e43]
      - generic [ref=e45]:
        - generic [ref=e46]:
          - button "Kotak masuk" [ref=e47] [cursor=pointer]:
            - generic [aria-hidden] [ref=e48]: ←
            - text: Kotak masuk
          - generic [ref=e49]: 2 pesan diterima
        - navigation "Kotak masuk" [ref=e52]:
          - generic [ref=e53]:
            - generic [ref=e54]: KOTAK MASUK
            - generic [ref=e55]: "02"
          - button "NovaTech Baru Undangan tahap akhir NovaTech Internship Program Selamat! Profilmu terpilih…" [pressed] [ref=e56] [cursor=pointer]:
            - generic [ref=e57]:
              - text: NovaTech
              - generic [ref=e59]: Baru
            - strong [ref=e60]: Undangan tahap akhir
            - generic [ref=e61]: NovaTech Internship Program
            - generic [ref=e62]: Selamat! Profilmu terpilih…
          - button "Pusat Karier Kampus Infomasi klinik CV Hari Jumat · Alumni Halo alumni, klinik CV…" [ref=e63] [cursor=pointer]:
            - generic [ref=e64]: Pusat Karier Kampus
            - strong [ref=e65]: Infomasi klinik CV
            - generic [ref=e66]: Hari Jumat · Alumni
            - generic [ref=e67]: Halo alumni, klinik CV…
          - generic [ref=e68]: Semua pesan tersimpandi perangkat ini.
        - generic [ref=e75]:
          - generic [ref=e76]: Tidak ada data dikirim
          - generic [ref=e78]: Semua alamat fiktif
  - navigation "Navigasi Saku" [ref=e79]:
    - button "Kembali" [ref=e80] [cursor=pointer]:
      - generic [aria-hidden] [ref=e81]: ←
    - link "Beranda Saku" [ref=e83] [cursor=pointer]:
      - /url: /
      - generic [ref=e86]: Beranda
    - button "Ganti aplikasi" [ref=e87] [cursor=pointer]:
      - generic [aria-hidden] [ref=e88]: ▤
      - generic [ref=e89]: Aplikasi · 4 bukti
```

# Test source

```ts
  34  | 
  35  | test('risky choice remains playable, never opens a real destination and invents no compromise', async ({ page }) => {
  36  |   await enterChapterOne(page);
  37  |   await commitChoice(page, /Buka tautan undangan/);
  38  |   await expect(page.getByRole('heading', { name: 'Satu klik, pertanyaan baru.' })).toBeVisible();
  39  |   await expect(page.locator('input, form, iframe')).toHaveCount(0);
  40  |   await expect(page.getByText(/Membuka tautan tidak sama dengan membuktikan/)).toBeVisible();
  41  |   await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  42  |   await expect(page.getByText('0 / 4', { exact: true })).toBeVisible();
  43  |   await expect(page.getByText('0 / 2', { exact: true })).toHaveCount(2);
  44  |   await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  45  |   await expect(page.getByText(/menutup pratinjau kandidat tanpa mengisi/)).toBeVisible();
  46  | });
  47  | 
  48  | test('unfinished verification survives refresh; later evidence never earns retroactive awareness', async ({ page }) => {
  49  |   await enterChapterOne(page);
  50  |   await commitChoice(page, /Tahan dulu, verifikasi/);
  51  |   await page.reload();
  52  |   await expect(page.getByRole('heading', { name: 'Periksa sebelum menyimpulkan.' })).toBeVisible();
  53  |   await expect(page.getByRole('button', { name: 'Bandingkan dengan undangan' })).toHaveCount(0);
  54  |   await page.getByRole('button', { name: 'Periksa catatan lowongan' }).click();
  55  |   await page.reload();
  56  |   await page.getByRole('button', { name: 'Bandingkan dengan undangan' }).click();
  57  |   await page.reload();
  58  |   await expect(page.getByRole('heading', { name: 'Klaim bertemu pembanding.' })).toBeVisible();
  59  |   await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  60  |   await expect(page.getByText('0 / 4', { exact: true })).toBeVisible();
  61  |   await expect(page.getByText('2 / 2', { exact: true })).toHaveCount(2);
  62  |   await openGameApp(page, 'Case Files');
  63  |   const journal = page.getByRole('region', { name: 'Case Files' });
  64  |   await expect(journal.getByText('C1-E04 · Setelah pilihan')).toBeVisible();
  65  |   expect((await readRun(page)).events.filter(event => event.type === 'choice.committed')).toHaveLength(1);
  66  | });
  67  | 
  68  | test('ignore protects Ari without requiring clues and restart/reset require confirmation', async ({ page }) => {
  69  |   await enterChapterOne(page);
  70  |   await commitChoice(page, /Abaikan undangan ini/);
  71  |   await expect(page.getByRole('heading', { name: 'Berhenti juga sebuah pilihan.' })).toBeVisible();
  72  |   await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  73  |   await expect(page.getByText('0 / 4', { exact: true })).toBeVisible();
  74  |   await expect(page.getByText('2 / 2', { exact: true })).toBeVisible();
  75  |   await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  76  |   await page.evaluate(() => localStorage.setItem('unrelated-progress', 'keep'));
  77  |   const previous = await readRun(page);
  78  |   await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
  79  |   await page.getByRole('button', { name: 'Batal', exact: true }).click();
  80  |   expect(await readRun(page)).toEqual(previous);
  81  |   await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
  82  |   await page.getByRole('button', { name: 'Ya, mulai ulang' }).click();
  83  |   expect((await readRun(page)).events).toEqual([{ type: 'run.started' }]);
  84  |   await page.getByRole('link', { name: 'TrustTrail, beranda' }).click();
  85  |   await page.getByText('Kelola progres tersimpan', { exact: true }).click();
  86  |   await page.getByRole('button', { name: 'Hapus progres', exact: true }).click();
  87  |   await page.getByRole('button', { name: 'Ya, hapus progres' }).click();
  88  |   expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBeNull();
  89  |   expect(await page.evaluate(() => localStorage.getItem('unrelated-progress'))).toBe('keep');
  90  | });
  91  | 
  92  | test('corrupt save is not silently overwritten', async ({ page }) => {
  93  |   await page.addInitScript(key => localStorage.setItem(key, '{corrupt'), saveKey);
  94  |   await page.goto('/play');
  95  |   await expect(page.getByText(/Simpanan tidak dapat dibaca/)).toBeVisible();
  96  |   expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe('{corrupt');
  97  |   await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
  98  |   await page.getByRole('button', { name: 'Batal', exact: true }).click();
  99  |   expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe('{corrupt');
  100 | });
  101 | 
  102 | test('blocked storage allows a memory-only Chapter 1 playthrough', async ({ page }) => {
  103 |   await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'QuotaExceededError'); }; });
  104 |   await enterChapterOne(page);
  105 |   await expect(page.getByText(/Penyimpanan browser tidak tersedia/)).toBeVisible();
  106 |   await commitChoice(page, /Abaikan undangan ini/);
  107 |   await page.getByRole('button', { name: /Lihat refleksi/ }).click();
  108 |   await page.getByRole('button', { name: /Tutup berkas Bab 1/ }).click();
  109 |   await expect(page.getByRole('heading', { name: 'Bab 1 selesai', exact: true })).toBeVisible();
  110 | });
  111 | 
  112 | test('another tab pauses writes until the player reloads the latest progress', async ({ page, context }) => {
  113 |   await enterChapterOne(page);
  114 |   const second = await context.newPage();
  115 |   await second.goto('/play');
  116 |   await second.getByRole('button', { name: /Periksa pengirim/ }).click();
  117 |   await expect(page.getByText(/Progres berubah di tab lain/)).toBeVisible();
  118 |   const external = await readRun(second);
  119 |   await page.getByRole('button', { name: /Periksa batas waktu/ }).click();
  120 |   expect(await readRun(page)).toEqual(external);
  121 |   await page.getByRole('button', { name: 'Muat progres terbaru' }).click();
  122 |   await openGameApp(page, 'Case Files');
  123 |   const journal = page.getByRole('region', { name: 'Case Files' });
  124 |   await expect(journal.getByRole('heading', { name: 'Alamat di balik nama pengirim' })).toBeVisible();
  125 |   await expect(journal.getByRole('heading', { name: 'Batas waktu yang menekan' })).toHaveCount(0);
  126 |   await second.close();
  127 | });
  128 | 
  129 | test('Chapter 1 can be completed using keyboard traversal and activation only', async ({ page }) => {
  130 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  131 |   await page.goto('/play');
  132 |   async function tabTo(target: Locator) {
  133 |     for (let attempt = 0; attempt < 60; attempt++) {
> 134 |       if (await target.evaluate(element => element === document.activeElement)) return;
      |                        ^ Error: locator.evaluate: Test timeout of 30000ms exceeded.
  135 |       await page.keyboard.press('Tab');
  136 |     }
  137 |     throw new Error(`Control was not reachable by Tab: ${await target.innerText()}`);
  138 |   }
  139 |   async function activate(target: Locator) { await tabTo(target); await page.keyboard.press('Enter'); }
  140 |   await activate(page.getByRole('button', { name: /Mulai investigasi/ }));
  141 |   await activate(page.getByRole('button', { name: /Buka berkas pertama/ }));
  142 |   for (let i = 0; i < 3; i++) await activate(page.getByRole('button', { name: /Lanjut cerita/ }));
  143 |   await activate(page.getByRole('button', { name: /Periksa undangan/ }));
  144 |   await activate(page.getByRole('button', { name: /Periksa pengirim/ }));
  145 |   await activate(page.getByRole('button', { name: /Periksa batas waktu/ }));
  146 |   await activate(page.getByRole('button', { name: /Periksa tujuan tautan/ }));
  147 |   await activate(page.locator('#os-menu-trigger'));
  148 |   await activate(page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: /^Browser/ }));
  149 |   await activate(page.getByRole('button', { name: 'Periksa catatan lowongan' }));
  150 |   await activate(page.getByRole('button', { name: 'Bandingkan dengan undangan' }));
  151 |   await activate(page.locator('#os-menu-trigger'));
  152 |   await activate(page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: 'Mail Kotak masuk Ari', exact: true }));
  153 |   const invitation = page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ });
  154 |   if (await invitation.isVisible()) await activate(invitation);
  155 |   await activate(page.getByRole('button', { name: /Tentukan langkah/ }));
  156 |   await tabTo(page.getByRole('radio', { name: /Buka tautan undangan/ }));
  157 |   await page.keyboard.press('ArrowDown');
  158 |   await page.keyboard.press('ArrowDown');
  159 |   await expect(page.getByRole('radio', { name: /Tahan dulu, verifikasi/ })).toBeChecked();
  160 |   await activate(page.getByRole('button', { name: 'Jalankan pilihan' }));
  161 |   await activate(page.getByRole('button', { name: /Lihat refleksi/ }));
  162 |   await expect(page.getByText('4 / 4', { exact: true })).toBeVisible();
  163 |   await activate(page.getByRole('button', { name: /Tutup berkas Bab 1/ }));
  164 |   await expect(page.getByRole('heading', { name: 'Bab 1 selesai', exact: true })).toBeVisible();
  165 | });
  166 | 
  167 | test('active email and source comparison reflow at 320, 360, 768 and 1440 pixels', async ({ page }) => {
  168 |   await enterChapterOne(page);
  169 |   for (const width of [320, 360, 768, 1440]) {
  170 |     await page.setViewportSize({ width, height: 900 });
  171 |     await openMail(page);
  172 |     await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  173 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  174 |     await openGameApp(page, 'Browser');
  175 |     const inspectSource = page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true });
  176 |     if (await inspectSource.isVisible()) await inspectSource.click();
  177 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  178 |     await expect(page.getByRole('button', { name: 'Bandingkan dengan undangan' })).toBeVisible();
  179 |   }
  180 | });
  181 | 
```