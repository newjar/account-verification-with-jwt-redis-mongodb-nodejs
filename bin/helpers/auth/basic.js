const config = require('../../configs/global_config');

const auth = config.get('/basicVanillaAuth');

const basicVanillaAuth = async (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
  if (username && password && username === auth.username && password === auth.password) {
    return next();
  }
  res.send({ status: false, code: 401, data: null, message: 'Authentication required!' });
};

module.exports = {
  basicVanillaAuth,
};
