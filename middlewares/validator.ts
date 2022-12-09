import express, { NextFunction } from 'express';

import { HTTP_STATUS } from '../enums';
import { CreateHttpError } from '../helpers/http-response/index';
import { getStatusCode } from '../helpers/utils';

interface ICustomRequest extends express.Request {
  body: any;
}

interface CustomResponse extends express.Response {
  status: any;
}

export class ModelValidator {

  public static validate =
    (scheme) =>
    async (
      request: ICustomRequest,
      response: CustomResponse,
      next: NextFunction
    ) => {
      try {
        const { body } = request;
        try {
          await scheme.validate({ body });
          return next();
        } catch (error: any) {
          const { path, type, errors } = error;
          new CreateHttpError(HTTP_STATUS.BAD_REQUEST, errors, {
            path,
            type: `validation ${type}`,
          });
        }
      } catch (error: any) {
        response.status(getStatusCode(error)).json({ message: error });
      }
    };
}
