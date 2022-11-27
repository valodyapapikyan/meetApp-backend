require('dotenv').config()

import { dataBase } from "../models";

enum enviroments {
  DEVELOPMENT  = 'development',
  TEST  = 'test',
}

const isDevelopmentEnv = process.env.NODE_ENV === enviroments.DEVELOPMENT;
const isTestEnv = process.env.NODE_ENV !==  enviroments.TEST;

const dbInit = () => Promise.all([
  dataBase.User.sync({ alter: isDevelopmentEnv || isTestEnv }),
  dataBase.Events.sync({ alter: isDevelopmentEnv || isTestEnv }),
])

export default dbInit;