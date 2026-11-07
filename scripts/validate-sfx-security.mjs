/* global window, document, localStorage, innerWidth, getComputedStyle, URL, fetch, setTimeout */
import process from 'node:process';
import { log } from 'node:console';
import { spawn } from 'node:child_process';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import { homedir } from 'node:os';
import { join } from 'node:path';

const { probe } = await import(process.env.TRUSTTRAIL_DESIGN_PROBE || join(homedir(), '.agents/skills/design-taste-frontend/scripts/lib/probe.mjs'));
const out = 'docs/phase-6-sfx-evidence';
const url = 'http://127.0.0.1:4173';
await mkdir(out, { recursive: true });
const preview = spawn('npm', ['run', 'preview', '--', '--strictPort'], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
let serverOutput = '';
preview.stdout.on('data', value => { serverOutput += value; });
preview.stderr.on('data', value => { serverOutput += value; });
let browser;
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (preview.exitCode !== null) throw new Error(serverOutput);
    try { if ((await fetch(url)).ok) break; } catch { /* Wait for our local preview. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || '/usr/bin/chromium-browser', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const outbound = [], errors = [];
  page.on('request', request => { if (new URL(request.url()).origin !== url) outbound.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const state = window.__sfxProbe = { contexts: [], created: 0, live: 0, violations: [] };
    document.addEventListener('securitypolicyviolation', event => state.violations.push({ directive: event.effectiveDirective, blocked: event.blockedURI, disposition: event.disposition }));
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      constructor(options) { super(options); state.contexts.push(this); }
      createOscillator() {
        const voice = super.createOscillator(); const start = voice.start.bind(voice); const disconnect = voice.disconnect.bind(voice);
        let connected = false;
        const released = () => { if (connected) { state.live--; connected = false; } };
        voice.start = time => { state.created++; state.live++; connected = true; start(time); };
        voice.disconnect = (...args) => { released(); return disconnect(...args); };
        voice.addEventListener('ended', released);
        return voice;
      }
    };
  });
  await page.goto(url);
  await expect(page.locator('.living-city')).toHaveAttribute('data-city-status', 'ready');
  const initialContexts = await page.evaluate(() => window.__sfxProbe.contexts.length);
  const csp = await page.evaluate(() => window.__sfxProbe.violations);
  await page.getByRole('button', { name: /Mulai investigasi/ }).first().click();
  await page.getByRole('button', { name: /Buka berkas pertama/ }).click();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
  await page.getByRole('button', { name: /Periksa undangan/ }).click();
  await page.getByRole('button', { name: 'Lewati tutorial' }).click();
  await expect.poll(() => page.evaluate(() => window.__sfxProbe.live)).toBe(0);
  const saved = await page.evaluate(() => localStorage.getItem('trusttrail:save:v1'));
  for (let i = 0; i < 20; i++) await page.getByRole('button', { name: `Tampilkan ${i % 2 ? 'Mail' : 'Browser'}`, exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__sfxProbe.live)).toBe(0);
  const settled = await page.evaluate(() => ({ contexts: window.__sfxProbe.contexts.length, liveSources: window.__sfxProbe.live, state: window.__sfxProbe.contexts[0].state, createdSources: window.__sfxProbe.created }));
  const idleTime = await page.evaluate(() => window.__sfxProbe.contexts[0].currentTime);
  await page.waitForTimeout(300);
  const idleClockAdvance = await page.evaluate(time => window.__sfxProbe.contexts[0].currentTime - time, idleTime);

  const visual = [];
  for (const width of [320, 360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('.trusttrail-os')).toHaveAttribute('data-os', width >= 1120 ? 'desktop' : 'saku');
    await page.getByRole('button', { name: 'Suara', exact: true }).click();
    await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
    const measurements = await page.evaluate(probe);
    const controls = await page.locator('.drawer[open] input').evaluateAll(elements => elements.map(element => { const rect = element.getBoundingClientRect(); const hit = element.type === 'checkbox' ? element.closest('label').getBoundingClientRect() : rect; return { type: element.type, targetWidth: hit.width, targetHeight: hit.height, focusOutline: getComputedStyle(element).outlineStyle }; }));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    await page.screenshot({ path: `${out}/audio-controls-${width}.png` });
    visual.push({ width, overflow, controls, probe: measurements });
    await page.keyboard.press('Escape');
  }
  // A throttled small-screen reading interval should have no active sound sources.
  await page.setViewportSize({ width: 390, height: 844 });
  const session = await context.newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await session.send('Performance.enable');
  await session.send('HeapProfiler.collectGarbage');
  const metrics = async () => Object.fromEntries((await session.send('Performance.getMetrics')).metrics.map(item => [item.name, item.value]));
  const before = await metrics(); await page.waitForTimeout(1500); const after = await metrics();
  const sameSave = saved === await page.evaluate(() => localStorage.getItem('trusttrail:save:v1'));
  const result = { method: 'Real desktop Chromium, twenty app switches, five-width controls, 390px/4x renderer CPU throttling during a 1.5s idle interval. Not physical-device DSP/battery measurement.', initialContexts, settled, idleClockAdvance, idleMainThreadMs: (after.TaskDuration - before.TaskDuration) * 1000, beforeHeap: before.JSHeapUsedSize, afterHeap: after.JSHeapUsedSize, sameSave, outbound, pageErrors: errors, csp, releaseFiles: (await readdir('dist/assets')).length };
  await writeFile(`${out}/sfx-performance.json`, JSON.stringify(result, null, 2));
  await writeFile(`${out}/audio-design-probe.json`, JSON.stringify(visual, null, 2));
  log(JSON.stringify(result, null, 2));
  expect(initialContexts).toBe(0); expect(settled.contexts).toBe(1); expect(settled.liveSources).toBe(0); expect(settled.state).toBe('suspended');
  expect(idleClockAdvance).toBe(0); expect(visual.every(item => item.overflow === 0)).toBe(true);
  expect(sameSave).toBe(true); expect(outbound).toEqual([]); expect(errors).toEqual([]);
  expect(csp.filter(item => item.disposition === 'enforce')).toEqual([]);
} finally {
  await browser?.close();
  if (preview.pid) { try { process.kill(-preview.pid, 'SIGTERM'); } catch { /* Already exited. */ } }
}
