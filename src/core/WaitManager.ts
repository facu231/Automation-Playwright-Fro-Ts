import type { Locator, Page } from 'playwright';

export class WaitManager {
  constructor(private readonly page: Page) {}

  async forVisible(target: Locator | string, timeout?: number): Promise<void> {
    await this.locator(target).waitFor({ state: 'visible', timeout });
  }

  async forHidden(target: Locator | string, timeout?: number): Promise<void> {
    await this.locator(target).waitFor({ state: 'hidden', timeout });
  }

  async forAttached(target: Locator | string, timeout?: number): Promise<void> {
    await this.locator(target).waitFor({ state: 'attached', timeout });
  }

  async forDetached(target: Locator | string, timeout?: number): Promise<void> {
    await this.locator(target).waitFor({ state: 'detached', timeout });
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

  private locator(target: Locator | string): Locator {
    return typeof target === 'string' ? this.page.locator(target).first() : target.first();
  }
}
