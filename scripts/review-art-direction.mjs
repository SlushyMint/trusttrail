import { build, preview } from 'vite';
import { resolve } from 'node:path';
import { log } from 'node:console';
import process from 'node:process';

// Explicit review build only. The default production entry/config remains unchanged.
const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, '.cache', 'art-direction-build');
await build({
  root,
  build: {
    outDir,
    emptyOutDir: false,
    rolldownOptions: { input: { main: resolve(root, 'index.html'), review: resolve(root, 'art-direction.html'), dual: resolve(root, 'dual-os.html') } },
  },
});
if (!process.argv.includes('--build-only')) {
  const server = await preview({ root, build: { outDir }, preview: { host: '127.0.0.1', port: 4384, strictPort: true } });
  server.printUrls();
  log('Review prototype: http://127.0.0.1:4384/art-direction.html');
  log('Dual-OS design review: http://127.0.0.1:4384/dual-os.html');
  log('Local preview only. Press Ctrl+C to stop. Game-wide adoption awaits Product Owner review.');
}
