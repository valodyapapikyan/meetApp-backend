import * as bodyParser from 'body-parser';
import express from 'express';
import { APILogger } from './logger/api.logger';
import * as fs from 'fs';
import dbInit from './database/init';

import 'dotenv/config';

import { RouteConfig } from './routes/helpers/RouteConfig';
import { Oauth2Routes } from './routes/oaut2';
import {EventsRoute} from './routes/events';

import { routeMapper } from './utils';

const cors = require("cors");


class App {
  public express: express.Application;
  public logger: APILogger;
  public db: any;
  routes: Array<RouteConfig>;

  private swaggerFile: any = process.cwd() + '/swagger/swagger.json';
  private swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
  private customCss: any = fs.readFileSync(
    process.cwd() + '/swagger/swagger.css',
    'utf8'
  ); // svagerri styleri  hamar

  private swaggerDocument = JSON.parse(this.swaggerData);

  constructor() {
    this.express = express();
    this.middleware();
    this.routes = [];

    this.logger = new APILogger();

    this.express.get('/', (req, res, next) => {
      res.send('App works!!');
    });

    dbInit();
    this.init();
  }

  private init(): void {

    routeMapper([Oauth2Routes,EventsRoute], this.express).forEach((route) =>
      this.routes.push(route)
    );
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cors())

  }
}

export default new App().express;


