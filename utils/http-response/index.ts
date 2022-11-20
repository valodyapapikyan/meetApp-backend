export enum HTTP_STATUS {
  SUCCESS = 200,
  CREATED = 201,
  ANAUTHORIZED = 401,
  BAD_REQUEST = 400,
} //todo move to enums

export enum RESPONSE_STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class HttpResponse<T> {
  constructor(
    public status: RESPONSE_STATUS,
    public data: T,
    public errorMessages: Array<string>,
    public additionalInfo?: any
  ) {}
}

export class SuccessHttpResponse<T> extends HttpResponse<T> {
  constructor(data: T) {
    super(RESPONSE_STATUS.SUCCESS, data, null);
  }
}

export class ErrorHttpResponse extends HttpResponse<null> {
  constructor(errorMessages: Array<string>, additionalInfo: any = null) {
    super(RESPONSE_STATUS.ERROR, null, errorMessages, additionalInfo);
  }
}
