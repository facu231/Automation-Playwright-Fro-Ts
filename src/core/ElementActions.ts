import type { Locator, Page } from 'playwright';
import { HighlightManager } from './HighlightManager';

type SelectOptionValue = string | string[] | { value?: string; label?: string; index?: number };
type FilePayload = { name: string; mimeType: string; buffer: Buffer };
type UploadValue = string | string[] | FilePayload | FilePayload[];

export class ElementActions {
  constructor(
    private readonly page: Page,
    private readonly highlightManager: HighlightManager
  ) {}

  async click(target: Locator | string): Promise<void> {
    const locator = this.locator(target);
    await this.withHighlight(locator, () => locator.click());
  }

  async doubleClick(target: Locator | string): Promise<void> {
    const locator = this.locator(target);
    await this.withHighlight(locator, () => locator.dblclick());
  }

  async fill(target: Locator | string, value: string): Promise<void> {
    const locator = this.locator(target);
    await this.withHighlight(locator, () => locator.fill(value));
  }

  async clear(target: Locator | string): Promise<void> {
    const locator = this.locator(target);
    await this.withHighlight(locator, () => locator.clear());
  }

  async typeText(target: Locator | string, value: string, delay = 0): Promise<void> {
    const locator = this.locator(target);
    await this.withHighlight(locator, () => locator.type(value, { delay }));
  }

  async pressKey(target: Locator | string, key: string): Promise<void> {
    const locator = this.locator(target);
    await this.withHighlight(locator, () => locator.press(key));
  }

  async selectOption(target: Locator | string, value: SelectOptionValue): Promise<void> {
    const locator = this.locator(target);
    await this.withHighlight(locator, () => locator.selectOption(value));
  }

  async scrollToElement(target: Locator | string): Promise<void> {
    const locator = this.locator(target);
    await locator.scrollIntoViewIfNeeded();
  }

  async hover(target: Locator | string): Promise<void> {
    const locator = this.locator(target);
    await this.withHighlight(locator, () => locator.hover());
  }

  async getText(target: Locator | string): Promise<string> {
    return (await this.locator(target).innerText()).trim();
  }

  async getAttribute(target: Locator | string, attributeName: string): Promise<string | null> {
    return this.locator(target).getAttribute(attributeName);
  }

  async uploadFile(target: Locator | string, files: UploadValue): Promise<void> {
    const locator = this.locator(target);
    await this.withHighlight(locator, () => locator.setInputFiles(files));
  }

  private locator(target: Locator | string): Locator {
    return typeof target === 'string' ? this.page.locator(target).first() : target.first();
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
