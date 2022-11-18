require('dotenv').config()

import { User } from '../models/auth';

enum enviroments {
  DEVELOPMENT  = 'development',
  TEST  = 'test',
}

const isDevelopmentEnv = process.env.NODE_ENV === enviroments.DEVELOPMENT;
const isTestEnv = process.env.NODE_ENV !==  enviroments.TEST;

const dbInit = () => Promise.all([
  User.sync({ alter: isDevelopmentEnv || isTestEnv }),
])

export default dbInit;