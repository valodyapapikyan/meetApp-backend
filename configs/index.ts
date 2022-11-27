import { Dialect } from 'sequelize';
export const DB_CONFIG = {
  db: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    host: 'localhost',
    dialect: process.env.DB_DRIVER as Dialect,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    sync: Boolean(process.env.NODE_ENV === 'development'),
  },
} ;

export const SOCIAL_PROVIDERS_CREDENTIALS = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    apiKey: '',
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    apiKey: '',
  },
};

export const COAST_FACTOR = 10;
export const providers = {LINKEDIN: 'linkedin', GOOGLE: 'google', GITHUB: 'github'}