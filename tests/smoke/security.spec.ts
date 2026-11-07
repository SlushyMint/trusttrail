import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';
import release from '../../vercel.json' with { type: 'json' };
import { enterChapterOne, saveKey } from './helpers';

const payload = '<img src=x onerror="window.__phase6Payload=true">';
test('malformed local saves and preferences never become markup, identity, or an unlocked report', async ({ page }) => {
  const outbound: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outbound.push(request.url()); });
  for (const value of ['not-json', 'null', '[]', JSON.stringify({ position: { kind: 'chapterComplete', chapterId: 'C3' }, authenticated: true, score: 100, name: payload }), JSON.stringify({ schemaVersion: 1, contentVersion: 'trusttrail-1', rubricVersion: 'v1', revision: 1, events: [{ type: 'run.started' }, { type: '__proto__', name: payload }] })]) {
    await page.goto('/guide');
    await page.evaluate(({ key, value, payload }) => { localStorage.setItem(key, value); localStorage.setItem('trusttrail:audio:v1', payload); localStorage.setItem('trusttrail:onboarding:v1', payload); }, { key: saveKey, value, payload });
    await page.goto('/report');
    await expect(page.getByRole('status', { name: 'Status penyimpanan' })).toBeVisible();
    await expect(page.getByText('Trust Report · Perjalanan Ari lengkap', { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => Object.hasOwn(window, '__phase6Payload'))).toBe(false);
    expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(value);
    await expect(page.locator('img[src="x"]')).toHaveCount(0);
  }
  expect(outbound).toEqual([]);
});

test('unexpected URL values stay inert and cannot redirect or inject content', async ({ page }) => {
  const outbound: string[] = [], popups: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outbound.push(request.url()); });
  page.on('popup', popup => popups.push(popup.url()));
  for (const app of [payload, 'javascript:window.__phase6Payload=true', '//invalid.example/', '__proto__']) {
    await page.goto(`/play?app=${encodeURIComponent(app)}&view=${encodeURIComponent(payload)}&message=${encodeURIComponent(payload)}&redirect=https://invalid.example`);
    await expect(page.getByRole('button', { name: /Mulai investigasi/ })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/play');
    expect(await page.evaluate(() => Object.hasOwn(window, '__phase6Payload'))).toBe(false);
    await expect(page.locator('a[href^="javascript:"], iframe, img[src="x"]')).toHaveCount(0);
  }
  expect(outbound).toEqual([]); expect(popups).toEqual([]);
});

test('simulated phishing remains internal and the source links have explicit safe navigation attributes', async ({ page }) => {
  const outbound: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outbound.push(request.url()); });
  await enterChapterOne(page);
  await page.getByRole('button', { name: /Periksa tujuan tautan/ }).click();
  await expect(page.locator('a[href*=".example"], iframe, form[action]')).toHaveCount(0);
  expect(outbound).toEqual([]);
  await page.goto('/');
  const links = await page.locator('a[href^="https:"]').evaluateAll(elements => elements.map(element => ({ href: element.getAttribute('href'), rel: element.getAttribute('rel'), target: element.getAttribute('target') })));
  expect(links).toHaveLength(1); // Intelligence shows one selected authored source at a time.
  expect(links[0]?.href).toMatch(/^https:\/\/(ojk\.go\.id|www\.komdigi\.go\.id|bpsdm\.komdigi\.go\.id)\//);
  expect(links[0]?.rel?.split(' ')).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
  expect(links[0]?.target).not.toBe('_blank');
});

test('production preview applies staged release headers; routes and missing assets remain distinct', async ({ request, page }, info) => {
  for (const path of ['/', '/play', '/guide', '/report', '/unknown-route']) {
    const response = await request.get(path); expect(response.status()).toBe(200);
    for (const header of release.headers[0]!.headers) expect(response.headers()[header.key.toLowerCase()]).toBe(header.value);
  }
  const missing = [];
  for (const path of ['/assets/phase6-missing.js', '/fonts/phase6-missing.woff2', '/pixel/phase6-missing.png']) {
    const response = await request.get(path); expect(response.status()).toBe(404); missing.push({ path, status: response.status(), type: response.headers()['content-type'] });
  }
  await page.goto('/unknown-route'); await expect(page.getByRole('heading', { name: 'Jejak ini belum ada.' })).toBeVisible();
  await info.attach('local-header-routing-evidence', { body: JSON.stringify({ headers: release.headers, missing }), contentType: 'application/json' });
});

test('release source and production output pass the non-secret-printing pattern scan', async () => {
  const scan = JSON.parse(execFileSync(process.execPath, ['scripts/audit-release-security.mjs'], { encoding: 'utf8' }));
  expect(scan.findings).toEqual([]); expect(scan.exposedConfiguration).toEqual([]);
  expect(scan.supplyChain.missingIntegrity).toEqual([]); expect(scan.supplyChain.nonRegistrySources).toEqual([]);
});

test('an unprotected local parent cannot frame the protected game', async ({ page }) => {
  const blocked: string[] = [];
  page.on('requestfailed', request => { if (new URL(request.url()).pathname === '/play') blocked.push(request.failure()?.errorText ?? ''); });
  await page.route('**/phase6-frame-parent', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Local framing fixture</title><iframe title="Controlled game frame" src="/play"></iframe></html>' }));
  await page.goto('/phase6-frame-parent');
  await expect.poll(() => blocked).toContain('net::ERR_BLOCKED_BY_RESPONSE');
});
