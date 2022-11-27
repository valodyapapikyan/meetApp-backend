export const getAuthorizationToken = (request: Request) => {
  let token: string = '';
  const hasBearerToken =
    request.headers['authorization'] &&
    request.headers['authorization'].startsWith('Bearer');

  if (hasBearerToken) {
    token = request.headers['authorization'].split(' ')[1];
  }
  if (request.headers['token']) {
    token = request.headers['authorization'].split(' ')[1];
  }

  return token;
};
