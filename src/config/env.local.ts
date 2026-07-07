import type { EnvironmentConfig } from './types';

export const localConfig: EnvironmentConfig = {
  name: 'local',
  baseUrl: 'https://www.saucedemo.com',
  loginPath: '/',
  dashboardPath: '/inventory.html',
  browser: 'chromium',
  headless: true,
  highlight: false,
  screenshotOnStep: true,
  video: false,
  trace: true,
  slowMo: 0,
  timeout: 60_000,
  actionTimeout: 15_000,
  navigationTimeout: 30_000,
  viewport: {
    width: 1366,
    height: 768
  },
  credentials: {
    username: 'standard_user',
    password: 'secret_sauce'
  }
};
