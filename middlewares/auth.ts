import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler';

import { User } from '../models/auth';
import { ErrorHttpResponse, HTTP_STATUS } from '../utils/http-response';

// Protect routes
export const protect = asyncHandler(async (req: any, res: any, next: any) => {
  let token: string;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers.token) {
    token = req.headers.token;
  }

  
  if (!token) {
    return next(
      res.status(HTTP_STATUS.ANAUTHORIZED).json({
        statusCode: HTTP_STATUS.ANAUTHORIZED,
        ...new ErrorHttpResponse([`anuthorized`]),
      })
    );
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
    const data: any = await User.findOne({ where: { linkedinId: decoded.id } });
    req.user = data.dataValues;
    next();
  } catch (err) {
    return next(
      res.status(HTTP_STATUS.ANAUTHORIZED).json({
        statusCode: HTTP_STATUS.ANAUTHORIZED,
        ...new ErrorHttpResponse([`anuthorized_invalid_token`]),
      })
    );
  }
});

export const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return next();
      //role based
      // protect, authorize('publisher'),deleteBootcamp)
    }
    next();
  };
};
