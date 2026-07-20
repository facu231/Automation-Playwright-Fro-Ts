import { defineConfig } from '@playwright/test';
import { ConfigManager } from './src/core/ConfigManager';

const envConfig = ConfigManager.load();
const browserName =
  envConfig.browser === 'firefox' || envConfig.browser === 'webkit' ? envConfig.browser : 'chromium';
const channel =
  envConfig.browser === 'chrome' || envConfig.browser === 'msedge' ? envConfig.browser : undefined;

export default defineConfig({
  timeout: envConfig.timeout,
  expect: {
    timeout: envConfig.actionTimeout
  },
  use: {
    baseURL: envConfig.baseUrl,
    headless: envConfig.headless,
    viewport: envConfig.viewport,
    actionTimeout: envConfig.actionTimeout,
    navigationTimeout: envConfig.navigationTimeout,
    trace: envConfig.trace ? 'retain-on-failure' : 'off',
    video: envConfig.video ? 'retain-on-failure' : 'off',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: envConfig.browser,
      use: {
        browserName,
        channel
      }
    }
  ],
  reporter: [
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
    ['json', { outputFile: 'reports/playwright/results.json' }]
  ]
});
