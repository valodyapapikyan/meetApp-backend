import { Application } from 'express';
import { RouteConfig } from '../../helpers/RouteConfig';
import eventController from '../../controllers/events';
import userEventsController from '../../controllers/user-events'
import { protect } from '../../middlewares/auth';

export class EventsRoute extends RouteConfig {
  constructor(app: Application) {
    super(app, 'EventsRoute');
  }

  configureRoutes(): Application {
    this.app.route('/events').get([eventController.getEvents]);
    this.app.route('/events/create').post(protect,[eventController.createEvent]);
    this.app.route('/events/:eventID').delete(protect,[eventController.deleteEvenet]);
    this.app.route('/events/:eventID').put(protect,[eventController.updateEvent]);
    this.app.route('/events/attende/:eventID').post(protect,[eventController.attendeEvent])
    this.app.route('/events/user-events').get(protect,[userEventsController.getUserEvents])

    return this.app;
  }
}
