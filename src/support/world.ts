import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';
import type { EnvironmentConfig } from '../config/types';
import { ConfigManager } from '../core/ConfigManager';
import { ReporterManager } from '../core/ReporterManager';
import { ScreenshotManager } from '../core/ScreenshotManager';
import { LoginPage } from '../pages/LoginPage';
import { PageFactory } from '../pages/PageFactory';

export class CustomWorld extends World {
  config: EnvironmentConfig;
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  pages?: PageFactory;
  screenshotManager?: ScreenshotManager;
  reporterManager?: ReporterManager;
  scenarioName = 'unknown-scenario';

  constructor(options: IWorldOptions) {
    super(options);
    this.config = ConfigManager.load();
  }

  init(browser: Browser, context: BrowserContext, page: Page, scenarioName: string): void {
    this.browser = browser;
    this.context = context;
    this.page = page;
    this.scenarioName = scenarioName;
    this.pages = new PageFactory(page, this.config);
    this.screenshotManager = new ScreenshotManager(page, scenarioName);
    this.reporterManager = new ReporterManager(scenarioName);
  }

  getPage(): Page {
    if (!this.page) {
      throw new Error('Playwright page was not initialized. Check Cucumber Before hook.');
    }

    return this.page;
  }

  getLoginPage(): LoginPage {
    if (!this.pages) {
      throw new Error('PageFactory was not initialized. Check CustomWorld.init.');
    }

    return this.pages.login();
  }
}

setWorldConstructor(CustomWorld);
