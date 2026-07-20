# Framework FRO TS

Framework profesional de automatizacion E2E frontend con Playwright, TypeScript, Cucumber, Gherkin y BDD. Esta pensado para equipos QA que necesitan una base mantenible, escalable y lista para integrarse con pipelines.

## Stack

- TypeScript
- Playwright
- Cucumber / Gherkin
- BDD
- Page Object Model
- Node.js 24 recomendado, minimo 20.19
- Zod para validacion de configuracion
- ESLint, Prettier y Vitest
- Allure Report
- CI/CD con GitHub Actions, GitLab CI y Jenkins
- Docker / Dev Container

## Instalacion

```bash
corepack enable
pnpm install
pnpm exec playwright install
```

Tambien funciona con `npm install` si el equipo prefiere npm. Para CI se recomienda `pnpm` porque el repositorio incluye `pnpm-lock.yaml`.

Opcionalmente copia `.env.example` a `.env` y ajusta las variables. La configuracion se valida con Zod antes de iniciar el browser.

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
ci/           Configuracion compartida de pipelines
reports/      Reportes generados
screenshots/  Evidencias PNG
videos/       Videos de ejecucion
traces/       Traces de Playwright
Dockerfile    Imagen reproducible con browsers de Playwright
```

## Ejecucion

```bash
npm test
TEST_ENV=qa npm test
npm run test:dev
npm run test:qa
npm run test:smoke
npm run test:regression
npm run test:parallel
npm run test:chrome
npm run test:edge
npm run test:firefox
npm run test:flaky
npm run test:headed
npm run test:debug
npm run test:unit
npm run validate
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
- `BROWSER`: `chromium`, `chrome`, `msedge`, `firefox` o `webkit`
- `HEADLESS`: `true` o `false`
- `HIGHLIGHT`: resalta elementos antes de interactuar
- `SCREENSHOT_ON_STEP`: captura evidencia por step
- `VIDEO`: habilita video por escenario
- `TRACE`: habilita traces de Playwright
- `TEST_USERNAME` y `TEST_PASSWORD`: credenciales de prueba
- `CUCUMBER_TAGS`: expresion de tags, por ejemplo `@smoke and not @wip`
- `RETRY`: cantidad de reintentos
- `RETRY_TAG_FILTER`: tags que pueden reintentarse, por defecto `@flaky`
- `PARALLEL`: workers paralelos de Cucumber
- `ALLURE`: usa `false` para desactivar el formatter Allure

## Tags y retries

El framework viene preparado para suites grandes:

- `@smoke`: camino critico corto
- `@regression`: suite de regresion
- `@critical`: escenarios de negocio prioritarios
- `@flaky`: escenarios con retry controlado
- `@wip`: escenarios en construccion, excluidos por defecto
- `@desktop` y `@mobile`: segmentacion por dispositivo

Ejemplos:

```bash
npm run test:smoke
cross-env CUCUMBER_TAGS="@regression and not @wip" npm test
cross-env CUCUMBER_TAGS="@flaky" RETRY=2 RETRY_TAG_FILTER=@flaky npm test
```

## Paralelismo y browsers

El paralelismo se controla con `PARALLEL`, que Cucumber usa como cantidad de workers:

```bash
cross-env PARALLEL=2 npm test
npm run test:parallel
```

Cada escenario genera un `executionId` unico. Las evidencias quedan aisladas por ejecucion para evitar pisadas cuando hay workers paralelos, retries o matriz de browsers.

Browsers soportados:

```bash
npm run test:chrome
npm run test:edge
npm run test:firefox
cross-env BROWSER=chromium npm test
```

`chrome` y `msedge` usan los canales oficiales de Chromium de Playwright. Si no estan instalados localmente, ejecuta:

```bash
pnpm exec playwright install chrome msedge firefox
```

## Crear una feature

Crea un archivo en `src/features`:

```gherkin
@login @smoke @regression @desktop
Feature: Login de usuario

  @critical
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
  await this.getLoginPage().navigateToLogin();
});
```

