import { expect, test, type Locator, type Page } from '@playwright/test';
import { enterChapterOne, readRun } from './helpers';

async function dragWindow(page: Page, window: Locator, dx: number, dy: number) {
  const title = await window.locator('.px-titlebar h2').boundingBox();
  await page.mouse.move(title!.x + 12, title!.y + title!.height / 2);
  await page.mouse.down();
  await page.mouse.move(title!.x + 12 + dx, title!.y + title!.height / 2 + dy, { steps: 12 });
  await page.mouse.up();
}

async function insideWorkspace(page: Page, window: Locator) {
  const area = await page.locator('#os-main').boundingBox();
  const box = await window.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(area!.x - 1);
  expect(box!.y).toBeGreaterThanOrEqual(area!.y - 1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(area!.x + area!.width + 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(area!.y + area!.height + 1);
}

test('desktop dragging, bounds, cancellation and window controls never write game state', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterChapterOne(page);
  const saved = await readRun(page);
  const journal = page.locator('#os-app-journal');
  const before = await journal.boundingBox();
  await dragWindow(page, journal, -170, -85);
  const moved = await journal.boundingBox();
  expect(moved!.x).toBeLessThan(before!.x - 100);
  expect(moved!.y).toBeLessThan(before!.y - 40);
  await expect(journal).toHaveAttribute('data-active', 'true');
  expect(await journal.evaluate(el => Number(getComputedStyle(el).zIndex))).toBeGreaterThan(await page.locator('#os-app-mail').evaluate(el => Number(getComputedStyle(el).zIndex)));
  await page.getByRole('button', { name: 'Maksimalkan Case Files', exact: true }).click();
  await expect(journal).toHaveClass(/is-maximized/);
  await page.getByRole('button', { name: 'Pulihkan Case Files', exact: true }).click();
  const restored = await journal.boundingBox();
  expect(restored!.x).toBeCloseTo(moved!.x, 0);
  expect(restored!.y).toBeCloseTo(moved!.y, 0);
  await page.getByRole('button', { name: 'Minimalkan Case Files', exact: true }).click();
  await expect(journal).toBeHidden();
  await page.getByRole('button', { name: 'Tampilkan Case Files', exact: true }).click();
  await expect(journal).toBeVisible();
  expect((await journal.boundingBox())!.x).toBeCloseTo(moved!.x, 0);

  const title = await journal.locator('.px-titlebar h2').boundingBox();
  await page.mouse.move(title!.x + 10, title!.y + 8); await page.mouse.down();
  await page.mouse.move(title!.x - 100, title!.y + 40, { steps: 8 });
  await page.keyboard.press('Escape'); await page.mouse.up();
  expect((await journal.boundingBox())!.x).toBeCloseTo(moved!.x, 0);
  await dragWindow(page, journal, -1600, -1200);
  await insideWorkspace(page, journal);
  await dragWindow(page, journal, 2000, 1500);
  await insideWorkspace(page, journal);
  await page.locator('#os-menu-trigger').click();
  await page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: 'Rapikan jendela', exact: true }).click();
  await expect.poll(async () => (await journal.boundingBox())!.x).toBeCloseTo(before!.x, 0);
  expect(await readRun(page)).toEqual(saved);
});

test('click and keyboard placement support comparison, reset and mobile reflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterChapterOne(page);
  const saved = await readRun(page);
  await page.getByRole('button', { name: 'Mail & sumber berdampingan', exact: true }).click();
  const mail = page.locator('#os-app-mail'), source = page.locator('#os-app-browser');
  await expect(mail).toHaveAttribute('data-slot', 'left');
  await expect(source).toHaveAttribute('data-slot', 'right');
  const a = await mail.boundingBox(), b = await source.boundingBox();
  expect(a!.x + a!.width).toBeLessThan(b!.x);
  await expect(page.getByRole('button', { name: 'Periksa pengirim', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Periksa catatan lowongan', exact: true })).toBeVisible();
  await page.getByLabel('Atur posisi Browser', { exact: true }).focus();
  await page.keyboard.press('ArrowUp');
  await expect.poll(async () => (await source.boundingBox())!.y).toBeLessThan(b!.y - 10);
  await page.keyboard.press('Enter');
  await source.getByRole('button', { name: 'Geser Browser ke atas', exact: true }).click();
  await expect.poll(async () => (await source.boundingBox())!.y).toBeLessThan(b!.y - 35);
  await source.getByRole('button', { name: 'Sisi kiri', exact: true }).click();
  await expect(source).toHaveAttribute('data-slot', 'left');
  await page.getByRole('button', { name: 'Rapikan jendela', exact: true }).click();
  await expect(source).not.toHaveAttribute('data-slot');
  expect(await source.evaluate(el => getComputedStyle(el).transform)).toBe('none');
  await page.getByLabel('Atur posisi Browser', { exact: true }).focus();
  for (let step = 0; step < 16; step++) await page.keyboard.press('Shift+ArrowLeft');
  await insideWorkspace(page, source);
  for (let step = 0; step < 16; step++) await page.keyboard.press('Shift+ArrowUp');
  await insideWorkspace(page, source);
  await page.keyboard.press('Home');
  await dragWindow(page, source, 160, 20);
  await page.setViewportSize({ width: 1120, height: 700 });
  await expect.poll(() => source.evaluate(el => { const r = el.getBoundingClientRect(); return r.right <= innerWidth + 1 && r.bottom <= innerHeight - 53; })).toBe(true);
  await page.getByRole('button', { name: 'Mail & sumber berdampingan', exact: true }).click();
  await expect(page.getByRole('button', { name: /Tentukan langkah/ })).toBeInViewport({ ratio: 1 });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.trusttrail-os')).toHaveAttribute('data-os', 'saku');
  await expect(page.locator('.os-draggable-titlebar')).toHaveCount(0);
  await expect.poll(() => source.evaluate(el => getComputedStyle(el).transform)).toBe('none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  // Viewport updates precede React's shell commit; measure one settled shell.
  await expect(page.locator('.trusttrail-os')).toHaveAttribute('data-os', 'desktop');
  await insideWorkspace(page, source);
  expect(await readRun(page)).toEqual(saved);
});

test('Motion respects reduced motion while desktop drag remains direct and homepage content stays visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /Mulai investigasi/ }).first()).toBeVisible();
    expect(await page.locator('.portal-game-preview').evaluate(el => getComputedStyle(el).transform)).toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole('button', { name: 'Periksa alamat pengirim' }).click();
  await expect(page.locator('.portal-notebook [role=status]')).toContainText('Nama tampilan bukan identitas.');
  await enterChapterOne(page);
  const journal = page.locator('#os-app-journal');
  const before = await journal.boundingBox();
  await dragWindow(page, journal, -100, -60);
  expect((await journal.boundingBox())!.x).toBeLessThan(before!.x - 50);
  await insideWorkspace(page, journal);
});
