import jwt from 'jsonwebtoken';
import asyncHandler from '../helpers/async-handler';

import { User } from '../models/user-model';
import { CreateHttpError } from '../helpers/http-response';
import { getAuthorizationToken } from '../helpers/get-token';
import { HTTP_STATUS } from '../enums';
import { getStatusCode } from '../helpers/utils';
import { NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

interface CustomResponse extends Response {
  status: any;
}

export const protect = asyncHandler(
  async (
    request: CustomRequest,
    response: CustomResponse,
    next: NextFunction
  ) => {
    const token: string = getAuthorizationToken(request);

    if (!token) {
      new CreateHttpError(HTTP_STATUS.ANAUTHORIZED, ['anuthorized']);
    }

    try {
      const decoded: any = jwt.verify(token, process.env.SECRET_KEY);

      const user: any = await User.findOne({
        where: { userID: decoded.userID },
      });

      request.user = user.dataValues;
      next();
    } catch (error: any) {
      response
        .status(getStatusCode(error))
        .json({ message: 'authorisation_middlevare_catch' });
    }
  }
);

export const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return next();
      //role based authorisation
      // protect, authorize('some ro'),'/events/delete/:id')
    }
    next();
  };
};
