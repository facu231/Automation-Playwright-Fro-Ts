import { readFileSync } from 'fs';
import path from 'path';
import { PathManager } from './PathManager';

export class DataManager {
  static readJson<T>(relativePath: string): T {
    const filePath = path.isAbsolute(relativePath)
      ? relativePath
      : PathManager.resolve('src', 'data', relativePath);
    const content = readFileSync(filePath, 'utf8');

    return JSON.parse(content) as T;
  }

  static getRecord<T>(fileName: string, recordKey: string): T {
    const records = this.readJson<Record<string, T>>(fileName);
    const record = records[recordKey];

    if (!Object.hasOwn(records, recordKey)) {
      throw new Error(`Record "${recordKey}" was not found in ${fileName}`);
    }

    return record;
  }
}
