const validate = require('validate.js');
const wrapper = require('../utils/wrapper');
const mongoConnection = require('./connection');

class DB {
  constructor(config) {
    this.config = config;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const config = this.config.replace('//', '');
    const pattern = new RegExp('/([a-zA-Z0-9-]+)?');
    const dbName = pattern.exec(config);
    return dbName[1];
  }

  async findOne(parameter) {
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.findOne(parameter);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found');
      }
      return wrapper.data(recordset);
    } catch (err) {
      return wrapper.error(`Error Find One Mongo ${err.message}`);
    }
  }

  async insertOne(document) {
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.insertOne(document);
      if (recordset.result.n !== 1) {
        return wrapper.error('Failsed Insert Data to mongodb');
      }
      return wrapper.data(document);
    } catch (err) {
      return wrapper.error(`Error Insert Data to mongo${err.message}`);
    }
  }

  async updateOne(parameter, updateQuery) {
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const data = await db.update(parameter, updateQuery, { upsert: false });
      if (data.result.nModified >= 0) {
        const {
          result: { nModified },
        } = data;
        const recordset = await this.findOne(parameter);
        if (nModified === 1) {
          return wrapper.data(recordset.data);
        }
        return wrapper.data(recordset.data);
      }
      return wrapper.error('Failed update data');
    } catch (err) {
      return wrapper.error(`Error update Mongo ${err.message}`);
    }
  }
}

module.exports = DB;
