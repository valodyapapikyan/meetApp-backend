import { Response, NextFunction } from 'express';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import {
  SuccessHttpResponse,
  ErrorHttpResponse,
} from '../../utils/http-response/index';

import { dataBase } from '../../models/index';

class UserController {
  constructor() {}

  async signUp(req: any, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const data = {
        email,
        password: await bcrypt.hash(password, 10),
      };

      const user = await dataBase.User.create(data);

      if (user) {
        const token = jwt.sign(
          { userid: user.id, email },
          process.env.SECRET_KEY!,
          {
            expiresIn: '2h',
          }
        );

        user.token = token;
        return res.send(new SuccessHttpResponse({ user: { email } }));
      } else {
        return res.send(new ErrorHttpResponse([`Details are not correct`]));
      }
    } catch (error) {
      return res.send(new ErrorHttpResponse([`Details are not correct`]));
    }
  }

  async signIn(req: any, res: Response, next: NextFunction) {
    return res.status(200).json({ success: true });
  }
}
export default new UserController();
