const User = require('./domain');
const Mongo = require('../../../helpers/mongodb/db');
const config = require('../../../configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));

const registerUser = async (payload) => {
  const user = new User(db);
  const postData = async (payload) => user.registerUser(payload);
  return postData(payload);
};

const loginUser = async (payload) => {
  const user = new User(db);
  const postLogin = async (payload) => user.loginUser(payload);
  return postLogin(payload);
};

const verificationUser = async (token) => {
  const user = new User(db);
  const verifUser = async (token) => user.verificationUser(token);
  return verifUser(token);
};

module.exports = {
  registerUser,
  loginUser,
  verificationUser,
};
