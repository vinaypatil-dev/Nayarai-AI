export class IngestionLogger {
  public log: string[] = [];
  public errors: string[] = [];

  info(message: string, context?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ level: 'INFO', timestamp, message, ...context }));
    this.log.push(message);
  }

  warn(message: string, context?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    console.warn(JSON.stringify({ level: 'WARN', timestamp, message, ...context }));
    this.log.push(`Warning: ${message}`);
  }

  error(message: string, error?: any, context?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const errorDetails = error ? { error: error.stack || error.message || String(error) } : {};
    console.error(JSON.stringify({ level: 'ERROR', timestamp, message, ...errorDetails, ...context }));
    this.errors.push(message);
    this.log.push(`Error: ${message}`);
  }
}
