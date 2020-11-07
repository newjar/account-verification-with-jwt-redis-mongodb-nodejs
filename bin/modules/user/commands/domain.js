const wrapper = require('../../../helpers/utils/wrapper');
const Command = require('./command');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('../../../helpers/bcrypt/bcrypt');
const Query = require('../queries/query');
const jwt = require('../../../helpers/auth/jwt');

class User {
  constructor(db) {
    this.command = new Command(db);
    this.query = new Query(db);
  }

  async registerUser(payload) {
    const { email, password } = payload;
    const checkUser = await this.query.findOneUser({ email });
    if (!checkUser.err) {
      return wrapper.error({ code: 409, message: 'User Already Exist!' });
    }
    const encryptedPassword = await bcrypt.encrypt(password);

    const data = {
      userId: uuidv4(),
      email,
      password: encryptedPassword,
      isActive: false,
    };

    const { data: result } = await this.command.insertOneUser(data);
    if (result.err) {
      return wrapper.error({ code: 500, message: 'Failed Insert Data' });
    }
    const dataUser = {
      sub: result.userId,
    };
    const token = await jwt.generateJwtToken(dataUser);
    this.command.setValueRedis(result.userId, token);
    return wrapper.data(result);
  }

  async loginUser(payload) {
    const { email, password } = payload;
    const checkUser = await this.query.findOneUser({ email });
    if (checkUser.err) {
      return wrapper.error({ code: 404, message: 'User Not Found' });
    }
    const dataUser = checkUser.data;
    if (dataUser.isActive === false) {
      return wrapper.error({ code: 409, message: 'User is not active!' });
    }
    const checkPassword = await bcrypt.compare(password, dataUser.password);
    if (!checkPassword) {
      return wrapper.error({ code: 409, message: 'Password not match!' });
    }
    const data = {
      email,
      sub: dataUser.userId,
    };
    const token = await jwt.generateJwtToken(data);
    const result = {
      token: token,
    };
    return wrapper.data(result);
  }

  async verificationUser(token) {
    const decodedToken = await jwt.decodedJwtToken(token);
    if (decodedToken.err) {
      return wrapper.error({ code: 403, message: 'Token invalid or expired!' });
    }
    const userId = decodedToken.sub;
    const checkUser = await this.query.findOneUser({ userId });
    if (checkUser.err) {
      return wrapper.error({ code: 404, message: 'User Not Found!' });
    }
    const dataUser = checkUser.data;
    if (dataUser.isActive === true) {
      return wrapper.error({ code: 409, message: 'User Already Actived!' });
    }
    this.command.updateOneUser({ userId }, { $set: { isActive: true } });
    this.command.delValueRedis(userId);
    const result = {
      email: dataUser.email,
      isActive: true,
    };
    return wrapper.data(result);
  }
}

module.exports = User;
