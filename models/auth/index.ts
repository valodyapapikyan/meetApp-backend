import { DataTypes, Model, BuildOptions } from 'sequelize';

import sequelize from '../../database/config';

interface UserModel extends Model {
  readonly id: number;
  password: string,
  email:string
}

// Need to declare the static model so `findOne` etc. use correct types.
type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export const User = <UserStatic>sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
