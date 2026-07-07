import { defineConfig, devices } from '@playwright/test';
import { ConfigManager } from './src/core/ConfigManager';

const envConfig = ConfigManager.load();

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
      use: devices['Desktop Chrome']
    }
  ],
  reporter: [
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
    ['json', { outputFile: 'reports/playwright/results.json' }]
  ]
});
