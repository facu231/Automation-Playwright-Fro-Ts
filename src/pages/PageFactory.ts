import type { Page } from 'playwright';
import type { EnvironmentConfig } from '../config/types';
import { LoginPage } from './LoginPage';

export class PageFactory {
  private readonly instances = new Map<string, unknown>();

  constructor(
    private readonly page: Page,
    private readonly config: EnvironmentConfig
  ) {}

  login(): LoginPage {
    return this.getOrCreate('login', () => new LoginPage(this.page, this.config));
  }

  getOrCreate<T>(key: string, factory: () => T): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, factory());
    }

    return this.instances.get(key) as T;
  }
}
