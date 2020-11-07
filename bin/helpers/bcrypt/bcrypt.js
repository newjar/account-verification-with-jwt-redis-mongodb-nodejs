const bcrypt = require('bcrypt');

const saltRounds = 10;

const encrypt = async (password) => {
  const result = bcrypt.hash(password, saltRounds).then((encryptedPassword) => {
    return encryptedPassword;
  });
  return result;
};

const decrpyt = async (password, encryptedPassword) => {
  await bcrypt.compare(password, encryptedPassword).then((result) => {
    return result;
  });
};

const compare = async (password, encryptedPassword) => {
  const result = await bcrypt.compare(password, encryptedPassword).then((comparedPassword) => {
    return comparedPassword;
  });
  return result;
};

module.exports = {
  encrypt,
  decrpyt,
  compare,
};
