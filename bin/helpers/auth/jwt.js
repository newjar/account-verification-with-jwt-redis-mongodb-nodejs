const jwt = require('jsonwebtoken');
const wrapper = require('../utils/wrapper');
const secretKey = 'newjar.github.io_secret_key';

const generateJwtToken = async (payload) => {
  const options = {
    audience: 'newjar_audience',
    issuer: 'newjar',
    expiresIn: '1h',
  };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

const decodedJwtToken = async (token) => {
  const options = {
    audience: 'newjar_audience',
    issuer: 'newjar',
  };
  if (!token) {
    return wrapper.error({ code: 400, message: 'Invalid token!' });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, secretKey, options);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return wrapper.error({ code: 501, message: 'Access token expired!' });
    }
    return wrapper.error({ code: 401, message: 'Token is not valid!' });
  }
  return decoded;
};

module.exports = {
  generateJwtToken,
  decodedJwtToken,
};
