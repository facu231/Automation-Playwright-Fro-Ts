import { afterEach, describe, expect, it } from 'vitest';
import { ConfigManager } from './ConfigManager';

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  delete process.env.BASE_URL;
  ConfigManager.load(true);
});

describe('ConfigManager', () => {
  it('loads the selected environment with typed overrides', () => {
    delete process.env.BASE_URL;
    process.env.TEST_ENV = 'qa';
    process.env.HEADLESS = 'false';
    process.env.BROWSER = 'firefox';
    process.env.TEST_TIMEOUT = '90000';

    const config = ConfigManager.load(true);

    expect(config.name).toBe('qa');
    expect(config.headless).toBe(false);
    expect(config.browser).toBe('firefox');
    expect(config.timeout).toBe(90000);
  });

  it('throws a readable error for invalid environment values', () => {
    delete process.env.BASE_URL;
    process.env.TEST_ENV = 'invalid';

    expect(() => ConfigManager.load(true)).toThrow(/Invalid environment configuration/);
  });
});
