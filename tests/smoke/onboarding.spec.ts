import { test, expect } from '@playwright/test';
import { enterChapterOne, openGameApp, openMail, saveKey } from './helpers';
const tutorial = (page: import('@playwright/test').Page) => page.getByRole('complementary', { name: 'Tutorial investigasi' });
test('real tutorial journey preserves save and resumes interrupted steps', async ({ page }, info) => {
  await enterChapterOne(page);
  const before = await page.evaluate(key => localStorage.getItem(key), saveKey);
  await expect(tutorial(page)).toContainText('Selamat datang');
  await page.screenshot({ animations: 'disabled', path: `docs/phase-5d-evidence/${info.project.name}-welcome.png` });
  await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  await page.reload();
  await expect(tutorial(page)).toContainText('Mulai dari Mail');
  for (const [app, stage] of [['Mail', 'mail'], ['Browser', 'browser'], ['Case Files', 'cases']] as const) {
    await page.screenshot({ animations: 'disabled', path: `docs/phase-5d-evidence/${info.project.name}-${stage}.png` });
    await openGameApp(page, app);
  }
  await expect(tutorial(page)).toContainText('Peralatanmu sudah siap');
  await page.screenshot({ animations: 'disabled', path: `docs/phase-5d-evidence/${info.project.name}-ready.png` });
  await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).click();
  await expect(tutorial(page)).toHaveCount(0);
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(before);
  await page.reload();
  await expect(tutorial(page)).toHaveCount(0);
});
test('skip, collect evidence, replay and keyboard dismissal preserve progress', async ({ page }) => {
  await enterChapterOne(page);
  await page.getByRole('button', { name: 'Lewati tutorial', exact: true }).click();
  await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  const before = await page.evaluate(key => localStorage.getItem(key), saveKey);
  await page.goto('/guide');
  await page.getByRole('button', { name: 'Ulangi tutorial' }).click();
  await expect(tutorial(page)).toContainText('Selamat datang');
  await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).focus();
  await page.keyboard.press('Space');
  await openGameApp(page, 'Browser');
  await expect(tutorial(page)).toContainText('Mulai dari Mail');
  await page.keyboard.press('Escape');
  await expect(tutorial(page)).toHaveCount(0);
  await openMail(page);
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(before);
});
for (const width of [320, 360, 390, 768, 1440]) test(`tutorial fits ${width}px with reduced motion`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await enterChapterOne(page);
  await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  await openGameApp(page, 'Mail');
  await openGameApp(page, 'Browser');
  await openGameApp(page, 'Case Files');
  const box = await tutorial(page).boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).click();
});
test('keyboard app activation and missing launch target never trap the player', async ({ page }) => {
  await enterChapterOne(page);
  await expect(tutorial(page).getByRole('heading', { name: 'Selamat datang di TrustTrail OS.' })).toBeFocused();
  await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).focus();
  await page.keyboard.press('Enter');
  for (const name of ['Mail', 'Browser', 'Case Files'] as const) {
    const desktop = await page.locator('.trusttrail-os').getAttribute('data-os') === 'desktop';
    if (desktop) {
      await page.getByRole('button', { name: `Tampilkan ${name}`, exact: true }).focus();
    } else {
      await page.getByRole('button', { name: 'Ganti aplikasi', exact: true }).focus();
      await page.keyboard.press('Enter');
      await page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: new RegExp(`^${name}`) }).focus();
    }
    await page.keyboard.press('Enter');
    const id = name === 'Case Files' ? 'journal' : name.toLowerCase();
    await expect(page).toHaveURL(new RegExp(`app=${id === 'journal' ? 'cases' : id}`));
    await expect(page.locator(`#os-app-${id}`)).toHaveAttribute('data-active', 'true');
    // Let the new route finish its documented heading-focus restoration before
    // focusing the next launcher; otherwise that effect can steal the next Enter.
    if (name !== 'Case Files') {
      if (desktop) await expect(page.locator(`#os-app-${id} [data-window-heading]`)).toBeFocused();
      else {
        await expect(page.locator('.saku-app-header h1')).toHaveText(name);
        await expect(page.locator('.saku-app-header h1')).toBeFocused();
      }
    }
  }
  // Ready can appear before the concurrent Case Files route commits. Complete
  // only after that actual app selection has settled, as a player would observe.
  await expect(page).toHaveURL(/app=cases/);
  if (await page.locator('.trusttrail-os').getAttribute('data-os') === 'saku') {
    await expect(page.locator('.saku-app-header h1')).toHaveText('Case Files');
  }
  await expect(tutorial(page).getByRole('heading', { name: 'Peralatanmu sudah siap.' })).toBeFocused();
  await page.getByRole('button', { name: 'Mulai Investigasi', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(tutorial(page)).toHaveCount(0);
  await expect(page.locator(await page.locator('.trusttrail-os').getAttribute('data-os') === 'desktop' ? '#task-journal' : '#os-menu-trigger')).toBeFocused();
  await page.goto('/guide');
  await page.getByRole('button', { name: 'Ulangi tutorial' }).click();
  await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  await page.locator('[data-tutorial-target=true]').evaluateAll(elements => elements.forEach(element => element.remove()));
  await expect(tutorial(page)).toContainText('Mulai dari Mail');
  await page.getByRole('button', { name: 'Lewati tutorial' }).click();
  await expect(tutorial(page)).toHaveCount(0);
});

test('skip inside the modal menu restores reachable focus', async ({ page }) => {
  await enterChapterOne(page);
  await page.getByRole('button', { name: 'Mulai Tutorial', exact: true }).click();
  await page.locator('#os-menu-trigger').click();
  await page.getByRole('button', { name: 'Lewati tutorial' }).click();
  await expect(tutorial(page)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Tutup Menu TrustTrail' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#os-menu-trigger')).toBeFocused();
});
