# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> keyboard app activation and missing launch target never trap the player
- Location: tests/smoke/onboarding.spec.ts:54:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  locator('#os-menu-trigger')
Expected: focused
Received: inactive
Timeout:  5000ms

Call log:
  - Expect "toBeFocused" locator('#os-menu-trigger') with timeout 5000ms
  - waiting for locator('#os-menu-trigger')
    14 × locator resolved to <button id="os-menu-trigger" aria-haspopup="dialog" aria-label="Ganti aplikasi" data-tutorial-target="false">…</button>
       - unexpected value "inactive"

```

```yaml
- button "Ganti aplikasi": Aplikasi
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
  76  |   await expect(tutorial(page).getByRole('heading', { name: 'Peralatanmu sudah siap.' })).toBeFocused();
  77  |   await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).focus();
  78  |   await page.keyboard.press('Space');
  79  |   await expect(tutorial(page)).toHaveCount(0);
> 80  |   await expect(page.locator(await page.locator('.trusttrail-os').getAttribute('data-os') === 'desktop' ? '#task-journal' : '#os-menu-trigger')).toBeFocused();
      |                                                                                                                                                 ^ Error: expect(locator).toBeFocused() failed
  81  |   await page.goto('/guide');
  82  |   await page.getByRole('button', { name: 'Ulangi tutorial' }).click();
  83  |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  84  |   await page.locator('[data-tutorial-target=true]').evaluateAll(elements => elements.forEach(element => element.remove()));
  85  |   await expect(tutorial(page)).toContainText('Mulai dari Mail');
  86  |   await page.getByRole('button', { name: 'Lewati tutorial' }).click();
  87  |   await expect(tutorial(page)).toHaveCount(0);
  88  | });
  89  | 
  90  | test('skip inside the modal menu restores reachable focus', async ({ page }) => {
  91  |   await enterChapterOne(page);
  92  |   await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  93  |   await page.locator('#os-menu-trigger').click();
  94  |   await page.getByRole('button', { name: 'Lewati tutorial' }).click();
  95  |   await expect(tutorial(page)).toHaveCount(0);
  96  |   await expect(page.getByRole('button', { name: 'Tutup Menu TrustTrail' })).toBeFocused();
  97  |   await page.keyboard.press('Escape');
  98  |   await expect(page.locator('#os-menu-trigger')).toBeFocused();
  99  | });
  100 | 
```