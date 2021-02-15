import { ApiMsgCode } from '../enums';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  private readonly errorMessage: string;
  private readonly errorCode: ApiMsgCode;

  constructor(
    errorMessage: string,
    errorCode: ApiMsgCode,
    statusCode: HttpStatus,
  ) {
    super(errorMessage, statusCode);

    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
  }

  public getErrorCode(): ApiMsgCode {
    return this.errorCode;
  }

  public getErrorMessage(): string {
    return this.errorMessage;
  }
}
