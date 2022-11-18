import { Request, Response, NextFunction } from 'express';

class UserController {
  constructor() {}
  async getUser(req: any, res: Response, next: NextFunction) {
    return res.status(200).json({
      success: true,
      data: [
        {
          name: 'John',
        },
        {
          name: 'Steve',
        },
      ],
    });
  }

  async signUp(req: any, res: Response, next: NextFunction) {
    return res.status(200).json({ success: true });
  }

  async signIn(req: any, res: Response, next: NextFunction) {
    return res.status(200).json({ success: true });
  }
}
export default new UserController();
