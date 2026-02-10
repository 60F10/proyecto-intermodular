import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    // Manejo de HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const objectResponse = exceptionResponse as Record<string, any>;
        message = objectResponse.message || exception.message;
        error = objectResponse.error || error;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      // Manejo de errores genéricos
      message = exception.message;
      error = exception.name;

      // Log del error completo en desarrollo
      this.logger.error(
        `Error: ${exception.message}`,
        exception.stack,
      );
    }

    // Crear respuesta de error
    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Loguear el error
    this.logger.warn(
      `[${request.method}] ${request.url} - Status: ${status} - Error: ${error}`,
    );

    response.status(status).json(errorResponse);
  }
}
