import { DataTypes, Model, BuildOptions } from 'sequelize';

import sequelize from '../../database/config';

export interface IUserEvents extends Model {
  userID: string;
  eventID: string;
}

export class UserEventsModel extends Model<IUserEvents> {
  declare userID: string;
  declare eventID: string;
}

// Need to declare the static model so `findOne` etc. use correct types.
type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserEventsModel;
};

export const UserEvents = <UserStatic>sequelize.define(
  'userEvents',
  {
    userEventID: {
      type: DataTypes.UUID, //todo use uuidv4
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    userID: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    eventID: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: false }
);
