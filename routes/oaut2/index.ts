import { Application } from 'express';
import { RouteConfig } from '../helpers/RouteConfig';
import oauth2Controller from '../../controllers/oauth2-controller';
export class Oauth2Routes extends RouteConfig {
  constructor(app: Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes(): Application {

    this.app.route('/linkedin/authorize/url').get([oauth2Controller.getLinkedinAuthorizeUrl]);
    this.app.route('/linkedin/authorize').post([oauth2Controller.authorizeLinkedin]);

    return this.app;
  }
}
