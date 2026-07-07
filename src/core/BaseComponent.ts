import type { Locator, Page } from 'playwright';
import { ConfigManager } from './ConfigManager';
import { ElementActions } from './ElementActions';
import { ElementAssertions } from './ElementAssertions';
import { HighlightManager } from './HighlightManager';

export abstract class BaseComponent {
  protected readonly root: Locator;
  protected readonly actions: ElementActions;
  protected readonly assertions: ElementAssertions;

  constructor(
    protected readonly page: Page,
    root: Locator | string
  ) {
    this.root = typeof root === 'string' ? page.locator(root).first() : root.first();
    const highlight = new HighlightManager(ConfigManager.load().highlight);
    this.actions = new ElementActions(page, highlight);
    this.assertions = new ElementAssertions(page);
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async waitUntilVisible(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }
}
