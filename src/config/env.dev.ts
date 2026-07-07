import type { EnvironmentConfig } from './types';
import { localConfig } from './env.local';

export const devConfig: EnvironmentConfig = {
  ...localConfig,
  name: 'dev',
  baseUrl: 'https://www.saucedemo.com'
};
