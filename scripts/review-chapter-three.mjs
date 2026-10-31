/* global localStorage, document, innerWidth, getComputedStyle */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import process from 'node:process';

const out = 'docs/chapter-three-review';
await mkdir(out, { recursive: true });
const events = [{ type: 'run.started' }, { type: 'story.begun' }];
for (const [chapter, lines, option] of [['C1', 4, 'ignore'], ['C2', 3, 'share-data']]) {
  const decisionId = chapter === 'C1' ? 'D1' : 'D2';
  for (let lineIndex = 0; lineIndex < lines; lineIndex++) events.push({ type: 'line.advanced', nodeId: `${chapter}-intro`, lineIndex });
  if (chapter === 'C2') for (let stepIndex = 0; stepIndex < 3; stepIndex++) events.push({ type: 'conversation.advanced', conversationId: 'C2-CHAT', stepIndex });
  events.push({ type: 'decision.opened', decisionId }, { type: 'choice.committed', decisionId, optionId: option }, { type: 'outcome.continued', nodeId: `${decisionId}-${option}-outcome` }, { type: 'debrief.continued', nodeId: `${decisionId}-${option}-debrief` }, { type: 'chapter.continued', chapterId: chapter });
}
for (let lineIndex = 0; lineIndex < 3; lineIndex++) events.push({ type: 'line.advanced', nodeId: 'C3-intro', lineIndex });
events.push({ type: 'portal.opened', chapterId: 'C3' });
const save = { schemaVersion: 1, contentVersion: 'trusttrail-1', rubricVersion: 'v1', revision: 1, events };
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
const results = [];
try {
  for (const width of [1440, 768, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.addInitScript(value => { if (!localStorage.getItem('trusttrail:save:v1')) localStorage.setItem('trusttrail:save:v1', JSON.stringify(value)); }, save);
    await page.goto('http://127.0.0.1:4173/play?app=browser');
    await page.getByRole('heading', { name: 'Aktivasi kandidat', exact: true }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${out}/portal-${width}.png` });
    const measurements = await page.locator('.tt-portal-browser').evaluate(root => ({
      documentOverflow: document.documentElement.scrollWidth > innerWidth,
      portalOverflow: root.scrollWidth > root.clientWidth,
      smallTargets: [...root.querySelectorAll('button')].filter(button => button.getBoundingClientRect().height < 44).map(button => button.textContent),
      headings: [...root.querySelectorAll('h2,h3')].map(heading => ({ text: heading.textContent, lines: Math.round(heading.getBoundingClientRect().height / parseFloat(getComputedStyle(heading).lineHeight)) })),
      unsafeInputs: root.querySelectorAll('form,input[type=password],input[type=file],input[type=text]').length,
    }));
    results.push({ width, ...measurements });
    if (width === 1440) {
      const snapshot = (await page.content()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replaceAll('href="/assets/', 'href="http://127.0.0.1:4173/assets/');
      await writeFile(`${out}/portal-snapshot.html`, snapshot);
    }
    for (const name of ['Periksa alamat portal', 'Periksa indikator HTTPS', 'Periksa syarat verifikasi']) await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
    await page.screenshot({ path: `${out}/inspection-${width}.png` });
    await page.getByRole('button', { name: 'Direktori independen', exact: true }).click();
    await page.getByRole('button', { name: 'Baca prosedur resmi' }).click();
    await page.screenshot({ path: `${out}/comparison-${width}.png` });
    await page.getByRole('group', { name: 'Alamat portal resmi', exact: true }).getByRole('radio', { name: 'novatech.example/karier', exact: true }).check();
    await page.getByRole('button', { name: 'Cocokkan alamat portal resmi' }).click();
    await page.getByRole('group', { name: 'Syarat rekrutmen' }).getByRole('radio', { name: /Tidak meminta OTP/ }).check();
    await page.getByRole('button', { name: 'Cocokkan syarat rekrutmen' }).click();
    await page.getByRole('button', { name: 'Catat hasil perbandingan', exact: true }).click();
    await page.getByRole('button', { name: /Tentukan langkah Ari/ }).click();
    await page.getByRole('radio', { name: /Bagikan kode fiktif/ }).check();
    await page.getByRole('button', { name: 'Jalankan pilihan' }).click();
    await page.getByRole('button', { name: /Mulai misi pemulihan/ }).click();
    await page.screenshot({ path: `${out}/recovery-${width}.png` });
    await context.close();
  }
  await writeFile(`${out}/measurements.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); }
