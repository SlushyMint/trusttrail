import { readdirSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { enterChapterOne, openGameApp, saveKey } from './helpers';
import { AUDIO_KEY, LEGACY_AUDIO_KEY } from '../../src/features/audio/preferences';

declare global {
  interface Window { __audioProbe: { contexts: AudioContext[]; frequencies: number[]; suspendCalls: number; closeCalls: number } }
}
async function observeAudio(page: Page, rejectFirst = false) {
  await page.addInitScript(reject => {
    const Native = window.AudioContext;
    const probe: Window['__audioProbe'] = { contexts: [], frequencies: [], suspendCalls: 0, closeCalls: 0 };
    window.__audioProbe = probe;
    let blocked = reject;
    window.AudioContext = class extends Native {
      constructor(options?: AudioContextOptions) { super(options); probe.contexts.push(this); }
      get state(): AudioContextState { return blocked ? 'suspended' : super.state; }
      resume() { if (blocked) { blocked = false; return Promise.reject(new DOMException('Controlled autoplay rejection', 'NotAllowedError')); } return super.resume(); }
      suspend() { probe.suspendCalls++; return super.suspend(); }
      close() { probe.closeCalls++; return super.close(); }
      createOscillator() {
        const oscillator = super.createOscillator(); const start = oscillator.start.bind(oscillator);
        oscillator.start = (when?: number) => { probe.frequencies.push(oscillator.frequency.value); start(when); };
        return oscillator;
      }
    };
  }, rejectFirst);
}
async function settings(page: Page) { await page.getByRole('button', { name: 'Suara', exact: true }).click(); return page.getByRole('dialog', { name: 'Pengaturan suara' }); }
async function closeSettings(page: Page) { await page.getByRole('button', { name: 'Tutup Pengaturan suara' }).click(); }
async function voices(page: Page) { return page.evaluate(() => window.__audioProbe.frequencies.length); }

test('SFX initializes only on an action, shares one context across apps, and suspends when idle', async ({ page }) => {
  await observeAudio(page); await page.goto('/play');
  const dialog = await settings(page);
  await expect(dialog.getByRole('checkbox')).toHaveCount(1);
  await expect(dialog.getByRole('checkbox', { name: 'Bisukan semua suara' })).not.toBeChecked();
  await expect(dialog.getByRole('slider', { name: /Volume efek suara/ })).toHaveValue('35');
  expect(await page.evaluate(() => window.__audioProbe.contexts.length)).toBe(0);
  await closeSettings(page);
  for (const app of ['Browser', 'Files', 'Messages', 'Case Files', 'Mail'] as const) await openGameApp(page, app);
  await expect.poll(() => voices(page)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => window.__audioProbe.contexts[0]?.state)).toBe('suspended');
  expect(await page.evaluate(() => window.__audioProbe.contexts.length)).toBe(1);
  const before = await voices(page); await openGameApp(page, 'Mail'); expect(await voices(page)).toBe(before);
});

test('discovery cues require accepted actions and never replay after refresh or duplicate inspection', async ({ page }) => {
  await observeAudio(page); await enterChapterOne(page);
  const before = await voices(page); await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  await expect.poll(() => voices(page)).toBe(before + 2);
  await page.getByRole('button', { name: /Periksa pengirim/ }).click(); await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  expect(await voices(page)).toBe(before + 2);
  const saved = await page.evaluate(key => localStorage.getItem(key), saveKey); await page.reload();
  await expect(page.getByRole('button', { name: /Periksa pengirim/ })).toBeVisible(); expect(await voices(page)).toBe(0);
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(saved);
});

test('keyboard mute and SFX volume restore without changing gameplay or replaying audio', async ({ page }) => {
  await observeAudio(page); await enterChapterOne(page);
  const saved = await page.evaluate(key => localStorage.getItem(key), saveKey);
  const dialog = await settings(page);
  const slider = dialog.getByRole('slider', { name: /Volume efek suara/ }); await slider.focus(); await page.keyboard.press('ArrowLeft'); await expect(slider).toHaveValue('30');
  await closeSettings(page);
  const mute = page.getByRole('button', { name: 'Bisukan semua suara', exact: true }); await mute.focus(); await page.keyboard.press('Space'); await expect(mute).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => window.__audioProbe.contexts[0]?.state)).toBe('suspended');
  await page.reload(); expect(await voices(page)).toBe(0);
  await settings(page); await expect(page.getByRole('slider', { name: /Volume efek suara/ })).toHaveValue('30');
  await expect(page.getByRole('checkbox', { name: 'Bisukan semua suara' })).toBeChecked();
  await page.getByRole('checkbox', { name: 'Bisukan semua suara' }).uncheck(); expect(await voices(page)).toBe(0);
  await closeSettings(page); await openGameApp(page, 'Browser'); await expect.poll(() => voices(page)).toBe(2);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), AUDIO_KEY)).toEqual({ version: 2, muted: false, volume: 0.3 });
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(saved);
});

