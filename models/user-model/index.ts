import { DataTypes, Model, BuildOptions } from 'sequelize';

import sequelize from '../../database/config';

interface UserModel extends Model {}

// Need to declare the static model so `findOne` etc. use correct types.
type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export const User = <UserStatic>sequelize.define('users', {
  linkedinId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
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
  userID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    allowNull: true,
  },
  provider: {
    type: DataTypes.STRING, //should be  DataTypes.ENUM('linkedin', 'google', 'github')
    allowNull: true,
    defaultValue: null
  },
});
