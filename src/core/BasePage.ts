import type { Page } from 'playwright';
import type { EnvironmentConfig } from '../config/types';
import { ConfigManager } from './ConfigManager';
import { ElementActions } from './ElementActions';
import { ElementAssertions } from './ElementAssertions';
import { HighlightManager } from './HighlightManager';
import { ScreenshotManager } from './ScreenshotManager';
import { WaitManager } from './WaitManager';

export abstract class BasePage {
  protected readonly actions: ElementActions;
  protected readonly assertions: ElementAssertions;
  protected readonly highlight: HighlightManager;
  protected readonly screenshots: ScreenshotManager;
  protected readonly wait: WaitManager;

  constructor(
    protected readonly page: Page,
    protected readonly config: EnvironmentConfig = ConfigManager.load()
  ) {
    this.highlight = new HighlightManager(config.highlight);
    this.actions = new ElementActions(page, this.highlight);
    this.assertions = new ElementAssertions(page);
    this.wait = new WaitManager(page);
    this.screenshots = new ScreenshotManager(page, 'manual');
  }

  async navigate(pathOrUrl: string): Promise<void> {
    await this.page.goto(ConfigManager.buildUrl(pathOrUrl), {
      waitUntil: 'domcontentloaded',
      timeout: this.config.navigationTimeout
    });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  getUrl(): string {
    return this.page.url();
  }

  async waitForPageReady(): Promise<void> {
    await this.wait.forLoadState('domcontentloaded');
  }
}
