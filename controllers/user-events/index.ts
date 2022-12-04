import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS } from '../../enums';
import {
  CreateHttpError,
  SuccessHttpResponse,
} from '../../helpers/http-response';
import { UserEvents } from '../../models/user-events/index';
import { dataBase } from '../../models/index';
import { getStatusCode } from '../../helpers/utils';
import { UserModel } from '../../models/user-model';
import { IRowModel } from '../../interfaces';
import { Op } from 'sequelize';

//todo mtaci sra masin
interface CustomRequest extends Request {
  user?: any;
}

class UserEventsController {
  async getUserEvents(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const {
        user: { userID },
      } = request;

      //join users and userEvents
      const { rows }: IRowModel<UserModel> =
        await dataBase.User.findAndCountAll({
          where: { userID },
          attributes: [],
          include: [{ model: dataBase.UserEvents, as: 'userEvents' }],
          nest: true,
          raw: true,
        });

      const getEventIds = () =>
        rows.map(({ userEvents }) => userEvents).map(({ eventID }) => eventID);

        //get current userEvents
      const { rows: events, count } = await dataBase.Event.findAndCountAll({
        where: {
          eventID: {
            [Op.in]: getEventIds(),
          },
        },
        raw: true,
      });

      response.status(HTTP_STATUS.SUCCESS).json(
        new SuccessHttpResponse({
          events,
          count,
        })
      );
    } catch (error: any) {
      response
        .status(getStatusCode(error))
        .json({ message: 'something_went_wrong' });
    }
  }
}

export default new UserEventsController();
