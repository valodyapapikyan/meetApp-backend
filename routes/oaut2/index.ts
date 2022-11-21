import { Application } from 'express';
import { RouteConfig } from '../helpers/RouteConfig';
import UserController from '../../controllers/user-controller';
import oauth2Controller from '../../controllers/oauth2-controller';
// import { protect } from '../../middlewares/auth';

export class Oauth2Routes extends RouteConfig {
  constructor(app: Application) {
    super(app, 'UserRoutes');
  }

  //https://console.cloud.google.com/apis/credentials?project=automated-ray-156816

  //https://www.youtube.com/watch?v=pBVAyU4pZOU&ab_channel=DAIMTODeveloperTips

  configureRoutes(): Application {
    this.app.route('/google/authorize').post([oauth2Controller.authorizeGoogle]);
    this.app.route('/google/authorize/url').get([oauth2Controller.getGoogleAuthorizeUrl]);

    return this.app;
  }
}
