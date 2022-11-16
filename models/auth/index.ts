import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../../database/config';

interface IAuthModel {
    id: number;
    name: string;
}

export interface TagInput extends Optional<IAuthModel,null> {}

export interface TagOutput extends Required<IAuthModel> {}

class Auth extends Model<IAuthModel, TagInput> implements IAuthModel {
    public id!: number;
    public name!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Auth.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
  sequelize: sequelizeConnection,
  paranoid: true
})

export default Auth