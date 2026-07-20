import type { Locator, Page } from 'playwright';
import { describe, expect, it, vi } from 'vitest';
import { localConfig } from '../config/env.local';
import { PageFactory } from './PageFactory';

describe('PageFactory', () => {
  it('reuses the login page instance', () => {
    const locator = { first: vi.fn() } as unknown as Locator;
    const page = { locator: vi.fn(() => locator) } as unknown as Page;
    const factory = new PageFactory(page, localConfig);

    expect(factory.login()).toBe(factory.login());
    expect(page.locator).toHaveBeenCalledTimes(4);
  });
});