Usa `CustomWorld` para acceder a `page`, `context`, Page Factory y managers de evidencia.

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

Los Page Objects se registran en `PageFactory`, por ejemplo:

```typescript
this.pages.login();
```

## Datos de prueba

Usa `DataManager` para centralizar datos en `src/data`:

```typescript
const user = DataManager.getRecord<TestUser>('users.json', 'validUser');
```

## Evidencias y reportes

- Screenshots: `screenshots/<fecha>/<escenario>/<executionId>`
- Videos: `videos/<fecha>/<escenario>/<executionId>`
- Traces: `traces/<fecha>/<escenario>/<executionId>`
- JSON/HTML Cucumber: `reports/cucumber`
- Reporte HTML agregado: `reports/html`
- Allure results: `reports/allure-results`
- Allure HTML: `reports/allure-report`
- Logs de consola, errores de pagina y requests fallidas en `scenario-evidence.json`

Para limpiar evidencias:

```bash
npm run clean:reports
```

Para generar Allure:

```bash
npm run report:allure
npm run report:allure:open
```

## Highlight

Activa `HIGHLIGHT=true` para marcar visualmente los elementos antes de interactuar. El comportamiento se centraliza en `HighlightManager`.

## CI/CD

Incluye pipelines para:

- GitHub Actions: `.github/workflows/e2e.yml`
- GitLab CI: `.gitlab-ci.yml` incluye `ci/gitlab-ci.yml`
- Jenkins: `Jenkinsfile`

Los pipelines instalan dependencias, instalan browsers de Playwright, ejecutan tests y publican artifacts.

GitHub Actions ejecuta una matriz primaria pensada para cobertura util sin gastar minutos de mas:

- Linux: `chrome`, `msedge`, `firefox`
- Windows: `chrome`
- macOS: `chrome`
- Suite default: `@smoke and not @wip`

La matriz se puede ampliar agregando combinaciones `os` x `browser` x `suite` en `.github/workflows/e2e.yml`. El nivel de paralelismo por job se controla desde `workflow_dispatch` con `parallel` o por defecto con `PARALLEL=2`.

El workflow tambien incluye una contingencia opcional para self-hosted runners. No intenta cambiar de runner un job ya iniciado; usa un job separado `e2e-self-hosted-fallback` que solo corre si:

- El workflow fue disparado manualmente con `enable_self_hosted_fallback=true`.
- La ejecucion primaria fallo antes de correr pruebas, clasificada como `failure_type=infra`.
- Existe un runner self-hosted disponible con labels `self-hosted`, `automation`, `playwright`.

Fallos de validacion (`quality`) o de tests (`test`) no disparan el fallback. El fallback tiene un solo intento, `max-parallel: 1`, y registra el runner real en logs y artifacts.

GitLab CI y Jenkins mantienen una matriz equivalente de browsers: `chrome`, `msedge` y `firefox`.

## Docker

Construir imagen:

```bash
docker build -t framework-fro-ts .
```

Ejecutar smoke:

```bash
docker run --rm framework-fro-ts
```

Ejecutar otro set de tags:

```bash
docker run --rm -e CUCUMBER_TAGS="@regression and not @wip" framework-fro-ts
```

## Calidad

Comandos disponibles:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test:unit
npm run validate
```

## Buenas practicas

- Un Page Object por pantalla o flujo estable.
- Steps breves y legibles; la logica vive en pages o servicios del framework.
- Registrar cada Page Object nuevo en `PageFactory`.
- Selectores preferentemente por `data-test` o roles accesibles.
- Datos de prueba fuera de los steps, idealmente mediante `DataManager`.
- Evidencias habilitadas en CI y configurables localmente.
- Retries solo para `@flaky` o en CI, no para ocultar defectos reales.
- No duplicar esperas; usar `WaitManager` o assertions auto-waiting de Playwright.
- Mantener ambientes en `src/config` y secretos fuera del repositorio.
