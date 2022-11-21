import { OAuth2Client } from 'google-auth-library';

const config = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    apiKey: '',
  },
};

export class Oaut2Service {
  constructor() {}

  static getGoogleAuthorizeUrl(redirectUrl: any) {
    return new Promise((resolve) => {
      const oAuth2Client = new OAuth2Client(
        config.google.clientId,
        config.google.clientId,
        redirectUrl
      );

      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ],
        prompt: 'consent',
      });

      resolve(authorizeUrl);
    });
  }

  static authorizeGoogle(code: string, redirectUrl: any) {
    return new Promise((resolve, reject) => {
      const oAuth2Client = new OAuth2Client(
        config.google.clientId,
        config.google.clientSecret,
        redirectUrl
      );

      oAuth2Client
        .getToken(code)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async getGoogleProfile(result, redirectUrl) {
    return new Promise((resolve, reject) => {
      const oAuth2Client = new OAuth2Client(
        config.google.clientId,
        config.google.clientSecret,
        redirectUrl
      );
      oAuth2Client.setCredentials(result.tokens);

      const url =
        'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses';
      oAuth2Client
        .request({ url })
        .then((profile) => {
          resolve(profile);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
