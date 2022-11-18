import { Application } from 'express';
import { RouteConfig } from '../helpers/RouteConfig';
import UserController from '../../controllers/user-controller';

export class UserRoutes extends RouteConfig {
  constructor(app: Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes(): Application {
    this.app.route('/user').get([UserController.getUser]);
    this.app.route('/signin').get([UserController.signIn]);
    this.app.route('/signUp').get([UserController.signUp]);

    return this.app;
  }
}
