# Framework FRO TS

Framework profesional de automatizacion E2E frontend con Playwright, TypeScript, Cucumber, Gherkin y BDD. Esta pensado para equipos QA que necesitan una base mantenible, escalable y lista para integrarse con pipelines.

## Stack

- TypeScript
- Playwright
- Cucumber / Gherkin
- BDD
- Page Object Model
- Node.js
- CI/CD con GitHub Actions, GitLab CI y Jenkins

## Instalacion

```bash
npm install
npx playwright install
```

Opcionalmente copia `.env.example` a `.env` y ajusta las variables.

## Estructura

```text
src/
  core/       Modulos base del framework
  pages/      Page Objects
  steps/      Step definitions
  features/   Escenarios Gherkin
  hooks/      Hooks de Cucumber
  support/    Custom World y soporte Cucumber
  config/     Configuraciones por ambiente
  data/       Datos de prueba
  utils/      Utilidades
  paths/      Paths compartidos
ci/           Ejemplos de pipelines
reports/      Reportes generados
screenshots/  Evidencias PNG
videos/       Videos de ejecucion
traces/       Traces de Playwright
```

## Ejecucion

```bash
npm test
TEST_ENV=qa npm test
npm run test:dev
npm run test:qa
npm run test:headed
npm run test:debug
npm run report
```

En Windows PowerShell, usa los scripts con `cross-env`:

```bash
npm run test:qa
```

## Ambientes

Los ambientes disponibles son `local`, `dev`, `qa`, `staging` y `prod`. Se seleccionan con `TEST_ENV`.

Variables utiles:

- `BASE_URL`: URL base de la aplicacion
- `BROWSER`: `chromium`, `firefox` o `webkit`
- `HEADLESS`: `true` o `false`
- `HIGHLIGHT`: resalta elementos antes de interactuar
- `SCREENSHOT_ON_STEP`: captura evidencia por step
- `VIDEO`: habilita video por escenario
- `TRACE`: habilita traces de Playwright
- `TEST_USERNAME` y `TEST_PASSWORD`: credenciales de prueba

## Crear una feature

Crea un archivo en `src/features`:

```gherkin
Feature: Login de usuario

  Scenario: Login exitoso
    Given que el usuario se encuentra en la pantalla de login
    When ingresa usuario "standard_user"
    And ingresa contrasena "secret_sauce"
    And presiona el boton iniciar sesion
    Then deberia visualizar el dashboard principal
```

## Crear steps

Crea o extiende un archivo en `src/steps`:

```typescript
Given('que el usuario se encuentra en la pantalla de login', async function () {
  await this.loginPage.navigateToLogin();
});
```

Usa `CustomWorld` para acceder a `page`, `context`, page objects y managers de evidencia.

## Crear un Page Object

Extiende `BasePage`:

```typescript
export class LoginPage extends BasePage {
  async navigateToLogin(): Promise<void> {
    await this.navigate(this.config.loginPath);
  }
}
```

Centraliza interacciones con `ElementActions`, validaciones con `ElementAssertions` y esperas con `WaitManager`.

## Evidencias y reportes

- Screenshots: `screenshots/<fecha>/<escenario>`
- Videos: `videos/<fecha>/<escenario>`
- Traces: `traces/<fecha>/<escenario>`
- JSON/HTML Cucumber: `reports/cucumber`
- Reporte HTML agregado: `reports/html`

Para limpiar evidencias:

```bash
npm run clean:reports
```

## Highlight

Activa `HIGHLIGHT=true` para marcar visualmente los elementos antes de interactuar. El comportamiento se centraliza en `HighlightManager`.

## CI/CD

Incluye ejemplos para:

- GitHub Actions: `.github/workflows/e2e.yml` y `ci/github-actions.yml`
- GitLab CI: `.gitlab-ci.yml` y `ci/gitlab-ci.yml`
- Jenkins: `Jenkinsfile` y `ci/Jenkinsfile`

Los pipelines instalan dependencias, instalan browsers de Playwright, ejecutan tests y publican artifacts.

## Buenas practicas

- Un Page Object por pantalla o flujo estable.
- Steps breves y legibles; la logica vive en pages o servicios del framework.
- Selectores preferentemente por `data-test` o roles accesibles.
- Datos de prueba fuera de los steps.
- Evidencias habilitadas en CI y configurables localmente.
- No duplicar esperas; usar `WaitManager` o assertions auto-waiting de Playwright.
- Mantener ambientes en `src/config` y secretos fuera del repositorio.
