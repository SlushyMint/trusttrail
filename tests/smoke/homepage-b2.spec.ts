import { expect, test } from '@playwright/test';

test('native scroll choreography reverses and reduced motion settles every presentation layer', async ({ page }, info) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const city = page.locator('.living-city');
  await expect(city).toHaveAttribute('data-city-status', 'ready');
  const showcaseY = () => page.locator('.portal-showcase').evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(showcaseY).toBe(0);
  await page.evaluate(() => scrollTo(0, 320));
  if (info.project.name === 'desktop') await expect.poll(showcaseY).toBeLessThan(-1);
  else await expect.poll(showcaseY).toBe(0);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(showcaseY).toBe(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(city.locator('canvas')).toHaveCount(0);
  await page.evaluate(() => scrollTo(0, 350));
  await expect.poll(showcaseY).toBe(0);
  const states = await page.locator('[data-investigation-motion]').evaluateAll(els => els.map(el => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform })));
  expect(states.every(state => state.opacity === '1' && state.transform === 'none')).toBe(true);
  await page.locator('.portal-start .button').first().focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/play/);
});

test('rapid OS selections keep final content, focus, save and geometry stable', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const stored = await page.evaluate(() => JSON.stringify(localStorage));
  const tabs = page.getByRole('group', { name: 'Aplikasi pratinjau' });
  const previewHeight = (await page.locator('.portal-game-preview').boundingBox())!.height;
  for (const name of ['Browser', 'Case Files', 'Browser', 'Mail', 'Case Files']) {
    const tab = tabs.getByRole('button', { name, exact: true });
    await tab.focus();
    await page.keyboard.press('Space');
    await expect(tab).toBeFocused();
    await expect(tab).toHaveAttribute('aria-pressed', 'true');
  }
  await expect(page.locator('#os-preview-content')).toContainText('Jejak yang kamu temukan.');
  await expect(tabs.locator('[aria-pressed=true]')).toHaveCount(1);
  expect((await page.locator('.portal-game-preview').boundingBox())!.height).toBeCloseTo(previewHeight, 1);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(stored);
});

test('rapid archive selections keep content, focus, save, geometry and return navigation stable', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const stored = await page.evaluate(() => JSON.stringify(localStorage));
  // Recreate the preceding preview state while keeping archive failures independent.
  const cases = page.getByRole('group', { name: 'Aplikasi pratinjau' }).getByRole('button', { name: 'Case Files', exact: true });
  await cases.focus();
  await page.keyboard.press('Space');
  await expect(cases).toHaveAttribute('aria-pressed', 'true');
  const files = page.locator('.portal-intel-files button');
  const terminalHeight = (await page.locator('.portal-intelligence').boundingBox())!.height;
  for (const index of [1, 2, 0, 2]) {
    await files.nth(index).focus();
    await page.keyboard.press('Enter');
    await expect(files.nth(index)).toBeFocused();
  }
  await expect(page.locator('.portal-stat-number')).toHaveText('36,3%');
  await expect(page.locator('#intel-detail')).toContainText('Survei IMDI 2025');
  expect((await page.locator('.portal-intelligence').boundingBox())!.height).toBeCloseTo(terminalHeight, 1);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(stored);
  // Continue the keyboard journey without racing End scrolling against click auto-scroll.
  const returnToTop = page.getByRole('link', { name: 'Kembali ke awal' });
  await returnToTop.focus();
  await expect(returnToTop).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#portal-title$/);
  await expect(page.locator('#portal-title')).toBeInViewport();
});

test('repeated homepage visits release detached DOM and event listeners', async ({ page }) => {
  // Six full renderer lifecycles plus forced GC measure retention, not one UI response.
  // Keep the normal assertion deadlines; allow this diagnostic to finish under software WebGL.
  test.setTimeout(60_000);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  async function readMetrics() {
    await cdp.send('HeapProfiler.collectGarbage');
    const { metrics } = await cdp.send('Performance.getMetrics');
    return Object.fromEntries(metrics.filter(metric => ['Nodes', 'JSEventListeners'].includes(metric.name)).map(metric => [metric.name, metric.value]));
  }
  await page.goto('/');
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  const baseline = await readMetrics();
  for (let cycle = 0; cycle < 6; cycle++) {
    await page.goBack();
    await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
    await page.getByRole('link', { name: 'Panduan & privasi' }).click();
    await expect(page.locator('.living-city canvas')).toHaveCount(0);
  }
  // Runtime caches may warm, but old homepage trees/listeners must be released.
  await expect.poll(async () => (await readMetrics()).Nodes!).toBeLessThanOrEqual(baseline.Nodes! + 12);
  await expect.poll(async () => (await readMetrics()).JSEventListeners!).toBeLessThanOrEqual(baseline.JSEventListeners!);
});
