import { PathManager } from '../core/PathManager';

export const artifactPaths = {
  reports: PathManager.resolve('reports'),
  cucumberJson: PathManager.cucumberJson(),
  cucumberHtml: PathManager.cucumberHtml(),
  screenshots: PathManager.resolve('screenshots'),
  videos: PathManager.resolve('videos'),
  traces: PathManager.resolve('traces'),
  data: PathManager.resolve('src', 'data')
};
