import { existsSync } from 'fs';
import { ConfigManager } from '../core/ConfigManager';
import { PathManager } from '../core/PathManager';

const reporter = require('multiple-cucumber-html-reporter');

PathManager.ensureBaseFolders();

if (!existsSync(PathManager.cucumberJson())) {
  console.warn(`Cucumber JSON report not found at ${PathManager.cucumberJson()}`);
  process.exit(0);
}

const config = ConfigManager.load();

reporter.generate({
  jsonDir: PathManager.resolve('reports', 'cucumber'),
  reportPath: PathManager.htmlReportPath(),
  displayDuration: true,
  pageTitle: 'Framework FRO TS - E2E Report',
  reportName: 'Automation E2E Report',
  metadata: {
    browser: {
      name: config.browser,
      version: 'managed by Playwright'
    },
    device: 'Local or CI runner',
    platform: {
      name: process.platform
    }
  },
  customData: {
    title: 'Execution info',
    data: [
      { label: 'Environment', value: config.name },
      { label: 'Base URL', value: config.baseUrl },
      { label: 'Generated at', value: new Date().toISOString() }
    ]
  }
});
