import * as express from 'express';
import { SOCIAL_PROVIDERS_CREDENTIALS } from '../configs';


export const routeMapper = <T extends abstract new (...args: any) => any>(
  routes: ConstructorParameters<T>[],
  appInstance: express.Application
) => {
  return routes.map((route: ConstructorParameters<T>) => {
    return new route(appInstance);
  });
};


export const setLinkedinAuthorizationHeaders = (accessToken: string) => {
  return {
    method: 'GET',
    uri: 'https://api.linkedin.com/v2/me',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'cache-control': 'no-cache',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  };
};

export const setEmailOptions = (accessToken: string) => {
  return {
    method: 'GET',
    uri: 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'cache-control': 'no-cache',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  };
};

export const getAccessTokenConfigs = (code: string, redirectUrl: string) => ({
  method: 'POST',
  uri: 'https://www.linkedin.com/oauth/v2/accessToken',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  form: {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUrl,
    client_id: SOCIAL_PROVIDERS_CREDENTIALS.linkedin.clientId,
    client_secret: SOCIAL_PROVIDERS_CREDENTIALS.linkedin.clientSecret,
  },
});


export const parse = (data:any) =>  JSON.parse(data);

export const getLinkedinAuthorizeUrl = (redirectUrl: string) => {
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${SOCIAL_PROVIDERS_CREDENTIALS.linkedin.clientId}&redirect_uri=${redirectUrl}&scope=r_liteprofile%20r_emailaddress%20`;

}

export const getEmail  = (target: object) => {
  return target['elements'][0]['handle~'].emailAddress
}