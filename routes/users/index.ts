import { Application } from 'express';
import { RouteConfig } from '../../helpers/RouteConfig';
import userAuthorizationController from '../../controllers/user-authorization';
import { endpoints } from '../route-configs/index';
export class Oauth2Routes extends RouteConfig {
  constructor(app: Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes(): Application {
    this.app
      .route(endpoints.user.paths.getLinkedinAuthorizeUrl)
      .get([userAuthorizationController.getLinkedinAuthorizeUrl]);
    this.app
      .route(endpoints.user.paths.authorize)
      .post([userAuthorizationController.authorizeLinkedin]);

    return this.app;
  }
}
