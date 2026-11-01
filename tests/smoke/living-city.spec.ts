import { expect, test } from '@playwright/test';

test('city canvas remains behind HTML and pauses outside the hero', async ({ page }) => {
  await page.goto('/');
  const city = page.locator('.living-city');
  await expect(city).toHaveAttribute('data-city-status', 'ready');
  await expect(city.locator('canvas')).toHaveCount(1);
  await expect(city).toHaveAttribute('aria-hidden', 'true');
  expect(await city.evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none');
  await expect(city).toHaveAttribute('data-city-rendering', 'running');
  await page.getByRole('link', { name: 'Coba periksa', exact: true }).click();
  await expect(city).toHaveAttribute('data-city-rendering', 'paused');
  await page.getByRole('button', { name: 'Periksa alamat pengirim', exact: true }).click();
  await expect(page.locator('#practice-sender')).toBeVisible();
  await page.evaluate(() => scrollTo(0, 0));
  await expect(city).toHaveAttribute('data-city-rendering', 'running');
  await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  await expect(page).toHaveURL(/\/play/);
  await expect(page.locator('.living-city-canvas')).toHaveCount(0);
});

test('repeated client navigation owns one canvas and handles lost rendering', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  for (let i = 0; i < 4; i++) {
    await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
    await expect(page.locator('.living-city-canvas')).toHaveCount(1);
    await page.getByRole('link', { name: 'Panduan & privasi' }).click();
    await expect(page.locator('.living-city-canvas')).toHaveCount(0);
    await page.goBack();
  }
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  await page.locator('.living-city-canvas').evaluate(el => el.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  await expect(page.locator('.living-city-fallback')).toBeVisible();
  await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  await expect(page).toHaveURL(/\/play/);
  expect(errors).toEqual([]);
});

test('homepage works when the lazy renderer cannot be downloaded', async ({ page }) => {
  await page.route('**/createCityScene-*.js', route => route.abort());
  await page.goto('/');
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  await expect(page.locator('.living-city-fallback')).toBeVisible();
  await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Buka Bab 1: Undangan tanpa lamaran' }).click();
  await expect(page).toHaveURL(/\/play/);
});

test('reduced motion avoids renderer downloads and supports a live preference change', async ({ page }) => {
  const rendererRequests: string[] = [];
  page.on('request', request => { if (/createCityScene-/.test(request.url())) rendererRequests.push(request.url()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'reduced-motion');
  await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  expect(rendererRequests).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'reduced-motion');
  await expect(page.locator('.living-city-canvas')).toHaveCount(0);
});

test('init can finish after client navigation without appending a stale canvas', async ({ page }) => {
  let release!: () => void;
  let requested!: () => void;
  const requestedPromise = new Promise<void>(resolve => { requested = resolve; });
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/WebGLRenderer-*.js', async route => { requested(); await gate; await route.continue(); });
  await page.goto('/');
  await requestedPromise;
  await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  release();
  await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  await page.goBack();
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  await expect(page.locator('.living-city-canvas')).toHaveCount(1);
});

test('one scene resizes at all four requested widths without overflowing or blocking controls', async ({ page }) => {
  await page.goto('/');
  const city = page.locator('.living-city');
  await expect(city).toHaveAttribute('data-city-status', 'ready');
  for (const width of [1440, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await expect(city.locator('canvas')).toHaveCount(1);
    await expect.poll(() => city.locator('canvas').evaluate(el => Math.abs(el.getBoundingClientRect().width - el.parentElement!.clientWidth))).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const button = page.getByRole('button', { name: /Mulai investigasi/ }).first();
    const bounds = await button.boundingBox();
    expect(bounds!.y + bounds!.height).toBeLessThan(await page.evaluate(() => innerHeight));
    await button.focus();
    await expect(button).toBeFocused();
  }
});

test('unsupported WebGL keeps the static city and start control available', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    const original = getContext as (this: HTMLCanvasElement, type: string, options?: unknown) => RenderingContext | null;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, options?: unknown) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, options);
    } as typeof getContext;
  });
  await page.goto('/');
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  await expect(page.locator('.living-city-fallback')).toBeVisible();
  await expect(page.locator('.living-city canvas')).toHaveCount(0);
  await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  await expect(page).toHaveURL(/\/play/);
});

test('a missing city layer selects the static composite and leaves navigation usable', async ({ page }) => {
  await page.route(/\/city-mid(-compact)?\.webp$/, route => route.abort());
  await page.goto('/');
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  await expect(page.locator('.living-city canvas')).toHaveCount(0);
  await expect(page.locator('.living-city-fallback img')).toHaveAttribute('src', '/assets/living-city/city-static.webp');
  await page.getByRole('link', { name: 'Lanjut perjalanan menuju Bab 2: Perekrut yang ramah' }).click();
  await expect(page).toHaveURL(/\/play/);
});

test('navigation during texture loading cancels the old scene without damaging its replacement', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  let requested!: () => void;
  const requestStarted = new Promise<void>(resolve => { requested = resolve; });
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/city-mid(-compact)?\.webp$/, async route => { requested(); await gate; await route.continue().catch(() => {}); });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await requestStarted;
  await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  release();
  await expect(page.locator('.living-city canvas')).toHaveCount(0);
  await page.goBack();
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  await expect(page.locator('.living-city canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('reduced motion downloads the static artwork without loading animated layer textures', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', request => { if (request.url().includes('/assets/living-city/')) requested.push(new URL(request.url()).pathname); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'reduced-motion');
  const compact = (page.viewportSize()?.width ?? 1440) < 768;
  expect(requested).toEqual([`/assets/living-city/city-static${compact ? '-compact' : ''}.webp`]);
  await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  await expect(page).toHaveURL(/\/play/);
});
