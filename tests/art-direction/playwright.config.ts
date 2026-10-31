import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'game-first.spec.ts',
  outputDir: '../../.cache/game-first-test-results',
  reporter: 'list',
  workers: 3,
  use: { baseURL: process.env.TRUSTTRAIL_REVIEW_URL || 'http://127.0.0.1:5176', channel: 'chrome', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1000 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 }, defaultBrowserType: 'chromium' } },
  ],
  webServer: process.env.TRUSTTRAIL_REVIEW_URL ? undefined : {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5176 --strictPort',
    cwd: process.cwd(), url: 'http://127.0.0.1:5176/art-direction.html', reuseExistingServer: !process.env.CI,
  },
});
