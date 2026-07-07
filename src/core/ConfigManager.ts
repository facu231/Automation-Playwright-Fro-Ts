import { devConfig } from '../config/env.dev';
import { localConfig } from '../config/env.local';
import { prodConfig } from '../config/env.prod';
import { qaConfig } from '../config/env.qa';
import { stagingConfig } from '../config/env.staging';
import type { EnvironmentConfig, SupportedBrowser, SupportedEnvironment } from '../config/types';

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
      const envName = this.getEnvironmentName();
      const baseConfig = configs[envName];

      this.currentConfig = {
        ...baseConfig,
        baseUrl: process.env.BASE_URL ?? baseConfig.baseUrl,
        browser: this.getBrowser(baseConfig.browser),
        headless: this.getBoolean('HEADLESS', baseConfig.headless),
        highlight: this.getBoolean('HIGHLIGHT', baseConfig.highlight),
        screenshotOnStep: this.getBoolean('SCREENSHOT_ON_STEP', baseConfig.screenshotOnStep),
        video: this.getBoolean('VIDEO', baseConfig.video),
        trace: this.getBoolean('TRACE', baseConfig.trace),
        slowMo: this.getNumber('SLOW_MO', baseConfig.slowMo),
        timeout: this.getNumber('TEST_TIMEOUT', baseConfig.timeout),
        actionTimeout: this.getNumber('ACTION_TIMEOUT', baseConfig.actionTimeout),
        navigationTimeout: this.getNumber('NAVIGATION_TIMEOUT', baseConfig.navigationTimeout),
        credentials: {
          username: process.env.TEST_USERNAME ?? baseConfig.credentials.username,
          password: process.env.TEST_PASSWORD ?? baseConfig.credentials.password
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

  private static getEnvironmentName(): SupportedEnvironment {
    const requestedEnvironment = (process.env.TEST_ENV ?? 'local').toLowerCase();

    if (!this.isSupportedEnvironment(requestedEnvironment)) {
      throw new Error(
        `Unsupported TEST_ENV "${requestedEnvironment}". Valid values: ${Object.keys(configs).join(', ')}`
      );
    }

    return requestedEnvironment;
  }

  private static isSupportedEnvironment(value: string): value is SupportedEnvironment {
    return Object.prototype.hasOwnProperty.call(configs, value);
  }

  private static getBrowser(defaultBrowser: SupportedBrowser): SupportedBrowser {
    const requestedBrowser = (process.env.BROWSER ?? defaultBrowser).toLowerCase();
    const browsers: SupportedBrowser[] = ['chromium', 'firefox', 'webkit'];

    if (!browsers.includes(requestedBrowser as SupportedBrowser)) {
      throw new Error(`Unsupported BROWSER "${requestedBrowser}". Valid values: ${browsers.join(', ')}`);
    }

    return requestedBrowser as SupportedBrowser;
  }

  private static getBoolean(name: string, defaultValue: boolean): boolean {
    const value = process.env[name];

    if (value === undefined) {
      return defaultValue;
    }

    return ['true', '1', 'yes', 'y'].includes(value.toLowerCase());
  }

  private static getNumber(name: string, defaultValue: number): number {
    const value = process.env[name];

    if (value === undefined) {
      return defaultValue;
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new Error(`${name} must be numeric. Received: ${value}`);
    }

    return parsed;
  }
}
