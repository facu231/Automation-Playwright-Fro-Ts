const baseFormat = [
  'progress',
  'json:reports/cucumber/cucumber-report.json',
  'html:reports/cucumber/cucumber-report.html'
];

if (process.env.ALLURE !== 'false') {
  baseFormat.push('allure-cucumberjs/reporter');
}

const retry = Number(process.env.RETRY || process.env.CUCUMBER_RETRY || (process.env.CI ? 1 : 0));
const tags = process.env.CUCUMBER_TAGS || process.env.TAGS || 'not @wip';

const common = {
  requireModule: ['ts-node/register'],
  require: ['src/support/world.ts', 'src/hooks/hooks.ts', 'src/steps/**/*.ts'],
  paths: ['src/features/**/*.feature'],
  format: baseFormat,
  formatOptions: {
    resultsDir: 'reports/allure-results'
  },
  parallel: Number(process.env.PARALLEL || 0),
  retry,
  tags
};

if (retry > 0) {
  common.retryTagFilter = process.env.RETRY_TAG_FILTER || '@flaky';
}

module.exports = {
  default: common,
  ci: {
    ...common,
    format: baseFormat
  }
};
