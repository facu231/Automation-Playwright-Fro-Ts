import type { Locator, Page } from 'playwright';
import { ConfigManager } from './ConfigManager';
import { ElementActions } from './ElementActions';
import { ElementAssertions } from './ElementAssertions';
import { HighlightManager } from './HighlightManager';
import { resolveLocator } from './locator';
import type { LocatorTarget } from './locator';

export abstract class BaseComponent {
  protected readonly root: Locator;
  protected readonly actions: ElementActions;
  protected readonly assertions: ElementAssertions;

  constructor(
    protected readonly page: Page,
    root: LocatorTarget
  ) {
    this.root = resolveLocator(page, root);
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
