import type { EnvironmentConfig } from './types';
import { localConfig } from './env.local';

export const qaConfig: EnvironmentConfig = {
  ...localConfig,
  name: 'qa',
  baseUrl: 'https://www.saucedemo.com',
  video: true,
  trace: true
};
