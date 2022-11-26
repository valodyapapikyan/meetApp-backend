import { Response, Request, NextFunction } from 'express';
import { Oaut2Service } from '../../services/oauth2/index';
import {
  ErrorHttpResponse,
  HTTP_STATUS,
  SuccessHttpResponse,
} from '../../utils/http-response';
import { Op } from 'sequelize';

import { dataBase } from '../../models/index';
import { IProfile } from '../../interfaces';
import { getEmail } from '../../utils';

class Oauth2Controller {

  async getLinkedinAuthorizeUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { redirectUrl } = req.query;
      const URL = Oaut2Service.getLinkedinAuthorizeUrl(redirectUrl);

      if (URL) {
        res.status(HTTP_STATUS.CREATED).json(
          new SuccessHttpResponse({
            URL,
          })
        );
      }
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  }

  async authorizeLinkedin(
    request: any,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { code, redirectUrl } = request.body;
      const social: Partial<IProfile> = {};
      const socialUser: IProfile = {} as IProfile;

      const result = await Oaut2Service.authorizeLinkedinService(
        code,
        redirectUrl
      );

      const data: any = await Oaut2Service.getLinkedinProfile(
        result.access_token
      );

      const profile = {
        ...JSON.parse(data.profile),
        ...JSON.parse(data.email),
      };

      social.linkedinId = profile.id;

      socialUser.email = getEmail(profile);
      socialUser.firstName = profile.firstName;
      socialUser.lastName = profile.lastName;

      const user = await dataBase.User.findOne({
        where: {
          [Op.or]: [
            { linkedinId: social.linkedinId },
            { email: socialUser.email },
          ],
        },
        raw: true,
      });


      let accessToken;

      if (user) {
        accessToken = await Oaut2Service.signInUserWithSocial(user, {
          linkedinId: social.linkedinId,
        });
      }

      if (!user) {
        accessToken = await Oaut2Service.signUpUserWithSocial(profile, social);
      }

      response.status(HTTP_STATUS.CREATED).json(
        new SuccessHttpResponse({
          accessToken,
        })
      );
    } catch (err) {
      console.log(err);
      
      response.status(HTTP_STATUS.BAD_REQUEST).json({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        ...new ErrorHttpResponse([`bad_requset_linkedin_autorize`]),
      });
    }
  }
}

export default new Oauth2Controller();