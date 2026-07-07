const common = {
  requireModule: ['ts-node/register'],
  require: ['src/support/world.ts', 'src/hooks/hooks.ts', 'src/steps/**/*.ts'],
  paths: ['src/features/**/*.feature'],
  format: [
    'progress',
    'json:reports/cucumber/cucumber-report.json',
    'html:reports/cucumber/cucumber-report.html'
  ],
  parallel: Number(process.env.PARALLEL || 0)
};

module.exports = {
  default: common,
  ci: {
    ...common,
    format: [
      'progress',
      'json:reports/cucumber/cucumber-report.json',
      'html:reports/cucumber/cucumber-report.html'
    ]
  }
};
