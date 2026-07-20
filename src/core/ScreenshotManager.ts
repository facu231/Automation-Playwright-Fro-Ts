import type { Page } from 'playwright';
import { PathManager } from './PathManager';

export interface ScreenshotEvidence {
  path: string;
  buffer: Buffer;
  type: 'step' | 'failure' | 'manual';
  label: string;
  timestamp: string;
}

export class ScreenshotManager {
  constructor(
    private readonly page: Page,
    private readonly scenarioName: string,
    private readonly executionId = PathManager.sanitize(scenarioName)
  ) {}

  async capture(type: ScreenshotEvidence['type'], label: string): Promise<ScreenshotEvidence> {
    const timestamp = PathManager.timestamp();
    const sanitizedLabel = PathManager.sanitize(label);
    const fileName = `${timestamp}-${type}-${sanitizedLabel}.png`;
    const filePath = PathManager.scenarioRunFile(
      'screenshots',
      this.scenarioName,
      this.executionId,
      fileName
    );
    const buffer = await this.page.screenshot({ path: filePath, fullPage: true });

    return {
      path: filePath,
      buffer,
      type,
      label,
      timestamp
    };
  }
}
