import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../../enums';
import { CreateHttpError } from '../../helpers/http-response';

export class JwtSerice {
  static async signToken(data: any, cert: string, expireIn: string) {
    return new Promise((resolve, reject) => {
      jwt.sign(data, cert, (error, token) => {
        if (error) {
          reject(error);
        }
        resolve(token);
      });
    });
  }

  static async verifyJwtToken(token, cert) {
    return new Promise((resolve) => {
      jwt.verify(token, cert, (err, decoded) => {
        if (err) {
          new CreateHttpError(HTTP_STATUS.ANAUTHORIZED, ['anuthorized']);
        }
        resolve(decoded);
      });
    });
  }
}
