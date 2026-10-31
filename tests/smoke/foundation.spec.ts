import { expect, test } from '@playwright/test';
import { enterChapterOne, openGameApp } from './helpers';

test('routes, fresh-run states and direct refresh work without external requests', async ({ page, isMobile }) => {
  const errors: string[] = [];
  const outbound: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) outbound.push(request.url()); });
  for (const [route, heading] of [['/', /Undangan kerja\.\s*Atau perangkap\?/], ['/play', isMobile ? 'Mail' : 'Undangan tanpa lamaran'], ['/report', 'Catatan refleksi'], ['/guide', 'Tentang simulasi'], ['/missing', 'Jejak ini belum ada.']] as const) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading, { useInnerText: true });
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading, { useInnerText: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
  expect(outbound).toEqual([]);
  expect(await page.locator('input[type="password"], input[type="file"], form').count()).toBe(0);
});

test('native app menu traps focus, closes with Escape and returns focus', async ({ page }) => {
  await page.goto('/play');
  const trigger = page.locator('#os-menu-trigger');
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Menu TrustTrail' });
  const close = dialog.getByRole('button', { name: 'Tutup Menu TrustTrail' });
  await expect(close).toBeFocused();
  for (const key of ['Tab', 'Tab', 'Shift+Tab', 'Shift+Tab']) {
    await page.keyboard.press(key);
    expect(await dialog.evaluate(element => element.contains(document.activeElement) || document.activeElement === document.body)).toBe(true);
  }
  await close.focus();
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('keyboard app navigation and reduced motion remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enterChapterOne(page);
  await openGameApp(page, 'Case Files');
  await expect(page.getByRole('region', { name: 'Case Files', exact: true })).toBeVisible();
  await page.locator('#os-menu-trigger').focus();
  await page.keyboard.press('Enter');
  const guide = page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('link', { name: 'Panduan', exact: true });
  await guide.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tentang simulasi');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  expect(await page.getByRole('link', { name: 'TrustTrail, beranda' }).evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
});
