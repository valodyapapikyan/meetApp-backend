import * as bodyParser from "body-parser";
import * as express from "express";
import { APILogger } from "./logger/api.logger";
import UserController  from "./controllers/user-controller";
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';

import dbInit from './database/init'

import 'dotenv/config'
import {RouteConfig} from "./routes/helpers/RouteConfig";
import {UserRoutes} from "./routes/user";

class App {

    public express: express.Application;
    public logger: APILogger;
    public db : any;

    private swaggerFile: any = (process.cwd()+"/swagger/swagger.json");
    private swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
    private customCss: any = fs.readFileSync((process.cwd()+"/swagger/swagger.css"), 'utf8');
    private swaggerDocument = JSON.parse(this.swaggerData);

    constructor() {
        this.express = express();
        this.middleware();

        const routes: Array<RouteConfig> = []
        routes.push(new UserRoutes(this.express));

        routes.forEach((route: RouteConfig) => {
            console.log(`Routes configured for ${route.getName()}`)
        })

        this.logger = new APILogger();
        this.express.get("/", (req, res, next) => {
            res.send("Typescript App works!!");
        });

        dbInit();

    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }


}

export default new App().express;