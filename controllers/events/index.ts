import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS, SuccessHttpResponse } from '../../utils/http-response';
import { dataBase } from '../../models/index';
import { ErrorHttpResponse } from '../../utils/http-response/index';

class EventController {
  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { count, rows } = await dataBase.Events.findAndCountAll({});

      if (count) {
        return res
          .status(HTTP_STATUS.SUCCESS)
          .json(new SuccessHttpResponse({ count, events: rows }));
      }
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(new ErrorHttpResponse(['there_is_no_events']));
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  }

  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        dateTime,
        description,
        location,
        gudelinnes,
        endDate,
        eventType,
      } = req.body;

      const event = await dataBase.Events.findOne({
        where: { name: name.trim().toLowerCase() },
        raw: true,
      });

      if (event) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(new ErrorHttpResponse(['event_name_unique']));
      }

      const { dataValues: newEvent } = await dataBase.Events.create({
        name,
        dateTime,
        description,
        location,
        gudelinnes,
        endDate,
        eventType,
      });

      console.log(newEvent);

      res
        .status(HTTP_STATUS.CREATED)
        .json(new SuccessHttpResponse({ ...newEvent }));
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  }

  async deleteEvenet(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventID } = req.params;

      const event = await dataBase.Events.findOne({
        where: { eventID },
        raw: true,
      });

      if (!event) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(
            new SuccessHttpResponse({ data: null, message: 'event_not_found' })
          );
      }

      await dataBase.Events.destroy({ where: { eventID } });
      res
        .status(HTTP_STATUS.SUCCESS)
        .json(new SuccessHttpResponse({ message: 'event_deleted' }));
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventID } = req.params;
      const {
        name,
        dateTime,
        description,
        location,
        gudelinnes,
        endDate,
        eventType,
      } = req.body;

      //todo validate every item

      const event = await dataBase.Events.findOne({
        where: { eventID },
        raw: true,
      });

      if(!event) {
        return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(
          new SuccessHttpResponse({ data: null, message: 'event_not_found' })
        );
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

      res
        .status(HTTP_STATUS.SUCCESS)
        .json(new SuccessHttpResponse({message: 'model_successfuly_updated'}));
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export default new EventController();