test('legacy preferences preserve disabled SFX and volume while obsolete values are discarded', async ({ page }) => {
  await observeAudio(page);
  await page.addInitScript(key => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ version: 1, sfx: false, muted: false, volume: 0.2, music: { unexpected: 'ignored' } })); }, LEGACY_AUDIO_KEY);
  await page.goto('/play'); const dialog = await settings(page);
  await expect(dialog.getByRole('checkbox', { name: 'Bisukan semua suara' })).toBeChecked();
  const slider = dialog.getByRole('slider', { name: /Volume efek suara/ }); await expect(slider).toHaveValue('20');
  expect(await page.evaluate(key => localStorage.getItem(key), AUDIO_KEY)).toBeNull();
  await slider.focus(); await page.keyboard.press('ArrowRight'); await expect(slider).toHaveValue('25');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), AUDIO_KEY)).toEqual({ version: 2, muted: true, volume: 0.25 });
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBeNull();
  await page.reload(); expect(await voices(page)).toBe(0); await settings(page);
  await expect(page.getByRole('slider', { name: /Volume efek suara/ })).toHaveValue('25');
  await expect(page.getByRole('checkbox', { name: 'Bisukan semua suara' })).toBeChecked();
});

test('autoplay rejection permits explicit SFX retry without another context or gameplay action', async ({ page }) => {
  await observeAudio(page, true); await page.goto('/play');
  await page.getByRole('button', { name: /Mulai investigasi/ }).click();
  const saved = await page.evaluate(key => localStorage.getItem(key), saveKey);
  const dialog = await settings(page);
  await expect(dialog.getByRole('status', { name: 'Status audio' })).toContainText('belum mengizinkan'); expect(await voices(page)).toBe(0);
  await dialog.getByRole('button', { name: 'Coba audio' }).click(); await expect.poll(() => voices(page)).toBe(2);
  await expect(dialog.getByRole('status', { name: 'Status audio' })).toContainText('Efek suara mengikuti');
  expect(await page.evaluate(() => window.__audioProbe.contexts.length)).toBe(1);
  expect(await page.evaluate(key => localStorage.getItem(key), saveKey)).toBe(saved);
});

test('hidden tabs drop SFX, returning stays silent, and the next action resumes the existing context', async ({ page }) => {
  await observeAudio(page); await enterChapterOne(page);
  const hidden = async (value: boolean) => page.evaluate(value => { Object.defineProperty(document, 'hidden', { configurable: true, value }); document.dispatchEvent(new Event('visibilitychange')); }, value);
  await hidden(true); await expect.poll(() => page.evaluate(() => window.__audioProbe.contexts[0]?.state)).toBe('suspended');
  const before = await voices(page); await openGameApp(page, 'Browser'); expect(await voices(page)).toBe(before);
  await hidden(false); expect(await voices(page)).toBe(before); expect(await page.evaluate(() => window.__audioProbe.contexts[0]?.state)).toBe('suspended');
  await openGameApp(page, 'Files'); await expect.poll(() => voices(page)).toBe(before + 2);
  expect(await page.evaluate(() => window.__audioProbe.contexts.length)).toBe(1);
});

test('unsupported audio and blocked storage leave SFX controls and investigation usable', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'AudioContext', { value: undefined }); Storage.prototype.getItem = () => { throw new Error('blocked'); }; Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
  await enterChapterOne(page); await page.getByRole('button', { name: /Periksa pengirim/ }).click();
  await expect(page.locator('.discovery-receipt').filter({ hasText: 'Bukti tercatat' })).toHaveCount(1);
  const dialog = await settings(page); await expect(dialog.getByRole('status', { name: 'Status audio' })).toContainText('Audio tidak tersedia');
  const slider = dialog.getByRole('slider', { name: /Volume efek suara/ }); await slider.focus(); await page.keyboard.press('ArrowRight');
  await expect(dialog).toContainText('Preferensi suara hanya berlaku di tab ini'); await closeSettings(page);
  await page.getByRole('button', { name: 'Bisukan semua suara', exact: true }).click(); await expect(page.getByRole('button', { name: 'Bisukan semua suara', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('SFX controls fit five widths and the release contains no dedicated soundtrack chunk or audio requests', async ({ page }, info) => {
  expect(readdirSync('dist/assets').filter(name => name.startsWith('ambience-'))).toEqual([]);
  await observeAudio(page); const requests: string[] = []; page.on('request', request => requests.push(request.url())); await page.goto('/');
  expect(requests.some(url => /\.(mp3|ogg|wav)/.test(url))).toBe(false);
  expect(await page.evaluate(() => window.__audioProbe.contexts.length)).toBe(0);
  await page.goto('/play'); await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dialog = await settings(page); await expect(dialog).toBeVisible();
    const slider = dialog.getByRole('slider', { name: /Volume efek suara/ });
    await dialog.getByRole('button', { name: 'Tutup Pengaturan suara' }).focus();
    await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await expect(slider).toBeFocused();
    expect(await slider.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`audio-${width}.png`) });
    await page.keyboard.press('Escape'); await expect(dialog).not.toBeVisible(); await expect(page.getByRole('button', { name: 'Suara', exact: true })).toBeFocused();
  }
});
