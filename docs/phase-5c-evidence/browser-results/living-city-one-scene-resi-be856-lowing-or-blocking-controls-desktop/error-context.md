# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: living-city.spec.ts >> one scene resizes at all four requested widths without overflowing or blocking controls
- Location: tests/smoke/living-city.spec.ts:84:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: getByRole('button', { name: /Mulai investigasi/ }).first()
Expected: focused
Error: Test ended.

Call log:
  - Expect "toBeFocused" getByRole('button', { name: /Mulai investigasi/ }).first() with timeout 5000ms
  - waiting for getByRole('button', { name: /Mulai investigasi/ }).first()
  - Test ended.

```

# Test source

```ts
  5   |   const city = page.locator('.living-city');
  6   |   await expect(city).toHaveAttribute('data-city-status', 'ready');
  7   |   await expect(city.locator('canvas')).toHaveCount(1);
  8   |   await expect(city).toHaveAttribute('aria-hidden', 'true');
  9   |   expect(await city.evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none');
  10  |   await expect(city).toHaveAttribute('data-city-rendering', 'running');
  11  |   await page.getByRole('link', { name: 'Coba periksa', exact: true }).click();
  12  |   await expect(city).toHaveAttribute('data-city-rendering', 'paused');
  13  |   await page.getByRole('button', { name: 'Periksa alamat pengirim', exact: true }).click();
  14  |   await expect(page.locator('#practice-sender')).toBeVisible();
  15  |   await page.evaluate(() => scrollTo(0, 0));
  16  |   await expect(city).toHaveAttribute('data-city-rendering', 'running');
  17  |   await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  18  |   await expect(page).toHaveURL(/\/play/);
  19  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  20  | });
  21  | 
  22  | test('repeated client navigation owns one canvas and handles lost rendering', async ({ page }) => {
  23  |   const errors: string[] = [];
  24  |   page.on('pageerror', error => errors.push(error.message));
  25  |   await page.goto('/');
  26  |   for (let i = 0; i < 4; i++) {
  27  |     await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  28  |     await expect(page.locator('.living-city-canvas')).toHaveCount(1);
  29  |     await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  30  |     await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  31  |     await page.goBack();
  32  |   }
  33  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  34  |   await page.locator('.living-city-canvas').evaluate(el => el.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  35  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  36  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  37  |   await expect(page.locator('.living-city-fallback')).toBeVisible();
  38  |   await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  39  |   await expect(page).toHaveURL(/\/play/);
  40  |   expect(errors).toEqual([]);
  41  | });
  42  | 
  43  | test('homepage works when the lazy renderer cannot be downloaded', async ({ page }) => {
  44  |   await page.route('**/createCityScene-*.js', route => route.abort());
  45  |   await page.goto('/');
  46  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  47  |   await expect(page.locator('.living-city-fallback')).toBeVisible();
  48  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  49  |   await page.getByRole('link', { name: 'Buka Bab 1: Undangan tanpa lamaran' }).click();
  50  |   await expect(page).toHaveURL(/\/play/);
  51  | });
  52  | 
  53  | test('reduced motion avoids renderer downloads and supports a live preference change', async ({ page }) => {
  54  |   const rendererRequests: string[] = [];
  55  |   page.on('request', request => { if (/createCityScene-/.test(request.url())) rendererRequests.push(request.url()); });
  56  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  57  |   await page.goto('/');
  58  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'reduced-motion');
  59  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  60  |   expect(rendererRequests).toEqual([]);
  61  |   await page.emulateMedia({ reducedMotion: 'no-preference' });
  62  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  63  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  64  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'reduced-motion');
  65  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  66  | });
  67  | 
  68  | test('init can finish after client navigation without appending a stale canvas', async ({ page }) => {
  69  |   let release!: () => void;
  70  |   let requested!: () => void;
  71  |   const requestedPromise = new Promise<void>(resolve => { requested = resolve; });
  72  |   const gate = new Promise<void>(resolve => { release = resolve; });
  73  |   await page.route('**/WebGLRenderer-*.js', async route => { requested(); await gate; await route.continue(); });
  74  |   await page.goto('/');
  75  |   await requestedPromise;
  76  |   await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  77  |   release();
  78  |   await expect(page.locator('.living-city-canvas')).toHaveCount(0);
  79  |   await page.goBack();
  80  |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  81  |   await expect(page.locator('.living-city-canvas')).toHaveCount(1);
  82  | });
  83  | 
  84  | test('one scene resizes at all four requested widths without overflowing or blocking controls', async ({ page }) => {
  85  |   await page.goto('/');
  86  |   const city = page.locator('.living-city');
  87  |   await expect(city).toHaveAttribute('data-city-status', 'ready');
  88  |   for (const width of [1440, 768, 390, 360]) {
  89  |     await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
  90  |     // Measure one settled frame per width; separate renderer round trips can consume
  91  |     // the whole test budget on software WebGL even when every assertion passes.
  92  |     await expect.poll(() => page.evaluate(() => {
  93  |       const canvases = document.querySelectorAll('.living-city canvas');
  94  |       const canvas = canvases[0];
  95  |       const button = document.querySelector('.portal-start button');
  96  |       return {
  97  |         canvasCount: canvases.length,
  98  |         canvasFits: !!canvas && Math.abs(canvas.getBoundingClientRect().width - canvas.parentElement!.clientWidth) <= 1,
  99  |         documentFits: document.documentElement.scrollWidth <= innerWidth,
  100 |         buttonAboveFold: !!button && button.getBoundingClientRect().bottom < innerHeight,
  101 |       };
  102 |     })).toEqual({ canvasCount: 1, canvasFits: true, documentFits: true, buttonAboveFold: true });
  103 |     const button = page.getByRole('button', { name: /Mulai investigasi/ }).first();
  104 |     await button.focus();
> 105 |     await expect(button).toBeFocused();
      |                          ^ Error: expect(locator).toBeFocused() failed
  106 |   }
  107 | });
  108 | 
  109 | test('unsupported WebGL keeps the static city and start control available', async ({ page }) => {
  110 |   await page.addInitScript(() => {
  111 |     const getContext = HTMLCanvasElement.prototype.getContext;
  112 |     const original = getContext as (this: HTMLCanvasElement, type: string, options?: unknown) => RenderingContext | null;
  113 |     HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, options?: unknown) {
  114 |       if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
  115 |       return original.call(this, type, options);
  116 |     } as typeof getContext;
  117 |   });
  118 |   await page.goto('/');
  119 |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  120 |   await expect(page.locator('.living-city-fallback')).toBeVisible();
  121 |   await expect(page.locator('.living-city canvas')).toHaveCount(0);
  122 |   await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  123 |   await expect(page).toHaveURL(/\/play/);
  124 | });
  125 | 
  126 | test('a missing city layer selects the static composite and leaves navigation usable', async ({ page }) => {
  127 |   await page.route(/\/city-mid(-compact)?\.webp$/, route => route.abort());
  128 |   await page.goto('/');
  129 |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'fallback');
  130 |   await expect(page.locator('.living-city canvas')).toHaveCount(0);
  131 |   await expect(page.locator('.living-city-fallback img')).toHaveAttribute('src', '/assets/living-city/city-static.webp');
  132 |   await page.getByRole('link', { name: 'Lanjut perjalanan menuju Bab 2: Perekrut yang ramah' }).click();
  133 |   await expect(page).toHaveURL(/\/play/);
  134 | });
  135 | 
  136 | test('navigation during texture loading cancels the old scene without damaging its replacement', async ({ page }) => {
  137 |   const errors: string[] = [];
  138 |   page.on('pageerror', error => errors.push(error.message));
  139 |   let requested!: () => void;
  140 |   const requestStarted = new Promise<void>(resolve => { requested = resolve; });
  141 |   let release!: () => void;
  142 |   const gate = new Promise<void>(resolve => { release = resolve; });
  143 |   await page.route(/\/city-mid(-compact)?\.webp$/, async route => { requested(); await gate; await route.continue().catch(() => {}); });
  144 |   await page.goto('/', { waitUntil: 'domcontentloaded' });
  145 |   await requestStarted;
  146 |   await page.getByRole('link', { name: 'Panduan & privasi' }).click();
  147 |   release();
  148 |   await expect(page.locator('.living-city canvas')).toHaveCount(0);
  149 |   await page.goBack();
  150 |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  151 |   await expect(page.locator('.living-city canvas')).toHaveCount(1);
  152 |   expect(errors).toEqual([]);
  153 | });
  154 | 
  155 | test('reduced motion downloads the static artwork without loading animated layer textures', async ({ page }) => {
  156 |   const requested: string[] = [];
  157 |   page.on('request', request => { if (request.url().includes('/assets/living-city/')) requested.push(new URL(request.url()).pathname); });
  158 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  159 |   await page.goto('/');
  160 |   await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'reduced-motion');
  161 |   const compact = (page.viewportSize()?.width ?? 1440) < 768;
  162 |   expect(requested).toEqual([`/assets/living-city/city-static${compact ? '-compact' : ''}.webp`]);
  163 |   await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  164 |   await expect(page).toHaveURL(/\/play/);
  165 | });
  166 | 
```