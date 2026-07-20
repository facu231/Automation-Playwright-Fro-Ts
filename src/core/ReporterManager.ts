import { writeFileSync } from 'fs';
import type { ScreenshotEvidence } from './ScreenshotManager';
import { PathManager } from './PathManager';

export type ScenarioStatus = 'PASSED' | 'FAILED' | 'SKIPPED' | 'UNKNOWN' | string;

export interface ScenarioLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface EvidenceEntry {
  type: string;
  path: string;
  label: string;
  timestamp: string;
}

export class ReporterManager {
  private status: ScenarioStatus = 'UNKNOWN';
  private readonly logs: ScenarioLogEntry[] = [];
  private readonly evidence: EvidenceEntry[] = [];

  constructor(
    private readonly scenarioName: string,
    private readonly executionId = PathManager.sanitize(scenarioName)
  ) {}

  info(message: string): void {
    this.log('info', message);
  }

  warn(message: string): void {
    this.log('warn', message);
  }

  error(message: string): void {
    this.log('error', message);
  }

  setStatus(status: ScenarioStatus): void {
    this.status = status;
  }

  addScreenshot(evidence: ScreenshotEvidence): void {
    this.evidence.push({
      type: evidence.type,
      path: evidence.path,
      label: evidence.label,
      timestamp: evidence.timestamp
    });
  }

  addEvidence(entry: EvidenceEntry): void {
    this.evidence.push(entry);
  }

  flush(): string {
    const filePath = PathManager.scenarioRunFile(
      'reports',
      this.scenarioName,
      this.executionId,
      'scenario-evidence.json'
    );
    const payload = {
      scenario: this.scenarioName,
      executionId: this.executionId,
      status: this.status,
      generatedAt: new Date().toISOString(),
      logs: this.logs,
      evidence: this.evidence
    };

    writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
    return filePath;
  }

  private log(level: ScenarioLogEntry['level'], message: string): void {
    this.logs.push({
      timestamp: new Date().toISOString(),
      level,
      message
    });
  }
}
