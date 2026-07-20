import type { BrowserContextOptions, LaunchOptions } from 'playwright';

export type SupportedEnvironment = 'local' | 'dev' | 'qa' | 'staging' | 'prod';
export type SupportedBrowser = 'chromium' | 'chrome' | 'msedge' | 'firefox' | 'webkit';
export type BrowserChannel = 'chrome' | 'msedge';
export type BrowserEngine = 'chromium' | 'firefox' | 'webkit';

export interface EnvironmentCredentials {
  username: string;
  password: string;
}

export interface EnvironmentConfig {
  name: SupportedEnvironment;
  baseUrl: string;
  loginPath: string;
  dashboardPath: string;
  browser: SupportedBrowser;
  headless: boolean;
  highlight: boolean;
  screenshotOnStep: boolean;
  video: boolean;
  trace: boolean;
  slowMo: number;
  timeout: number;
  actionTimeout: number;
  navigationTimeout: number;
  viewport: {
    width: number;
    height: number;
  };
  credentials: EnvironmentCredentials;
  contextOptions?: BrowserContextOptions;
  launchOptions?: LaunchOptions;
}
