import {
  DataTypes,
  Model,
  BuildOptions,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../../database/config';

export interface ISuerModel extends Model {
  company: string;
  direction: string;
  experience: number;
  acceptenceOfTermsConds: boolean;
  linkedinId: string;
  email: string;
  userName: string,
  verified: boolean;
  lastName: string;
  firstName: string;
  profilePicture: string;
  userID: string;
  provider: string;
}

export class UserModel extends Model<
  InferAttributes<ISuerModel>,
  InferCreationAttributes<ISuerModel>
> {
  declare company: CreationOptional<string>;
  declare email: CreationOptional<string>;
  declare direction: CreationOptional<string>;
  declare experience: CreationOptional<number>;
  declare acceptenceOfTermsConds: CreationOptional<boolean>;
  declare linkedinId: string
  declare userEvents: CreationOptional<any>; // many to many kapi hamar
}

// Need to declare the static model so `findOne` etc. use correct types.
type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export const User = <UserStatic>sequelize.define('users',{
  userID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  direction: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  acceptenceOfTermsConds: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  linkedinId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastName: {
    type: DataTypes.STRING,
    set(val: string) {
      this.setDataValue('lastName', val ? val.trim().toUpperCase() : null);
    },
  },
  firstName: {
    type: DataTypes.STRING,
    set(val: string) {
      this.setDataValue('firstName', val ? val.trim().toUpperCase() : null);
    },
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  provider: {
    type: DataTypes.STRING, //should be  DataTypes.ENUM('linkedin', 'google', 'github')
    allowNull: true,
    defaultValue: null,
  },
}, {timestamps: false});
