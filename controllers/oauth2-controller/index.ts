import { Response, Request, NextFunction } from 'express';
import { Oaut2Service } from '../../services/oauth2/index';
import { HTTP_STATUS, SuccessHttpResponse } from '../../utils/http-response';

class Oauth2Controller {
  constructor() {}

  async getGoogleAuthorizeUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { redirectUrl } = req.query;

      const URL = await Oaut2Service.getGoogleAuthorizeUrl(redirectUrl);

      if (URL) {
        res.status(HTTP_STATUS.CREATED).json(
          new SuccessHttpResponse({
            URL,
          })
        );
      }
    } catch (error) {
      res.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  };

  async authorizeGoogle (req: Request, res: Response, next: NextFunction) {
    try {
      const { code, redirectUrl } = req.body;
      const social = {};
      const socialUser = {};

      const result = await Oaut2Service.authorizeGoogle(code, redirectUrl);
      const profile = await Oaut2Service.getGoogleProfile(result, redirectUrl);
      console.log(result);
      

      // social.googleId = profile.data.resourceName;
      // socialUser.email = profile.data.emailAddresses[0].value.toLowerCase();
      // socialUser.firstName = profile.data.names[0].givenName;
      // socialUser.lastName = profile.data.names[0].familyName;

      // const user = await db.User.findOne({
      //     where: { [Op.or]: [ { googleId: social.googleId }, { email: socialUser.email } ] },
      //     raw: true
      // });

      let token = null;

      // if (user) token = await HelperService.signInUserWithSocial(user, { googleId: social.googleId });
      // if (!user) token = await HelperService.signUpUserWithSocial(socialUser, social);

      res.json({ token:'exaca' });
  } catch (err) {
      console.log(err);
      res.status(err.statusCode || 400).json({ message: err.message || err });
  }
  }
}

export default  new Oauth2Controller();
