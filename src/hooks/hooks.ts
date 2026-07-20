import { After, AfterAll, AfterStep, Before, BeforeAll, Status } from '@cucumber/cucumber';
import type { ITestCaseHookParameter, ITestStepHookParameter } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from 'playwright';
import type { Browser, BrowserType, LaunchOptions, Page } from 'playwright';
import type { BrowserChannel, SupportedBrowser } from '../config/types';
import { ConfigManager } from '../core/ConfigManager';
import { PathManager } from '../core/PathManager';
import type { CustomWorld } from '../support/world';

let browser: Browser;

BeforeAll(async function () {
  const config = ConfigManager.load(true);
  const browserProfile = resolveBrowserProfile(config.browser);
  const launchOptions: LaunchOptions = {
    headless: config.headless,
    slowMo: config.slowMo,
    ...config.launchOptions
  };

  if (browserProfile.channel) {
    launchOptions.channel = browserProfile.channel;
  }

  PathManager.ensureBaseFolders();
  browser = await browserProfile.browserType.launch(launchOptions);
});

Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const config = ConfigManager.load();
  const scenarioName = scenario.pickle.name;
  const scenarioExecutionId = PathManager.executionId(scenarioName, config.browser);
  const videoDir = config.video
    ? PathManager.forScenarioRun('videos', scenarioName, scenarioExecutionId)
    : undefined;

  const context = await browser.newContext({
    viewport: config.viewport,
    recordVideo: videoDir ? { dir: videoDir } : undefined,
    ...config.contextOptions
  });

  if (config.trace) {
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  }

  const page = await context.newPage();
  page.setDefaultTimeout(config.actionTimeout);
  page.setDefaultNavigationTimeout(config.navigationTimeout);

  this.init(browser, context, page, scenarioName, scenarioExecutionId);
  registerDiagnostics(this, page);
  this.reporterManager?.info(`Scenario started: ${scenarioName}`);
  this.reporterManager?.info(`Execution id: ${scenarioExecutionId}`);
});

AfterStep(async function (this: CustomWorld, hookParameter: ITestStepHookParameter) {
  if (!this.page || !this.screenshotManager) {
    return;
  }

  const status = hookParameter.result?.status;
  const isFailure = status === Status.FAILED;
  const shouldCapture = this.config.screenshotOnStep || isFailure;

  if (!shouldCapture) {
    return;
  }

  const stepText = hookParameter.pickleStep?.text ?? 'step';
  const evidence = await this.screenshotManager.capture(isFailure ? 'failure' : 'step', stepText);

  this.reporterManager?.addScreenshot(evidence);
  await this.attach(evidence.buffer, 'image/png');
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const status = scenario.result?.status ?? 'UNKNOWN';
  const failed = status === Status.FAILED;

  this.reporterManager?.setStatus(String(status).toUpperCase());

  if (failed && this.screenshotManager) {
    const evidence = await this.screenshotManager.capture('failure', 'scenario-failure');
    this.reporterManager?.addScreenshot(evidence);
    await this.attach(evidence.buffer, 'image/png');
  }

  if (this.context && this.config.trace) {
    const tracePath = PathManager.scenarioRunFile(
      'traces',
      this.scenarioName,
      this.scenarioExecutionId,
      `${PathManager.timestamp()}-trace.zip`
    );
    await this.context.tracing.stop({ path: tracePath });
    this.reporterManager?.addEvidence({
      type: 'trace',
      path: tracePath,
      label: 'Playwright trace',
      timestamp: PathManager.timestamp()
    });
    await this.attach(`Playwright trace: ${tracePath}`, 'text/plain');
  }

  const video = this.page?.video();

  if (this.context) {
    await this.context.close();
  }

  if (video) {
    const videoPath = await video.path();
    this.reporterManager?.addEvidence({
      type: 'video',
      path: videoPath,
      label: 'Scenario video',
      timestamp: PathManager.timestamp()
    });
    await this.attach(`Scenario video: ${videoPath}`, 'text/plain');
  }

  this.reporterManager?.info(`Scenario finished with status: ${status}`);
  this.reporterManager?.flush();
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});

function registerDiagnostics(world: CustomWorld, page: Page): void {
  page.on('console', (message) => {
    world.reporterManager?.info(`[console:${message.type()}] ${message.text()}`);
  });

  page.on('pageerror', (error) => {
    world.reporterManager?.error(`[pageerror] ${error.message}`);
  });

  page.on('requestfailed', (request) => {
    const failure = request.failure();
    world.reporterManager?.warn(
      `[requestfailed] ${request.method()} ${request.url()} ${failure?.errorText ?? 'unknown error'}`
    );
  });

  page.on('response', (response) => {
    if (response.status() >= 400) {
      world.reporterManager?.warn(`[response:${response.status()}] ${response.url()}`);
    }
  });
}

function resolveBrowserProfile(browserName: SupportedBrowser): {
  browserType: BrowserType;
  channel?: BrowserChannel;
} {
  if (browserName === 'firefox') {
    return { browserType: firefox };
  }

  if (browserName === 'webkit') {
    return { browserType: webkit };
  }

  if (browserName === 'chrome' || browserName === 'msedge') {
    return { browserType: chromium, channel: browserName };
  }

  return { browserType: chromium };
}
