import { PathManager } from '../core/PathManager';

export const artifactPaths = {
  reports: PathManager.resolve('reports'),
  cucumberJson: PathManager.cucumberJson(),
  cucumberHtml: PathManager.cucumberHtml(),
  allureResults: PathManager.resolve('reports', 'allure-results'),
  allureHtml: PathManager.resolve('reports', 'allure-report'),
  screenshots: PathManager.resolve('screenshots'),
  videos: PathManager.resolve('videos'),
  traces: PathManager.resolve('traces'),
  data: PathManager.resolve('src', 'data')
};
