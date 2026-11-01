/* global document, Image */
// Format encoding and technical emission masks only; original artwork comes from image_gen.
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { log } from 'node:console';
import { Buffer } from 'node:buffer';

const ids = ['sky-far', 'city-back', 'city-mid', 'city-front', 'office-props'];
const destination = 'public/assets/living-city';
await mkdir(destination, { recursive: true });
await mkdir('docs/living-city-phase-b', { recursive: true });
const inputs = await Promise.all(ids.map(async id => ({ id, data: `data:image/png;base64,${(await readFile(`.cache/living-city-source/${id}.png`)).toString('base64')}` })));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  const encoded = await page.evaluate(async inputs => {
    const images = await Promise.all(inputs.map(async input => {
      const image = new Image();
      image.src = input.data;
      await image.decode();
      return { id: input.id, image };
    }));
    const outputs = [];
    const composite = document.createElement('canvas');
    composite.width = images[0].image.naturalWidth;
    composite.height = images[0].image.naturalHeight;
    const compositeContext = composite.getContext('2d');
    for (const { id, image } of images) {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0, translucent = 0, opaque = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) transparent++;
        else if (data[i] === 255) opaque++;
        else translucent++;
      }
      outputs.push({ id, width: canvas.width, height: canvas.height, transparent, translucent, opaque, data: canvas.toDataURL('image/webp', .9) });
      compositeContext.drawImage(image, 0, 0);
      if (id === 'city-mid') {
        const mask = context.createImageData(canvas.width, canvas.height);
        let lightPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b, a] = data.subarray(i, i + 4);
          const amber = r > 110 && g > 65 && r > g * 1.15 && r > b * 1.6;
          const teal = g > 125 && g > r * 1.1 && b > 75 && g > b * .9;
          if (a > 160 && (amber || teal)) {
            mask.data.set(data.subarray(i, i + 4), i);
            lightPixels++;
          }
        }
        context.putImageData(mask, 0, 0);
        outputs.push({ id: 'city-mid-lights', width: canvas.width, height: canvas.height, lightPixels, data: canvas.toDataURL('image/webp', .95) });
      }
    }
    outputs.push({ id: 'city-static', width: composite.width, height: composite.height, data: composite.toDataURL('image/webp', .88) });
    return outputs;
  }, inputs);
  const inventory = [];
  for (const { data, ...info } of encoded) {
    const bytes = Buffer.from(data.split(',')[1], 'base64');
    await writeFile(`${destination}/${info.id}.webp`, bytes);
    inventory.push({ ...info, bytes: bytes.length, src: `/assets/living-city/${info.id}.webp` });
  }
  await writeFile('docs/living-city-phase-b/asset-inventory.json', JSON.stringify({ encoder: 'Chrome Canvas WebP, quality 0.90 layers / 0.95 emission mask / 0.88 static composite; no resampling, no reference-panel crops, generated alpha preserved.', assets: inventory }, null, 2) + '\n');
  log(JSON.stringify(inventory));
} finally { await browser.close(); }
