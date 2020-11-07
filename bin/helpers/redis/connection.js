const redis = require('redis');
const asyncRedis = require('async-redis');
const config = require('../../configs/global_config');
const redisConfig = config.get('/redisConfig');

const redisClient = () => {
  const options = {
    host: redisConfig.host,
    port: redisConfig.port,
    password: !redisConfig.password ? undefined : redisConfig.password,
  };
  return redis.createClient(options);
};

const init = () => {
  redisClient();
};

const getConnection = () => {
  return asyncRedis.decorate(redisClient());
};

module.exports = {
  init,
  getConnection,
};
