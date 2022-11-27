import { Application } from 'express';
import { RouteConfig } from '../helpers/RouteConfig';
import userAuthorizationController from '../../controllers/user-authorization';
export class Oauth2Routes extends RouteConfig {
  constructor(app: Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes(): Application {

    this.app.route('/linkedin/authorize/url').get([userAuthorizationController.getLinkedinAuthorizeUrl]);
    this.app.route('/linkedin/authorize').post([userAuthorizationController.authorizeLinkedin]);

    return this.app;
  }
}