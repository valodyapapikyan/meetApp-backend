import { Application } from 'express';
import { RouteConfig } from '../helpers/RouteConfig';
import UserController from '../../controllers/user-controller';
// import { protect } from '../../middlewares/auth';

export class UserRoutes extends RouteConfig {
  constructor(app: Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes(): Application {
    this.app.route('/signin').get([UserController.signIn]);
    this.app.route('/signUp').post([UserController.signUp]);

    //VOR ROUTE -@ UZENQ PROTECT ANENQ
    // this.app.route('/ROUTE I ANUN').post(protect,[CONTROLLER]);

    return this.app;
  }
}
