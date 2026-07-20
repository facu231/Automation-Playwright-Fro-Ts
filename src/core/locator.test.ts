import type { Locator, Page } from 'playwright';
import { describe, expect, it, vi } from 'vitest';
import { resolveLocator } from './locator';

describe('resolveLocator', () => {
  it('resolves string selectors to the first matching locator', () => {
    const firstLocator = {} as Locator;
    const locator = { first: vi.fn(() => firstLocator) } as unknown as Locator;
    const page = { locator: vi.fn(() => locator) } as unknown as Page;

    expect(resolveLocator(page, '#login')).toBe(firstLocator);
    expect(page.locator).toHaveBeenCalledWith('#login');
  });

  it('resolves existing locators to their first match', () => {
    const firstLocator = {} as Locator;
    const locator = { first: vi.fn(() => firstLocator) } as unknown as Locator;

    expect(resolveLocator({} as Page, locator)).toBe(firstLocator);
  });
});
