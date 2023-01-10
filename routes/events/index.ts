import { Application } from 'express';
import { RouteConfig } from '../../helpers/RouteConfig';
import eventController from '../../controllers/events';
import userEventsController from '../../controllers/user-events';
import { protect } from '../../middlewares/auth';
import { ModelValidator } from '../../middlewares/validator';
import { eventValidationScheme } from '../../validation-schemas';
import { endpoints } from '../route-configs';

export class EventsRoute extends RouteConfig {
  constructor(app: Application) {
    super(app, 'EventsRoute');
  }

  configureRoutes(): Application {
    this.app
      .route(endpoints.event.paths.getEvents)
      .get([eventController.getEvents]);
    this.app
        .route(endpoints.event.paths.getEvent)
        .get([eventController.getEvent]);
    this.app
      .route(endpoints.event.paths.create)
      .post(protect, ModelValidator.validate(eventValidationScheme), [
        eventController.createEvent,
      ]);
    this.app
      .route(endpoints.event.paths.delete)
      .delete(protect, [eventController.deleteEvenet]);
    this.app
      .route(endpoints.event.paths.update)
      .put(protect, [eventController.updateEvent]);
    this.app
      .route(endpoints.event.paths.attende)
      .post(protect, [eventController.attendeEvent]);
    this.app
      .route(endpoints.event.paths.getUserEvents)
      .get(protect, [userEventsController.getUserEvents]);

    return this.app;
  }
}
