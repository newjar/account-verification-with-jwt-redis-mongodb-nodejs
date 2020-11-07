const asyncRedisClient = require('./connection').getConnection();

class asyncRedis {
  constructor() {
    this.client = asyncRedisClient;
  }

  async setExpire(key, value) {
    await this.client.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24);
  }

  async getValue(key) {
    return await this.client.get(key);
  }

  async delValue(key) {
    return await this.client.del(key);
  }
}

module.exports = asyncRedis;
