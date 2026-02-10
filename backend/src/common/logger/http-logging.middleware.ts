import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from './custom.logger';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Interceptar el fin de la respuesta
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logEntry = {
        level: 'INFO',
        timestamp: new Date().toISOString(),
        context: 'HTTP',
        message: `${req.method} ${req.path}`,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent'),
        ip: req.ip || req.connection.remoteAddress,
      };

      if (res.statusCode >= 400) {
        logEntry['level'] = res.statusCode >= 500 ? 'ERROR' : 'WARN';
      }

      console.log(JSON.stringify(logEntry));
    });

    next();
  }
}
