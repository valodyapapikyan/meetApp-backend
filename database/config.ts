import diff from 'microdiff'
import {  Model, Sequelize } from 'sequelize'
import { SequelizeHooks } from 'sequelize/types/hooks'
import { DB_CONFIG } from '../configs';

import { LocalCache } from '../lib/local-cache';
require('dotenv').config()

// const isTest = process.env.NODE_ENV === 'test'

// const dbName = isTest ? process.env.TEST_DB_NAME as string : process.env.DB_NAME as string

const localCache = LocalCache.getInstance();

const hooks: Partial<SequelizeHooks<Model<any, any>, any, any>> = {
  afterUpdate: (instance: Model<any, any>) => {
    const cacheKey = `${instance.constructor.name.toLowerCase()}s`

    const currentData = instance.get({ plain: true })

    if (!localCache.hasKey(cacheKey)) {
      return
    }

    const listingData = localCache.get<any>(cacheKey) as any[]
    const itemIndex = listingData.findIndex((it) => it.id === instance.getDataValue('id'))
    const oldItemData = ~itemIndex ? listingData[itemIndex] : {}

    const instanceDiff = diff(oldItemData, currentData)

    if (instanceDiff.length > 0) {
      listingData[itemIndex] = currentData
      localCache.set(cacheKey, listingData)
    }
  },
  afterCreate: (instance: Model<any, any>) => {
    const cacheKey = `${instance.constructor.name.toLowerCase()}s`
    const currentData = instance.get({ plain: true })

    if (!localCache.hasKey(cacheKey)) {
      return
    }

    const listingData = localCache.get<any>(cacheKey) as any[]
    listingData.push(currentData)

    localCache.set(cacheKey, listingData)
  },
}

const sequelizeConnection: Sequelize = new Sequelize( DB_CONFIG.db.database,  DB_CONFIG.db.username, null, {
  dialect: DB_CONFIG.db.dialect,
  logging: false,
  define: {hooks},
  port: 5432
});

(async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelizeConnection