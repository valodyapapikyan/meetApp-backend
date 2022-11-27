import { DataTypes, Model, BuildOptions } from 'sequelize';

import sequelize from '../../database/config';

interface EventsModel extends Model {}

// Need to declare the static model so `findOne` etc. use correct types.
type EvantStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): EventsModel;
};

export const Events = <EvantStatic>sequelize.define('events', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateTime: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false,
  },
  endDate : {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  gudelinnes: {
    type: DataTypes.STRING,
    defaultValue: false,
    allowNull: true
  },
  eventID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    allowNull: true
  },
});
