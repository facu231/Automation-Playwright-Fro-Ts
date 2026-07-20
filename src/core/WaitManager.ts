import type { Page } from 'playwright';
import { resolveLocator } from './locator';
import type { LocatorTarget } from './locator';

export class WaitManager {
  constructor(private readonly page: Page) {}

  async forVisible(target: LocatorTarget, timeout?: number): Promise<void> {
    await resolveLocator(this.page, target).waitFor({ state: 'visible', timeout });
  }

  async forHidden(target: LocatorTarget, timeout?: number): Promise<void> {
    await resolveLocator(this.page, target).waitFor({ state: 'hidden', timeout });
  }

  async forAttached(target: LocatorTarget, timeout?: number): Promise<void> {
    await resolveLocator(this.page, target).waitFor({ state: 'attached', timeout });
  }

  async forDetached(target: LocatorTarget, timeout?: number): Promise<void> {
    await resolveLocator(this.page, target).waitFor({ state: 'detached', timeout });
  }

  async forLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async forUrlContains(fragment: string, timeout?: number): Promise<void> {
    await this.page.waitForFunction(
      (expectedFragment) => window.location.href.includes(expectedFragment),
      fragment,
      { timeout }
    );
  }
}
