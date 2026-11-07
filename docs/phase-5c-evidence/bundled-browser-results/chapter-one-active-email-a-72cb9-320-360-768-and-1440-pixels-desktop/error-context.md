# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chapter-one.spec.ts >> active email and source comparison reflow at 320, 360, 768 and 1440 pixels
- Location: tests/smoke/chapter-one.spec.ts:169:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Bandingkan dengan undangan' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('button', { name: 'Bandingkan dengan undangan' }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Bandingkan dengan undangan' })

```

```yaml
- link "Lewati ke konten":
  - /url: "#os-main"
- link "TrustTrail, beranda":
  - /url: /
  - text: LACAK / SAKU
- text: LOKAL SIMULASI FIKTIF · Tersimpan di browser ini
- banner:
  - button "Kembali"
  - paragraph: LACAK SAKU
  - heading "Browser" [level=1]
- complementary "Notifikasi Saku":
  - status: "Bukti tercatat: Alamat di balik nama pengirim."
  - strong: Bukti tercatat
  - paragraph: Alamat di balik nama pengirim
  - button "Tutup notifikasi": ×
- main:
  - region "Browser":
    - heading "Browser" [level=2]
    - text: novatech.example/karier
    - paragraph: DIREKTORI PERUSAHAAN / SUMBER TERPISAH
    - heading "Catatan karier NovaTech" [level=3]
    - paragraph: Sumber ini dibuka dari direktori perusahaan di ruang investigasi, bukan dari tautan dalam email. Seluruh catatan tetap fiktif untuk latihan.
    - text: Saku Browser
    - strong: Direktori perusahaan
    - button "Periksa catatan lowongan"
    - paragraph: Buka detail catatan sebelum membandingkan. Membuka Browser saja belum dihitung sebagai verifikasi.
    - text: Direktori dibuka secara terpisah Tidak terhubung ke internet
- navigation "Navigasi Saku":
  - button "Kembali"
  - link "Beranda Saku":
    - /url: /
    - text: Beranda
  - button "Ganti aplikasi": Aplikasi · 1 bukti
```

# Test source

```ts
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
  134 |       if (await target.evaluate(element => element === document.activeElement)) return;
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
  154 |   // Wait for the route's inbox/reader before deciding which keyboard control to use.
  155 |   await expect(invitation.or(page.getByRole('button', { name: /Tentukan langkah/ })).first()).toBeVisible();
  156 |   if (await invitation.isVisible()) await activate(invitation);
  157 |   await activate(page.getByRole('button', { name: /Tentukan langkah/ }));
  158 |   await tabTo(page.getByRole('radio', { name: /Buka tautan undangan/ }));
  159 |   await page.keyboard.press('ArrowDown');
  160 |   await page.keyboard.press('ArrowDown');
  161 |   await expect(page.getByRole('radio', { name: /Tahan dulu, verifikasi/ })).toBeChecked();
  162 |   await activate(page.getByRole('button', { name: 'Jalankan pilihan' }));
  163 |   await activate(page.getByRole('button', { name: /Lihat refleksi/ }));
  164 |   await expect(page.getByText('4 / 4', { exact: true })).toBeVisible();
  165 |   await activate(page.getByRole('button', { name: /Tutup berkas Bab 1/ }));
  166 |   await expect(page.getByRole('heading', { name: 'Bab 1 selesai', exact: true })).toBeVisible();
  167 | });
  168 | 
  169 | test('active email and source comparison reflow at 320, 360, 768 and 1440 pixels', async ({ page }) => {
  170 |   await enterChapterOne(page);
  171 |   for (const width of [320, 360, 768, 1440]) {
  172 |     await page.setViewportSize({ width, height: 900 });
  173 |     await openMail(page);
  174 |     await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  175 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  176 |     await openGameApp(page, 'Browser');
  177 |     const inspectSource = page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true });
  178 |     if (await inspectSource.isVisible()) await inspectSource.click();
  179 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
> 180 |     await expect(page.getByRole('button', { name: 'Bandingkan dengan undangan' })).toBeVisible();
      |                                                                                    ^ Error: expect(locator).toBeVisible() failed
  181 |   }
  182 | });
  183 | 
```