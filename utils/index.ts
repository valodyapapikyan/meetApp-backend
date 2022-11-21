import * as express from 'express';

export const routeMapper = <T extends abstract new (...args: any) => any>(
  routes: ConstructorParameters<T>[],
  appInstance: express.Application
) => {
  return routes.map((route: ConstructorParameters<T>) => {
    return new route(appInstance);
  });
};
