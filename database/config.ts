import { Sequelize } from 'sequelize';
import { DB_CONFIG } from '../configs';

require('dotenv').config();

export const sequelizeConnection: Sequelize = new Sequelize(
  DB_CONFIG.db.database as string,
  DB_CONFIG.db.username as string,
  undefined,
  {
    dialect: DB_CONFIG.db.dialect,
    logging: false,
    port: 5432,
  }
);

(async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelizeConnection;
