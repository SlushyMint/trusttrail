import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import release from './vercel.json' with { type: 'json' };
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), {
    name: 'preview-static-boundaries',
    configurePreviewServer(server) {
      // Vite's default SPA fallback masks missing assets with HTML 200 responses.
      // Match the release rewrite exclusion so the local negative-path tests are meaningful.
      const files = new Set(readdirSync(resolve(server.config.root, server.config.build.outDir), { recursive: true, encoding: 'utf8' }).map(path => `/${path}`));
      server.middlewares.use((request, response, next) => {
        const path = new URL(request.url ?? '/', 'http://localhost').pathname;
        if ((path.includes('.') || /^\/(assets|fonts|pixel|artwork)\//.test(path)) && !files.has(path)) {
          response.statusCode = 404; response.end('Not found'); return;
        }
        next();
      });
    },
  }],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  // Exercise the exact staged release headers in every production-preview regression.
  preview: { host: '127.0.0.1', port: 4173, strictPort: true, headers: Object.fromEntries(release.headers[0]!.headers.map(header => [header.key, header.value])) },
});
