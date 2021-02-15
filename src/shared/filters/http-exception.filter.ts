import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as moment from 'moment';

import { ApiException } from '../exceptions/api.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.header('Content-Type', 'application/json; charset=utf-8');

    if (exception instanceof ApiException) {
      response.status(status).json({
        data: {
          errorMessage: exception.getErrorMessage(),
        },
        code: exception.getErrorCode(),
        date: moment(),
        path: request.url,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        date: moment(),
        path: request.url,
      });
    }
  }
}
