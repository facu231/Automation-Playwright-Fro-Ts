import { expect } from '@playwright/test';
import type { Page } from 'playwright';
import { resolveLocator } from './locator';
import type { LocatorTarget } from './locator';

export class ElementAssertions {
  constructor(private readonly page: Page) {}

  async assertVisible(target: LocatorTarget, timeout?: number): Promise<void> {
    await expect(resolveLocator(this.page, target)).toBeVisible({ timeout });
  }

  async assertHidden(target: LocatorTarget, timeout?: number): Promise<void> {
    await expect(resolveLocator(this.page, target)).toBeHidden({ timeout });
  }

  async assertEnabled(target: LocatorTarget, timeout?: number): Promise<void> {
    await expect(resolveLocator(this.page, target)).toBeEnabled({ timeout });
  }

  async assertDisabled(target: LocatorTarget, timeout?: number): Promise<void> {
    await expect(resolveLocator(this.page, target)).toBeDisabled({ timeout });
  }

  async assertTextContains(target: LocatorTarget, expectedText: string, timeout?: number): Promise<void> {
    await expect(resolveLocator(this.page, target)).toContainText(expectedText, { timeout });
  }

  async assertTextEquals(target: LocatorTarget, expectedText: string, timeout?: number): Promise<void> {
    await expect(resolveLocator(this.page, target)).toHaveText(expectedText, { timeout });
  }

  async assertElementExists(target: LocatorTarget, timeout?: number): Promise<void> {
    await expect(resolveLocator(this.page, target)).toBeAttached({ timeout });
  }

  async assertUrlContains(expectedFragment: string, timeout?: number): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.escapeRegExp(expectedFragment)), { timeout });
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
