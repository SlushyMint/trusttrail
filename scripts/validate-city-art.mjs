/* global document, Image */
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { log } from 'node:console';
import assert from 'node:assert/strict';

const inventory = JSON.parse(await readFile('docs/living-city-phase-b/asset-inventory.json', 'utf8'));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4173/guide');
  const result = await page.evaluate(async assets => {
    const pixels = new Map();
    const stats = [];
    for (const asset of assets) {
      const image = new Image();
      image.src = asset.src;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      pixels.set(asset.id, data);
      const histogram = { zero: 0, low: 0, mid: 0, high: 0, nearOpaque: 0, opaque: 0 };
      let upperQuarterNonTransparent = 0;
      let upperQuarterVisiblePixels = 0;
      let upperQuarterMaxAlpha = 0;
      for (let i = 3; i < data.length; i += 4) {
        const a = data[i];
        histogram[a === 0 ? 'zero' : a < 16 ? 'low' : a < 128 ? 'mid' : a < 240 ? 'high' : a < 255 ? 'nearOpaque' : 'opaque']++;
        if (i < canvas.width * Math.floor(canvas.height / 4) * 4) {
          if (a !== 0) upperQuarterNonTransparent++;
          if (a >= 16) upperQuarterVisiblePixels++;
          upperQuarterMaxAlpha = Math.max(upperQuarterMaxAlpha, a);
        }
      }
      stats.push({ id: asset.id, width: canvas.width, height: canvas.height, upperQuarterNonTransparent, upperQuarterVisiblePixels, upperQuarterMaxAlpha, histogram });
    }
    let lightsOutsideBuildings = 0;
    const lights = pixels.get('city-mid-lights');
    const buildings = pixels.get('city-mid');
    for (let i = 3; i < lights.length; i += 4) if (lights[i] !== 0 && buildings[i] === 0) lightsOutsideBuildings++;
    return { stats, lightsOutsideBuildings };
  }, inventory.assets);
  await writeFile('docs/living-city-phase-b/asset-validation.json', JSON.stringify(result, null, 2) + '\n');
  for (const asset of result.stats) {
    assert.equal(asset.width, 1672);
    assert.equal(asset.height, 941);
    if (asset.id === 'sky-far' || asset.id === 'city-static') assert.equal(asset.histogram.opaque, 1672 * 941);
    else {
      assert.ok(asset.histogram.zero > 1672 * 941 * .5);
      // Generated alpha can contain a few almost-invisible pixels, but no visible sky/matte.
      assert.equal(asset.upperQuarterVisiblePixels, 0);
    }
  }
  assert.equal(result.lightsOutsideBuildings, 0);
  log(JSON.stringify(result));
} finally { await browser.close(); }
