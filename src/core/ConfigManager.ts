import 'dotenv/config';
import { devConfig } from '../config/env.dev';
import { localConfig } from '../config/env.local';
import { prodConfig } from '../config/env.prod';
import { qaConfig } from '../config/env.qa';
import { parseRuntimeEnv } from '../config/env.schema';
import { stagingConfig } from '../config/env.staging';
import type { EnvironmentConfig, SupportedEnvironment } from '../config/types';

const configs: Record<SupportedEnvironment, EnvironmentConfig> = {
  local: localConfig,
  dev: devConfig,
  qa: qaConfig,
  staging: stagingConfig,
  prod: prodConfig
};

export class ConfigManager {
  private static currentConfig?: EnvironmentConfig;

  static load(forceReload = false): EnvironmentConfig {
    if (!this.currentConfig || forceReload) {
      const env = parseRuntimeEnv();
      const baseConfig = configs[env.TEST_ENV];

      this.currentConfig = {
        ...baseConfig,
        baseUrl: env.BASE_URL ?? baseConfig.baseUrl,
        browser: env.BROWSER ?? baseConfig.browser,
        headless: env.HEADLESS ?? baseConfig.headless,
        highlight: env.HIGHLIGHT ?? baseConfig.highlight,
        screenshotOnStep: env.SCREENSHOT_ON_STEP ?? baseConfig.screenshotOnStep,
        video: env.VIDEO ?? baseConfig.video,
        trace: env.TRACE ?? baseConfig.trace,
        slowMo: env.SLOW_MO ?? baseConfig.slowMo,
        timeout: env.TEST_TIMEOUT ?? baseConfig.timeout,
        actionTimeout: env.ACTION_TIMEOUT ?? baseConfig.actionTimeout,
        navigationTimeout: env.NAVIGATION_TIMEOUT ?? baseConfig.navigationTimeout,
        credentials: {
          username: env.TEST_USERNAME ?? baseConfig.credentials.username,
          password: env.TEST_PASSWORD ?? baseConfig.credentials.password
        }
      };
    }

    return this.currentConfig;
  }

  static buildUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }

    return new URL(pathOrUrl, this.load().baseUrl).toString();
  }
}
