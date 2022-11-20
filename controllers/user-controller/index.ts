import { Response, NextFunction } from 'express';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import {
  SuccessHttpResponse,
  ErrorHttpResponse,
  HTTP_STATUS,
} from '../../utils/http-response/index';

import { dataBase } from '../../models/index';
import moment from 'moment';

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
        password: await bcrypt.hash(password, 10),
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
    return res.status(200).json({ success: true });
  }
}
export default new UserController();
