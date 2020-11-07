require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  mongoDbUrl: process.env.MONGODB_URL,
  redisConfig: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  basicVanillaAuth: {
    username: process.env.BASIC_VANILLA_USERNAME,
    password: process.env.BASIC_VANILLA_PASSWORD,
  },
};

const store = new confidence.Store(config);
exports.get = (key) => store.get(key);
