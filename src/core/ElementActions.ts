import type { Locator, Page } from 'playwright';
import { HighlightManager } from './HighlightManager';
import { resolveLocator } from './locator';
import type { LocatorTarget } from './locator';

type SelectOptionValue = string | string[] | { value?: string; label?: string; index?: number };
type FilePayload = { name: string; mimeType: string; buffer: Buffer };
type UploadValue = string | string[] | FilePayload | FilePayload[];

export class ElementActions {
  constructor(
    private readonly page: Page,
    private readonly highlightManager: HighlightManager
  ) {}

  async click(target: LocatorTarget): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await this.withHighlight(locator, () => locator.click());
  }

  async doubleClick(target: LocatorTarget): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await this.withHighlight(locator, () => locator.dblclick());
  }

  async fill(target: LocatorTarget, value: string): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await this.withHighlight(locator, () => locator.fill(value));
  }

  async clear(target: LocatorTarget): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await this.withHighlight(locator, () => locator.clear());
  }

  async typeText(target: LocatorTarget, value: string, delay = 0): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await this.withHighlight(locator, () => locator.type(value, { delay }));
  }

  async pressKey(target: LocatorTarget, key: string): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await this.withHighlight(locator, () => locator.press(key));
  }

  async selectOption(target: LocatorTarget, value: SelectOptionValue): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await this.withHighlight(locator, () => locator.selectOption(value));
  }

  async scrollToElement(target: LocatorTarget): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await locator.scrollIntoViewIfNeeded();
  }

  async hover(target: LocatorTarget): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await this.withHighlight(locator, () => locator.hover());
  }

  async getText(target: LocatorTarget): Promise<string> {
    return (await resolveLocator(this.page, target).innerText()).trim();
  }

  async getAttribute(target: LocatorTarget, attributeName: string): Promise<string | null> {
    return resolveLocator(this.page, target).getAttribute(attributeName);
  }

  async uploadFile(target: LocatorTarget, files: UploadValue): Promise<void> {
    const locator = resolveLocator(this.page, target);
    await this.withHighlight(locator, () => locator.setInputFiles(files));
  }

  private async withHighlight(locator: Locator, action: () => Promise<unknown>): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await this.highlightManager.highlight(locator);

    try {
      await action();
    } finally {
      await this.highlightManager.remove(locator);
    }
  }
}
