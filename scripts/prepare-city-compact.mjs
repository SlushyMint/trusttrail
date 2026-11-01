/* global document, Image */
// Technical mobile exports of the approved Phase B artwork; no new creative assets.
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { log } from 'node:console';

const ids = ['sky-far', 'city-back', 'city-mid', 'city-front', 'office-props', 'city-mid-lights', 'city-static'];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  const inventory = [];
  for (const id of ids) {
    const original = await readFile(`public/assets/living-city/${id}.webp`);
    const data = await page.evaluate(async src => {
      const img = new Image(); img.src = src; await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(img.naturalWidth / 2); canvas.height = Math.ceil(img.naturalHeight / 2);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      // Uniform 0.5 scale retains aspect ratio; the final row is a half-pixel bleed.
      ctx.scale(.5, .5); ctx.drawImage(img, 0, 0);
      return canvas.toDataURL('image/webp', .88);
    }, `data:image/webp;base64,${original.toString('base64')}`);
    const bytes = Buffer.from(data.split(',')[1], 'base64');
    const path = `public/assets/living-city/${id}-compact.webp`;
    await writeFile(path, bytes);
    inventory.push({ path, width: 836, height: 471, bytes: bytes.length, source: `${id}.webp`, scale: .5 });
  }
  await writeFile('docs/phase-b1-review/compact-assets.json', JSON.stringify(inventory, null, 2));
  log(JSON.stringify(inventory));
} finally { await browser.close(); }
