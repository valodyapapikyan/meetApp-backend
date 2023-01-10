import { DataTypes, Model, BuildOptions } from 'sequelize';

import sequelize from '../../database/config';

interface EventsModel extends Model {}

// Need to declare the static model so `findOne` etc. use correct types.
type EvantStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): EventsModel;
};

export const Event = <EvantStatic>sequelize.define('events', {
  eventID: {
    type: DataTypes.UUID, //todo use uuidv4
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  time : {
    type: DataTypes.TIME,
    allowNull: true,
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
  creatorID : {
    type: DataTypes.UUID,
    allowNull: false,
  },
  speakerFullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  speakerCompany: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeFrame: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hasTimeFrame: {
    type:DataTypes.BOOLEAN,
    allowNull: false
  },
  image: {
    type:DataTypes.TEXT('long'),
    allowNull: true
  }

},{timestamps: false});
