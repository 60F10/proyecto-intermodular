import { Injectable, LoggerService } from '@nestjs/common';

export interface LogContext {
  moduleName: string;
  [key: string]: any;
}

@Injectable()
export class CustomLogger implements LoggerService {
  private context: string = 'App';

  log(message: string, context?: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level: 'INFO',
      timestamp,
      context: context || this.context,
      message,
      ...(meta && { metadata: meta }),
    };
    console.log(JSON.stringify(logEntry));
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level: 'ERROR',
      timestamp,
      context: context || this.context,
      message,
      ...(trace && { stack: trace }),
      ...(meta && { metadata: meta }),
    };
    console.error(JSON.stringify(logEntry));
  }

  warn(message: string, context?: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level: 'WARN',
      timestamp,
      context: context || this.context,
      message,
      ...(meta && { metadata: meta }),
    };
    console.warn(JSON.stringify(logEntry));
  }

  debug(message: string, context?: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const logEntry = {
        level: 'DEBUG',
        timestamp,
        context: context || this.context,
        message,
        ...(meta && { metadata: meta }),
      };
      console.debug(JSON.stringify(logEntry));
    }
  }

  verbose(message: string, context?: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const logEntry = {
        level: 'VERBOSE',
        timestamp,
        context: context || this.context,
        message,
        ...(meta && { metadata: meta }),
      };
      console.log(JSON.stringify(logEntry));
    }
  }

  setContext(context: string) {
    this.context = context;
  }
}
