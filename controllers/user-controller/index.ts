import { Response, NextFunction } from 'express';
const path = require('path');

const bcrypt = require('bcrypt');

import {
  SuccessHttpResponse,
  ErrorHttpResponse,
  HTTP_STATUS,
} from '../../utils/http-response/index';

import { dataBase } from '../../models/index';
import { COAST_FACTOR } from '../../configs';
import { JwtSerice } from '../../services/jwt-service';

class UserController {
  constructor() {}

  async signUp(req: any, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await dataBase.User.findOne({
        where: { email: email.toLowerCase().trim() },
        raw: true,
      });

      if (user) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          ...new ErrorHttpResponse([`user_already_exist`]),
        });
      }

      const userData = await dataBase.User.create({
        email: email.toLowerCase().trim(),
        password: await bcrypt.hash(password, COAST_FACTOR),
      });

      const { id } = userData.get({ plain: true });

      res.status(HTTP_STATUS.CREATED).json(
        new SuccessHttpResponse({
          id,
        })
      );
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST);
    }
  }

  async signIn(req: any, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          ...new ErrorHttpResponse([`email_password_required`]),
        });
      }

      const user = await dataBase.User.findOne({
        where: { email },
        raw: true,
      });

      if (!user) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          ...new ErrorHttpResponse([`incorect_email_password`]),
        });
      }

      //todo , need to check is user verified (with OTP or email confirmation)

      if (user) {
        const result = await bcrypt.compare(password, user.password);

        if (!result) {
          res.status(HTTP_STATUS.ANAUTHORIZED).json({
            statusCode: HTTP_STATUS.ANAUTHORIZED,
            ...new ErrorHttpResponse([`email_password_incorect`]),
          });
        }

        const certPath = path.join(
          `${__dirname}/../../certs/user-token/private.pem`
        );

        try {
          const token = await JwtSerice.signToken(
            { id: user.id },
            certPath,
            '24'
          );

          if (token) {
            res.status(HTTP_STATUS.CREATED).json(
              new SuccessHttpResponse({
                token,
              })
            );
          }
        } catch (error) {
          res.status(HTTP_STATUS.ANAUTHORIZED).json({
            statusCode: HTTP_STATUS.ANAUTHORIZED,
            ...new ErrorHttpResponse([`anaouthorized`]),
          });
        }
      }
    } catch (error) {
      console.log(error);

      res.status(HTTP_STATUS.BAD_REQUEST);
    }
  }
}
export default new UserController();
