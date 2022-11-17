import express, {Application} from "express";

export abstract  class RouteConfig {
     app: Application; // application -i instancena
     name: string; //route i annuna

     protected constructor(app: Application, name: string) {
         this.app = app;
         this.name = name;
         this.configureRoutes();
     }

     getName() {
         return this.name
     }

     abstract configureRoutes(): Application
}