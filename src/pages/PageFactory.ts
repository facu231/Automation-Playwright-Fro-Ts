import type { Page } from 'playwright';
import type { EnvironmentConfig } from '../config/types';
import { LoginPage } from './LoginPage';

export class PageFactory {
  private loginPage?: LoginPage;

  constructor(
    private readonly page: Page,
    private readonly config: EnvironmentConfig
  ) {}

  login(): LoginPage {
    if (!this.loginPage) {
      this.loginPage = new LoginPage(this.page, this.config);
    }

    return this.loginPage;
  }
}
