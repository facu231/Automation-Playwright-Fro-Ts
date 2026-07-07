export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class Logger {
  constructor(private readonly scope: string) {}

  info(message: string): void {
    this.write('info', message);
  }

  warn(message: string): void {
    this.write('warn', message);
  }

  error(message: string): void {
    this.write('error', message);
  }

  debug(message: string): void {
    if (process.env.DEBUG_LOGS === 'true') {
      this.write('debug', message);
    }
  }

  private write(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level.toUpperCase()}] [${this.scope}] ${message}`;

    if (level === 'error') {
      console.error(line);
      return;
    }

    if (level === 'warn') {
      console.warn(line);
      return;
    }

    console.log(line);
  }
}
