import { HTTP_STATUS, RESPONSE_STATUS } from '../../enums';

export class HttpResponse<T> {
  constructor(
    public statusCode: HTTP_STATUS,
    public status: RESPONSE_STATUS,
    public data: T,
    public errorMessages: Array<any> | {[key: string] : any},
    public additionalInfo?: any
  ) {}
}

export class SuccessHttpResponse<T> extends HttpResponse<T> {
  constructor(data: T, status?) {
    super(status || HTTP_STATUS.SUCCESS, RESPONSE_STATUS.SUCCESS, data, null);
  }
}

export class ErrorHttpResponse extends HttpResponse<null> {
  constructor(
    statusCode,
    errorMessages: Array<any> | {[key: string] : any},
    additionalInfo: any = null
  ) {
    super(
      statusCode,
      RESPONSE_STATUS.ERROR,
      null,
      errorMessages,
      additionalInfo
    );
  }
}

export class CreateHttpError {
  constructor(status, message: Array<any> | {[key: string] : any}, additionalInfo?) {
    this.throw(status, message, additionalInfo);
  }

  private throw(status, message:Array<any> | {[key: string] : any}, additionalInfo?) {
    throw new ErrorHttpResponse(status, message, additionalInfo);
  }
}
