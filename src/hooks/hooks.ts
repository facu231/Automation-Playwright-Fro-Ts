import { After, AfterAll, AfterStep, Before, BeforeAll, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from 'playwright';
import type { Browser, BrowserType } from 'playwright';
import { ConfigManager } from '../core/ConfigManager';
import { PathManager } from '../core/PathManager';
import type { CustomWorld } from '../support/world';

let browser: Browser;

BeforeAll(async function () {
  const config = ConfigManager.load(true);
  const browserType: BrowserType = { chromium, firefox, webkit }[config.browser];

  PathManager.ensureBaseFolders();

  browser = await browserType.launch({
    headless: config.headless,
    slowMo: config.slowMo,
    ...config.launchOptions
  });
});

Before(async function (this: CustomWorld, scenario: any) {
  const config = ConfigManager.load();
  const scenarioName = scenario.pickle.name;
  const videoDir = config.video ? PathManager.forScenario('videos', scenarioName) : undefined;

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

  this.init(browser, context, page, scenarioName);
  this.reporterManager?.info(`Scenario started: ${scenarioName}`);
});

AfterStep(async function (this: CustomWorld, hookParameter: any) {
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

After(async function (this: CustomWorld, scenario: any) {
  const status = scenario.result?.status ?? 'UNKNOWN';
  const failed = status === Status.FAILED;

  this.reporterManager?.setStatus(String(status).toUpperCase());

  if (failed && this.screenshotManager) {
    const evidence = await this.screenshotManager.capture('failure', 'scenario-failure');
    this.reporterManager?.addScreenshot(evidence);
    await this.attach(evidence.buffer, 'image/png');
  }

  if (this.context && this.config.trace) {
    const tracePath = PathManager.scenarioFile('traces', this.scenarioName, `${PathManager.timestamp()}-trace.zip`);
    await this.context.tracing.stop({ path: tracePath });
    this.reporterManager?.addEvidence({
      type: 'trace',
      path: tracePath,
      label: 'Playwright trace',
      timestamp: PathManager.timestamp()
    });
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
  }

  this.reporterManager?.info(`Scenario finished with status: ${status}`);
  this.reporterManager?.flush();
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});
