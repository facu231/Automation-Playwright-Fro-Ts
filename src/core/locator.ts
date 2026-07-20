import type { Locator, Page } from 'playwright';

export type LocatorTarget = Locator | string;

export function resolveLocator(page: Page, target: LocatorTarget): Locator {
  return typeof target === 'string' ? page.locator(target).first() : target.first();
}
