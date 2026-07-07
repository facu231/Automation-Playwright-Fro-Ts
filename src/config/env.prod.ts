import type { EnvironmentConfig } from './types';
import { localConfig } from './env.local';

export const prodConfig: EnvironmentConfig = {
  ...localConfig,
  name: 'prod',
  baseUrl: 'https://www.saucedemo.com',
  screenshotOnStep: false,
  video: false,
  trace: false
};
