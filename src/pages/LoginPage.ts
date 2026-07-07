import type { Locator, Page } from 'playwright';
import type { EnvironmentConfig } from '../config/types';
import { BasePage } from '../core/BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly dashboardMarker: Locator;

  constructor(page: Page, config?: EnvironmentConfig) {
    super(page, config);
    this.usernameInput = page.locator(
      '[data-test="username"], #user-name, #username, input[name="username"]'
    );
    this.passwordInput = page.locator('[data-test="password"], #password, input[type="password"]');
    this.loginButton = page.locator('[data-test="login-button"], #login-button, button[type="submit"]');
    this.dashboardMarker = page.locator(
      '[data-test="inventory-container"], [data-testid="dashboard"], #dashboard, main'
    );
  }

  async navigateToLogin(): Promise<void> {
    await this.navigate(this.config.loginPath);
  }

  async enterUsername(username: string): Promise<void> {
    await this.actions.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.actions.fill(this.passwordInput, password);
  }

  async submitLogin(): Promise<void> {
    await this.actions.click(this.loginButton);
  }

  async login(
    username = this.config.credentials.username,
    password = this.config.credentials.password
  ): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.submitLogin();
  }

  async assertDashboardIsVisible(): Promise<void> {
    await this.assertions.assertUrlContains(this.config.dashboardPath, this.config.navigationTimeout);
    await this.assertions.assertVisible(this.dashboardMarker, this.config.actionTimeout);
  }
}
