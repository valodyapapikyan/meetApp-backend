import { Response, Request, NextFunction } from 'express';
import { dataBase } from '../../models/index';
import {
  ErrorHttpResponse,
  SuccessHttpResponse,
} from '../../helpers/http-response';
import { HTTP_STATUS } from '../../enums';
import { CreateHttpError } from '../../helpers/http-response/index';
import { getStatusCode } from '../../helpers/utils';
import { Op } from 'sequelize';
import { UserModel } from '../../models/user-model';

interface CustomRequest extends Request {
  user?: any;
}
class EventController {
  async getEvents(request: Request, response: Response, next: NextFunction) {
    try {
      const { count, rows } = await dataBase.Event.findAndCountAll({
        attributes: [
          'name',
          'dateTime',
          'description',
          'location',
          'gudelinnes',
          'eventID',
        ],
      });

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
        speaker // {}
      } = request.body;

      const event = await dataBase.Event.findOne({
        where: { name: name.trim().toLowerCase() },
        raw: true,
      });

      if (event) {
        new CreateHttpError(HTTP_STATUS.BAD_REQUEST, [
          'event_name_should_beUnique',
        ]);
      }

      const {fullName: speakerFullName, talk, company:speakerComany} = speaker;

      await dataBase.Event.create({
        name,
        dateTime,
        description,
        location,
        gudelinnes,
        endDate,
        eventType,
        speakerFullName,
        talk,
        speakerComany,
        creatorID: (<any>request).user.userID,
      });

      response.status(HTTP_STATUS.CREATED).json(
        new SuccessHttpResponse({
          message: 'event_successfully_created',
        })
      );
    } catch (error: any) {
      console.log(error);
      
      response.status(getStatusCode(error)).json(error);
    }
  }

  async deleteEvenet(request: Request, response: Response, next: NextFunction) {
    try {
      const { eventID } = request.params;

      const event = await dataBase.Event.findOne({
        where: { eventID },
        raw: true,
      });

      if (!event) {
        new CreateHttpError(HTTP_STATUS.NOT_FOUND, ['event_not_found']);
      }

      await dataBase.Event.destroy({ where: { eventID } });

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

      const event = await dataBase.Event.findOne({
        where: { eventID },
        raw: true,
      });

      if (!event) {
        new CreateHttpError(HTTP_STATUS.NOT_FOUND, ['event_not_found']);
      }

      await await dataBase.Event.update(
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

  async attendeEvent(
    request: Request & CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { email, company, direction, experience, acceptenceOfTermsConds } =
        request.body;

      const { user } = request;
      const { eventID } = request.params;

      const loggedInUser: UserModel = await dataBase.User.findOne({
        where: {
          [Op.or]: [{ userName: user.userName }],
        },
        raw: true,
      });

      if (loggedInUser.linkedinId) {
        await dataBase.User.update(
          {
            email: email,
            company,
            direction,
            experience,
            acceptenceOfTermsConds,
            ...loggedInUser,
          },
          {
            where: { userName: user.userName },
          }
        );

        const userevents = await dataBase.UserEvents.create({
          userID: user.userID,
          eventID: eventID,
        });

        const userEvents = userevents.get({ plain: true });

        if (userEvents) {
          response
            .status(HTTP_STATUS.CREATED)
            .json(new SuccessHttpResponse(null));
        }
      }
    } catch (error) {
      response.status(getStatusCode(error)).json(error);
    }
  }
}

export default new EventController();
