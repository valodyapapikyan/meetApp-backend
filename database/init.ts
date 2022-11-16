require('dotenv').config()

import Auth  from '../models/auth'


enum enviroments {
  DEVELOPMENT  = 'development',
  TEST  = 'test',
}

const isDevelopmentEnv = process.env.NODE_ENV === enviroments.DEVELOPMENT;
const isTestEnv = process.env.NODE_ENV !==  enviroments.TEST;

const dbInit = () => Promise.all([
  Auth.sync({ alter: isDevelopmentEnv || isTestEnv }),
])

export default dbInit;