import { expect, test } from '@playwright/test';
import { enterChapterOne, readRun, saveKey, openGameApp } from './helpers';

test('OS application browsing is keyboard accessible and never creates gameplay progress', async ({ page }) => {
  await page.goto('/play');
  const before = await page.evaluate(key => localStorage.getItem(key), saveKey);
  await page.locator('#os-menu-trigger').focus();
  await page.keyboard.press('Enter');
  const cases = page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: /^Case Files/ });
  await cases.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('region', { name: 'Case Files', exact: true })).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(before);
  await page.getByRole('link', { name: 'TrustTrail, beranda' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  // The retained OS also owns a start button; target the arriving homepage explicitly.
  await page.locator('.portal').getByRole('button', { name: /Mulai investigasi/ }).first().click();
  await expect(page.getByRole('button', { name: /Buka berkas pertama/ })).toBeVisible();
});

test('interactive homepage preview reserves layout while city artwork is delayed', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/city-mid(-compact)?\.webp$/, async route => { await gate; await route.continue(); });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  const frame = page.locator('.portal-game-preview');
  const before = await frame.evaluate(element => ({ width: (element as HTMLElement).offsetWidth, height: (element as HTMLElement).offsetHeight }));
  await expect(page.locator('#os-preview-content')).toContainText('Undangan tahap akhir');
  await expect(page.getByRole('button', { name: /Mulai investigasi/ }).first()).toBeVisible();
  release();
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  const after = await frame.evaluate(element => ({ width: (element as HTMLElement).offsetWidth, height: (element as HTMLElement).offsetHeight }));
  expect(before).not.toBeNull(); expect(after).not.toBeNull();
  expect(after!.width).toBeCloseTo(before!.width, 1);
  expect(after!.height).toBeCloseTo(before!.height, 1);
  await expect(page.getByRole('button', { name: /Mulai investigasi/ }).first()).toBeVisible();
});

test('failed wallpaper leaves the OS, narrative and game actions usable', async ({ page }) => {
  await page.route('**/pixel/relay-coast.png', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  await expect(page.getByRole('button', { name: /Buka berkas pertama/ })).toBeVisible();
  await page.getByRole('button', { name: /Buka berkas pertama/ }).click();
  await expect(page.getByRole('region', { name: 'Cerita Ari' })).toContainText('Tiga bulan setelah lulus');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('touch and keyboard discovery feedback respects reduced motion and records only one clue', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enterChapterOne(page);
  const inspect = page.getByRole('button', { name: /Periksa pengirim/ });
  const before = await readRun(page);
  await inspect.focus();
  expect(await readRun(page)).toEqual(before);
  if (isMobile) await inspect.tap(); else await page.keyboard.press('Enter');
  await expect(page.locator('.discovery-receipt')).toContainText('Bukti tercatat: Alamat di balik nama pengirim.');
  expect(await page.locator('.discovery-receipt').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await inspect.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  await inspect.click(); await inspect.click();
  expect((await readRun(page)).events.filter(event => event.type === 'evidence.inspected')).toHaveLength(1);
  await openGameApp(page, 'Case Files');
  await expect(page.getByRole('region', { name: 'Case Files', exact: true }).getByRole('heading', { name: 'Alamat di balik nama pengirim' })).toBeVisible();
});
