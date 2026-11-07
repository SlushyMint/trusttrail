# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> keyboard app activation and missing launch target never trap the player
- Location: tests/smoke/onboarding.spec.ts:54:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.focus: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('dialog').getByRole('button', { name: /^Case Files/ })

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
      - button "Bisukan semua suara" [ref=e10] [cursor=pointer]
      - button "Suara" [ref=e14] [cursor=pointer]
  - generic [ref=e15]: SIMULASI FIKTIF · Tersimpan di browser ini
  - banner [ref=e16]:
    - button "Kembali" [ref=e17] [cursor=pointer]:
      - generic [aria-hidden] [ref=e18]: ←
    - generic [ref=e19]:
      - paragraph [ref=e20]: LACAK SAKU
      - heading "Browser" [active] [level=1] [ref=e21]
  - complementary "Notifikasi Saku":
    - status [ref=e28]
  - complementary "Tutorial investigasi" [ref=e29]:
    - status [ref=e30]:
      - paragraph [ref=e31]: Investigasi pertamamu · 4 dari 5
      - heading "Bukti membantumu mengambil keputusan." [level=2] [ref=e32]
      - paragraph [ref=e33]: Buka Case Files untuk melihat temuan dan perkembangan investigasimu.
      - paragraph [ref=e34]: Buka aplikasi melalui kontrol yang ditandai. Jika belum terlihat, buka Aplikasi.
    - button "Lewati tutorial" [ref=e36] [cursor=pointer]
  - main [ref=e37]:
    - region "Browser" [ref=e39]:
      - heading "Browser" [level=2] [ref=e40]
      - generic [ref=e42]:
        - generic [ref=e43]:
          - generic [aria-hidden] [ref=e44]: ◇
          - generic [ref=e45]: novatech.example/karier
        - generic [ref=e46]:
          - paragraph [ref=e47]: DIREKTORI PERUSAHAAN / SUMBER TERPISAH
          - heading "Catatan karier NovaTech" [level=3] [ref=e48]
          - paragraph [ref=e49]: Sumber ini dibuka dari direktori perusahaan di ruang investigasi, bukan dari tautan dalam email. Seluruh catatan tetap fiktif untuk latihan.
          - generic [ref=e50]:
            - generic [ref=e51]: Saku
            - generic [aria-hidden] [ref=e52]: →
            - generic [ref=e53]: Browser
            - generic [aria-hidden] [ref=e54]: →
            - strong [ref=e55]: Direktori perusahaan
          - button "Periksa catatan lowongan" [ref=e56] [cursor=pointer]
          - paragraph [ref=e57]: Buka detail catatan sebelum membandingkan. Membuka Browser saja belum dihitung sebagai verifikasi.
        - generic [ref=e58]:
          - generic [ref=e59]: Direktori dibuka secara terpisah
          - generic [ref=e60]: Tidak terhubung ke internet
  - navigation "Navigasi Saku" [ref=e61]:
    - button "Kembali" [ref=e62] [cursor=pointer]:
      - generic [aria-hidden] [ref=e63]: ←
    - link "Beranda Saku" [ref=e65] [cursor=pointer]:
      - /url: /
      - generic [ref=e68]: Beranda
    - button "Ganti aplikasi" [ref=e69] [cursor=pointer]:
      - generic [aria-hidden] [ref=e70]: ▤
      - generic [ref=e71]: Aplikasi
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { enterChapterOne, openGameApp, openMail, saveKey } from './helpers';
  3  | const tutorial = (page: import('@playwright/test').Page) => page.getByRole('complementary', { name: 'Tutorial investigasi' });
  4  | test('real tutorial journey preserves save and resumes interrupted steps', async ({ page }, info) => {
  5  |   await enterChapterOne(page);
  6  |   const before = await page.evaluate(key => localStorage.getItem(key), saveKey);
  7  |   await expect(tutorial(page)).toContainText('Selamat datang');
  8  |   await page.screenshot({ animations: 'disabled', path: `docs/phase-5d-evidence/${info.project.name}-welcome.png` });
  9  |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  10 |   await page.reload();
  11 |   await expect(tutorial(page)).toContainText('Mulai dari Mail');
  12 |   for (const [app, stage] of [['Mail', 'mail'], ['Browser', 'browser'], ['Case Files', 'cases']] as const) {
  13 |     await page.screenshot({ animations: 'disabled', path: `docs/phase-5d-evidence/${info.project.name}-${stage}.png` });
  14 |     await openGameApp(page, app);
  15 |   }
  16 |   await expect(tutorial(page)).toContainText('Peralatanmu sudah siap');
  17 |   await page.screenshot({ animations: 'disabled', path: `docs/phase-5d-evidence/${info.project.name}-ready.png` });
  18 |   await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).click();
  19 |   await expect(tutorial(page)).toHaveCount(0);
  20 |   expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(before);
  21 |   await page.reload();
  22 |   await expect(tutorial(page)).toHaveCount(0);
  23 | });
  24 | test('skip, collect evidence, replay and keyboard dismissal preserve progress', async ({ page }) => {
  25 |   await enterChapterOne(page);
  26 |   await page.getByRole('button', { name: 'Lewati tutorial', exact: true }).click();
  27 |   await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  28 |   const before = await page.evaluate(key => localStorage.getItem(key), saveKey);
  29 |   await page.goto('/guide');
  30 |   await page.getByRole('button', { name: 'Ulangi tutorial' }).click();
  31 |   await expect(tutorial(page)).toContainText('Selamat datang');
  32 |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).focus();
  33 |   await page.keyboard.press('Space');
  34 |   await openGameApp(page, 'Browser');
  35 |   await expect(tutorial(page)).toContainText('Mulai dari Mail');
  36 |   await page.keyboard.press('Escape');
  37 |   await expect(tutorial(page)).toHaveCount(0);
  38 |   await openMail(page);
  39 |   expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(before);
  40 | });
  41 | for (const width of [320, 360, 390, 768, 1440]) test(`tutorial fits ${width}px with reduced motion`, async ({ page }) => {
  42 |   await page.setViewportSize({ width, height: 900 });
  43 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  44 |   await enterChapterOne(page);
  45 |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  46 |   await openGameApp(page, 'Mail');
  47 |   await openGameApp(page, 'Browser');
  48 |   await openGameApp(page, 'Case Files');
  49 |   const box = await tutorial(page).boundingBox();
  50 |   expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
  51 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  52 |   await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).click();
  53 | });
  54 | test('keyboard app activation and missing launch target never trap the player', async ({ page }) => {
  55 |   await enterChapterOne(page);
  56 |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).focus();
  57 |   await page.keyboard.press('Enter');
  58 |   for (const name of ['Mail', 'Browser', 'Case Files'] as const) {
  59 |     const desktop = await page.locator('.trusttrail-os').getAttribute('data-os') === 'desktop';
  60 |     if (desktop) {
  61 |       await page.getByRole('button', { name: `Tampilkan ${name}`, exact: true }).focus();
  62 |     } else {
  63 |       await page.getByRole('button', { name: 'Ganti aplikasi', exact: true }).focus();
  64 |       await page.keyboard.press('Enter');
> 65 |       await page.getByRole('dialog').getByRole('button', { name: new RegExp(`^${name}`) }).focus();
     |                                                                                            ^ Error: locator.focus: Test timeout of 30000ms exceeded.
  66 |     }
  67 |     await page.keyboard.press('Enter');
  68 |   }
  69 |   await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).focus();
  70 |   await page.keyboard.press('Space');
  71 |   await expect(tutorial(page)).toHaveCount(0);
  72 |   await expect(page.locator(await page.locator('.trusttrail-os').getAttribute('data-os') === 'desktop' ? '#task-journal' : '#os-menu-trigger')).toBeFocused();
  73 |   await page.goto('/guide');
  74 |   await page.getByRole('button', { name: 'Ulangi tutorial' }).click();
  75 |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  76 |   await page.locator('[data-tutorial-target=true]').evaluateAll(elements => elements.forEach(element => element.remove()));
  77 |   await expect(tutorial(page)).toContainText('Mulai dari Mail');
  78 |   await page.getByRole('button', { name: 'Lewati tutorial' }).click();
  79 |   await expect(tutorial(page)).toHaveCount(0);
  80 | });
  81 | 
  82 | test('skip inside the modal menu restores reachable focus', async ({ page }) => {
  83 |   await enterChapterOne(page);
  84 |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  85 |   await page.locator('#os-menu-trigger').click();
  86 |   await page.getByRole('button', { name: 'Lewati tutorial' }).click();
  87 |   await expect(tutorial(page)).toHaveCount(0);
  88 |   await expect(page.getByRole('button', { name: 'Tutup Menu TrustTrail' })).toBeFocused();
  89 |   await page.keyboard.press('Escape');
  90 |   await expect(page.locator('#os-menu-trigger')).toBeFocused();
  91 | });
  92 | 
```