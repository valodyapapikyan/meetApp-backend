import { Response, Request, NextFunction } from 'express';
import { dataBase } from '../../models/index';
import {
  ErrorHttpResponse,
  SuccessHttpResponse,
} from '../../helpers/http-response';
import { HTTP_STATUS } from '../../enums';
import { CreateHttpError } from '../../helpers/http-response/index';
import { getStatusCode } from '../../helpers/utils';
import { LoginTicket } from 'google-auth-library';

class EventController {
  async getEvents(request: Request, response: Response, next: NextFunction) {
    try {
      const { count, rows } = await dataBase.Events.findAndCountAll({
        attributes: [
          'name',
          'dateTime',
          'description',
          'location',
          'gudelinnes',
          'eventID',
        ],
      });

      if (!count) {
        response.json(
          new ErrorHttpResponse(response.status, ['there_is_no_events'])
        );
      }

      response.json(
        new SuccessHttpResponse({
          count,
          events: rows,
        })
      );
    } catch (error: any) {
      response.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  }

  async createEvent(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        name,
        dateTime,
        description,
        location,
        gudelinnes,
        endDate,
        eventType,
      } = request.body;

      const event = await dataBase.Events.findOne({
        where: { name: name.trim().toLowerCase() },
        raw: true,
      });

      if (event) {
        new CreateHttpError(HTTP_STATUS.BAD_REQUEST, [
          'event_name_shoukd_beUnique',
        ]);
      }

      await dataBase.Events.create({
        name,
        dateTime,
        description,
        location,
        gudelinnes,
        endDate,
        eventType,
        creatorID: (<any>request).user.userID,
      });

      response.status(HTTP_STATUS.CREATED).json(
        new SuccessHttpResponse({
          message: 'event_successfully_created',
        })
      );
    } catch (error: any) {
      response.status(getStatusCode(error)).json(error);
    }
  }

  async deleteEvenet(request: Request, response: Response, next: NextFunction) {
    try {
      const { eventID } = request.params;

      const event = await dataBase.Events.findOne({
        where: { eventID },
        raw: true,
      });

      if (!event) {
        new CreateHttpError(HTTP_STATUS.NOT_FOUND, ['event_not_found']);
      }

      await dataBase.Events.destroy({ where: { eventID } });

      response.status(HTTP_STATUS.SUCCESS).json(
        new SuccessHttpResponse({
          message: 'event_successfully_deleted',
        })
      );
    } catch (error: any) {
      response.status(getStatusCode(error)).json(error);
    }
  }

  async updateEvent(request: Request, response: Response, next: NextFunction) {
    try {
      const { eventID } = request.params;
      const {
        name,
        dateTime,
        description,
        location,
        gudelinnes,
        endDate,
        eventType,
      } = request.body;

      //todo validate every item

      const event = await dataBase.Events.findOne({
        where: { eventID },
        raw: true,
      });

      if (!event) {
        new CreateHttpError(HTTP_STATUS.NOT_FOUND, ['event_not_found']);
      }

      await await dataBase.Events.update(
        {
          name,
          dateTime,
          description,
          location,
          gudelinnes,
          endDate,
          eventType,
        },
        { where: { eventID } }
      );

      response.status(HTTP_STATUS.SUCCESS).json(
        new SuccessHttpResponse({
          message: 'event_successfully_updated',
        })
      );
    } catch (error: any) {
      response.status(getStatusCode(error)).json(error);
    }
  }
}

export default new EventController();
