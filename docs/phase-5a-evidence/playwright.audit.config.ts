import base from '../../playwright.config';
import { defineConfig } from '@playwright/test';
export default defineConfig(base, {
 testDir: '../../tests/smoke',
 outputDir: './browser-results',
 webServer: undefined,
 use: { channel: undefined, launchOptions: { executablePath: '/usr/bin/chromium-browser' } },
});
