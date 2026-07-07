import type { EnvironmentConfig } from './types';
import { localConfig } from './env.local';

export const stagingConfig: EnvironmentConfig = {
  ...localConfig,
  name: 'staging',
  baseUrl: 'https://www.saucedemo.com',
  video: true,
  trace: true
};
