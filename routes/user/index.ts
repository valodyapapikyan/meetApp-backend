import { Router,Application, Request,Response } from "express";
import {RouteConfig} from "../helpers/RouteConfig";
import UserController from "../../controllers/user-controller";

export class UserRoutes extends RouteConfig {

  constructor(app:Application) {
   super(app, "UserRoutes")
  }

  configureRoutes(): Application {
    this.app.route('/users').get([UserController.getUsers]);
    return this.app;
  }
}