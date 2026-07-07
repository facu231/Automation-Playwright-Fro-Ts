import { existsSync, mkdirSync } from 'fs';
import path from 'path';

export type ArtifactRoot = 'reports' | 'screenshots' | 'videos' | 'traces' | 'data';

export class PathManager {
  static readonly artifactRoots: ArtifactRoot[] = ['reports', 'screenshots', 'videos', 'traces', 'data'];

  static get projectRoot(): string {
    return process.cwd();
  }

  static resolve(...segments: string[]): string {
    return path.resolve(this.projectRoot, ...segments);
  }

  static ensureBaseFolders(): void {
    this.artifactRoots.forEach((folder) => this.ensureDir(this.resolve(folder)));
    this.ensureDir(this.resolve('reports', 'cucumber'));
    this.ensureDir(this.resolve('reports', 'html'));
    this.ensureDir(this.resolve('reports', 'allure-results'));
    this.ensureDir(this.resolve('reports', 'allure-report'));
  }

  static ensureDir(directory: string): string {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    return directory;
  }

  static forDate(folder: ArtifactRoot, date = this.dateStamp()): string {
    return this.ensureDir(this.resolve(folder, date));
  }

  static forScenario(folder: ArtifactRoot, scenarioName: string, date = this.dateStamp()): string {
    return this.ensureDir(path.join(this.forDate(folder, date), this.sanitize(scenarioName)));
  }

  static scenarioFile(folder: ArtifactRoot, scenarioName: string, fileName: string): string {
    return path.join(this.forScenario(folder, scenarioName), fileName);
  }

  static cucumberJson(): string {
    return this.resolve('reports', 'cucumber', 'cucumber-report.json');
  }

  static cucumberHtml(): string {
    return this.resolve('reports', 'cucumber', 'cucumber-report.html');
  }

  static htmlReportPath(): string {
    return this.resolve('reports', 'html');
  }

  static sanitize(value: string): string {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120) || 'unnamed'
    );
  }

  static dateStamp(date = new Date()): string {
    return date.toISOString().slice(0, 10);
  }

  static timestamp(date = new Date()): string {
    return date.toISOString().replace(/[:.]/g, '-');
  }
}
