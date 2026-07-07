import { expect } from '@playwright/test';
import type { Locator, Page } from 'playwright';

export class ElementAssertions {
  constructor(private readonly page: Page) {}

  async assertVisible(target: Locator | string, timeout?: number): Promise<void> {
    await expect(this.locator(target)).toBeVisible({ timeout });
  }

  async assertHidden(target: Locator | string, timeout?: number): Promise<void> {
    await expect(this.locator(target)).toBeHidden({ timeout });
  }

  async assertEnabled(target: Locator | string, timeout?: number): Promise<void> {
    await expect(this.locator(target)).toBeEnabled({ timeout });
  }

  async assertDisabled(target: Locator | string, timeout?: number): Promise<void> {
    await expect(this.locator(target)).toBeDisabled({ timeout });
  }

  async assertTextContains(target: Locator | string, expectedText: string, timeout?: number): Promise<void> {
    await expect(this.locator(target)).toContainText(expectedText, { timeout });
  }

  async assertTextEquals(target: Locator | string, expectedText: string, timeout?: number): Promise<void> {
    await expect(this.locator(target)).toHaveText(expectedText, { timeout });
  }

  async assertElementExists(target: Locator | string, timeout?: number): Promise<void> {
    await expect(this.locator(target)).toBeAttached({ timeout });
  }

  async assertUrlContains(expectedFragment: string, timeout?: number): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.escapeRegExp(expectedFragment)), { timeout });
  }

  private locator(target: Locator | string): Locator {
    return typeof target === 'string' ? this.page.locator(target).first() : target.first();
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
