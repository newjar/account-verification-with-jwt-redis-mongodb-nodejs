const Redis = require('../../../helpers/redis/redis');

class Command {
  constructor(db) {
    this.db = db;
    this.redis = new Redis();
  }

  async insertOneUser(document) {
    this.db.setCollection('user');
    const result = await this.db.insertOne(document);
    return result;
  }

  async updateOneUser(userId, document) {
    this.db.setCollection('user');
    const result = await this.db.updateOne(userId, document);
    return result;
  }

  async getValueRedis(key) {
    this.redis.getValue(`userId-${key}`);
  }

  async setValueRedis(key, value) {
    this.redis.setExpire(`userId-${key}`, value);
  }

  async delValueRedis(key) {
    this.redis.delValue(`userId-${key}`);
  }
}

module.exports = Command;
