import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS, SuccessHttpResponse } from '../../utils/http-response';
import { dataBase } from '../../models/index';
import { ErrorHttpResponse } from '../../utils/http-response/index';

class EventController {
  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(HTTP_STATUS.SUCCESS).json(
        new SuccessHttpResponse([{getEvents: true}])
      );
    } catch (error: any) {}
  }

  async createEvent(req: Request, res: Response, next: NextFunction) {


    try {

      const {name,dateTime,description,location,gudelinnes} = req.body;

      const event = await dataBase.Events.findOne({ where: { name: name.trim().toLowerCase() }, raw: true });

      if(event) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          new ErrorHttpResponse(['event_name_unique'])
        );
      }

      const newEvent = await dataBase.Events.create({})
      res.status(HTTP_STATUS.CREATED).json(
        new SuccessHttpResponse({

        })
      );

    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);
    }
  }

  async deleteEvenet(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(HTTP_STATUS.SUCCESS).json(
        new SuccessHttpResponse([{deleteEvent: true}])
      );
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);

    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(HTTP_STATUS.SUCCESS).json(
        new SuccessHttpResponse([{updateEvent: true}])

      );
    } catch (error: any) {
      res.status(error.statusCode || HTTP_STATUS.BAD_REQUEST);

    }
  }
}

export default new EventController();
