import { Given, Then, When } from '@cucumber/cucumber';
import type { CustomWorld } from '../support/world';

Given('que el usuario se encuentra en la pantalla de login', async function (this: CustomWorld) {
  await this.getLoginPage().navigateToLogin();
});

When('ingresa usuario {string}', async function (this: CustomWorld, username: string) {
  await this.getLoginPage().enterUsername(username);
});

When('ingresa contrasena {string}', async function (this: CustomWorld, password: string) {
  await this.getLoginPage().enterPassword(password);
});

When('presiona el boton iniciar sesion', async function (this: CustomWorld) {
  await this.getLoginPage().submitLogin();
});

Then('deberia visualizar el dashboard principal', async function (this: CustomWorld) {
  await this.getLoginPage().assertDashboardIsVisible();
});
