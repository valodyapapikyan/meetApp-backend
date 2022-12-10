import { Response, Request, NextFunction } from 'express';
import { Op } from 'sequelize';
import {
  CreateHttpError,
  ErrorHttpResponse,
  SuccessHttpResponse,
} from '../../helpers/http-response';

import { SocialProviderService } from '../../services/social-provider/index';

import { dataBase } from '../../models/index';
import { IProfile } from '../../interfaces';
import { getEmail, getStatusCode } from '../../helpers/utils';
import { providers } from '../../configs';
import { HTTP_STATUS } from '../../enums';

class UserAuthorizationController {
  async getLinkedinAuthorizeUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { redirectUrl } = req.query;
      const url = SocialProviderService.getLinkedinAuthorizeUrl(redirectUrl);

      if (!url) {
        new CreateHttpError(HTTP_STATUS.BAD_REQUEST, ['please_try_again']);
      }

      res.status(HTTP_STATUS.CREATED).json(
        new SuccessHttpResponse({
          url,
        })
      );
    } catch (error: any) {
      res.status(getStatusCode(error)).json(error);
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

      const result = await SocialProviderService.authorizeLinkedinService(
        code,
        redirectUrl
      );

      const data: any = await SocialProviderService.getLinkedinProfile(
        result.access_token
      );

      const profile = {
        ...JSON.parse(data.profile),
        ...JSON.parse(data.email),
      };

      social.linkedinId = profile.id;

      socialUser.userName = getEmail(profile);
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

      let accessToken: unknown;

      if (user) {
        accessToken = await SocialProviderService.signInUserWithSocial(user, {
          linkedinId: social.linkedinId, // USE DATE, NAME, AND MORE ADDITIONAL FIELDS
        });
      }

      if (!user) {
        accessToken = await SocialProviderService.signUpUserWithSocial(
          profile,
          social,
          providers.LINKEDIN
        );
      }

      response.status(HTTP_STATUS.CREATED).json(
        new SuccessHttpResponse({
          accessToken,
        })
      );
    } catch (err: any) {
      response
        .status(getStatusCode(err))
        .json(
          new ErrorHttpResponse(getStatusCode(err), ['something_wen_wrong'])
        );
    }
  }
}

export default new UserAuthorizationController();
