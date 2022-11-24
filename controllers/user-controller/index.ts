import { Response, NextFunction } from 'express';
import path from 'path';
import bcrypt from 'bcrypt'

import {
  SuccessHttpResponse,
  ErrorHttpResponse,
  HTTP_STATUS,
} from '../../utils/http-response/index';

import { dataBase } from '../../models/index';
import { COAST_FACTOR } from '../../configs';
import { JwtSerice } from '../../services/jwt-service';

class UserController {

  async signUp(request: any, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;

      const user = await dataBase.User.findOne({
        where: { email: email.toLowerCase().trim() },
        raw: true,
      });

      if (user) {
        response.status(HTTP_STATUS.BAD_REQUEST).json({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          ...new ErrorHttpResponse([`user_already_exist`]),
        });
      }

      const userData = await dataBase.User.create({
        email: email.toLowerCase().trim(),
        password: await bcrypt.hash(password, COAST_FACTOR),
      });

      const { id } = userData.get({ plain: true });

      response.status(HTTP_STATUS.CREATED).json(
        new SuccessHttpResponse({
          id,
        })
      );
    } catch (error) {
      response.status(HTTP_STATUS.BAD_REQUEST);
    }
  }

  async signIn(request: any, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        response.status(HTTP_STATUS.BAD_REQUEST).json({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          ...new ErrorHttpResponse([`email_password_required`]),
        });
      }

      const user = await dataBase.User.findOne({
        where: { email },
        raw: true,
      });

      if (!user) {
        response.status(HTTP_STATUS.BAD_REQUEST).json({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          ...new ErrorHttpResponse([`incorect_email_password`]),
        });
      }

      //todo , need to check is user verified (with OTP or email confirmation)

      if (user) {
        const result = await bcrypt.compare(password, user.password);

        if (!result) {
          response.status(HTTP_STATUS.ANAUTHORIZED).json({
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
            response.status(HTTP_STATUS.CREATED).json(
              new SuccessHttpResponse({
                token,
              })
            );
          }
        } catch (error) {
          response.status(HTTP_STATUS.ANAUTHORIZED).json({
            statusCode: HTTP_STATUS.ANAUTHORIZED,
            ...new ErrorHttpResponse([`anaouthorized`]),
          });
        }
      }
    } catch (error) {
      console.log(error);

      response.status(HTTP_STATUS.BAD_REQUEST);
    }
  }
}
export default new UserController();
