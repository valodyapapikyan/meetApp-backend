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
    allowNull: false,
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
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  }
});
