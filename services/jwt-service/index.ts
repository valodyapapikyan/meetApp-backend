import jwt from 'jsonwebtoken';
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
}
