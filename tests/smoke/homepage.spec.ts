import { expect, test } from '@playwright/test';
import { enterChapterOne, saveKey } from './helpers';

test('homepage preview is keyboard accessible and cannot change a saved investigation', async ({ page }) => {
  await enterChapterOne(page);
  await page.getByRole('button', { name: 'Periksa pengirim', exact: true }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), saveKey);
  await page.goto('/');
  const control = page.locator('.portal-inspect');
  await control.focus();
  await expect(control).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(control).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#practice-sender')).toContainText('undangan@lentera-acara.example');
  await expect(page.locator('.portal-notebook [role=status]')).toContainText('bukan bukti pasti penipuan');
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(saved);
  await page.keyboard.press('Space');
  await expect(control).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('link', { name: /Lanjutkan perjalanan/ }).first().click();
  await page.getByRole('button', { name: 'Periksa pengirim', exact: true }).click();
  await expect(page.locator('.px-inline-detail code')).toHaveText('recruitment@novatech-talenta.example');
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(saved);
});

test('fresh homepage starts the real game and attributes all three statistics', async ({ page }) => {
  await page.goto('/');
  const before = await page.evaluate(() => JSON.stringify(localStorage));
  await page.getByRole('button', { name: 'Periksa alamat pengirim', exact: true }).click();
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(before);
  for (const summary of await page.locator('.portal-statistics summary').all()) {
    await summary.focus();
    await page.keyboard.press('Enter');
  }
  const citations = page.locator('.portal-statistics details a');
  await expect(citations).toHaveCount(3);
  for (const link of await citations.all()) {
    await expect(link).toBeVisible();
    expect(new URL((await link.getAttribute('href'))!).hostname).toMatch(/(^|\.)(ojk|komdigi)\.go\.id$/);
  }
  await expect(page.getByText('Bab 2 · Akan datang', { exact: true })).toBeVisible();
  await expect(page.getByText('Bab 3 · Akan datang', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  await expect(page).toHaveURL(/\/play/);
  await expect(page.getByRole('button', { name: /Buka berkas pertama/ })).toBeVisible();
});

test('homepage fits requested widths, keeps CTA above fold and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const cta = page.getByRole('button', { name: /Mulai investigasi/ }).first();
    const rect = await cta.boundingBox();
    expect(rect!.y + rect!.height).toBeLessThan(await page.evaluate(() => innerHeight));
    expect(await cta.evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
    for (const image of await page.locator('.portal img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      expect(await image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
  }
});
