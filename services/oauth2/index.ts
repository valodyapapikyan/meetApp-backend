import { v4 as uuidv4 } from 'uuid';
import rp from 'request-promise';
import moment from 'moment';
import bcrypt from 'bcrypt';
import path from 'path';

import { dataBase } from '../../models/index';
import {
  getAccessTokenConfigs,
  getEmail,
  getLinkedinAuthorizeUrl,
  setEmailOptions,
  setLinkedinAuthorizationHeaders,
} from '../../utils';

import { JwtSerice } from '../jwt-service';
import { COAST_FACTOR } from '../../configs';

const certPath = path.join(`${__dirname}/../../certs/user-token/private.pem`);
export class Oaut2Service {
  static getLinkedinAuthorizeUrl(redirectUrl) {
    return getLinkedinAuthorizeUrl(redirectUrl);
  }

  static authorizeLinkedinService(code, redirectUrl) {
    return new Promise<Promise<{ access_token: string }>>((resolve, reject) => {
      rp(getAccessTokenConfigs(code, redirectUrl))
        .then((result) => {
          const data = JSON.parse(result);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private static async getProfile(accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return rp(setLinkedinAuthorizationHeaders(accessToken))
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  private static async getEmail(accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return rp(setEmailOptions(accessToken))
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  static async collectProfile(accessToken: string) {
    try {
      const [profile, email] = await Promise.all<Promise<[any, any]>>([
        this.getProfile(accessToken),
        this.getEmail(accessToken),
      ]);

      return { profile, email };
    } catch (error) {
      return undefined;
    }
  }

  static getLinkedinProfile(accessToken) {
    return this.collectProfile(accessToken);
  }

  static async signInUserWithSocial(user, social) {

    await dataBase.User.update(social, {
      where: { linkedinId: user.linkedinId },
    });

    return Promise.resolve(
      await JwtSerice.signToken({ id: user.linkedinId }, process.env.SECRET_KEY, '24')
    );
  }

  static async signUpUserWithSocial(profile, social) {
    const password = uuidv4();

    const hash = await bcrypt.hash(password, COAST_FACTOR);

    const { localizedFirstName, localizedLastName, profilePicture } = profile;

    const userData = await dataBase.User.create({
      email: getEmail(profile),
      password: hash,
      firstName: localizedFirstName,
      lastName: localizedLastName,
      profilePicture: profilePicture?.displayImage || '',
      verified: true,
      ...social,
      createdAt: moment.utc().valueOf(),
    });

    const user = userData.get({ plain: true });


    return Promise.resolve(
      await JwtSerice.signToken({ id: user.linkedinId }, process.env.SECRET_KEY, '24')
    );
  }
}
