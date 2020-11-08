const express = require('express');
const { basicVanillaAuth } = require('../bin/helpers/auth/basic');
const router = express.Router();
const commandHandler = require('../bin/modules/user/commands/command_handler');
const commandModel = require('../bin/modules/user/commands/command_model');
const validator = require('../bin/modules/user/validator');

router.get('/', (req, res, next) => {
  res.send('List users');
});

router.post('/register', basicVanillaAuth, async (req, res) => {
  const payload = req.body;
  const isValidatePayload = await validator.isValidPayload(payload, commandModel.userSchema);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.registerUser(result.data.data);
  };
  const sendResponse = async (result) => {
    result.err
      ? res.send({ success: false, code: 409, data: '', message: result.err.message })
      : res.send({ success: true, code: 200, data: result.data, message: 'Success Insert User' });
  };

  sendResponse(await postRequest(isValidatePayload));
});

router.post('/login', basicVanillaAuth, async (req, res) => {
  const payload = req.body;
  const isValidatePayload = await validator.isValidPayload(payload, commandModel.userLogin);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.loginUser(result.data.data);
  };
  const sendResponse = async (result) => {
    result.err
      ? res.send({ success: false, code: result.err.code, data: '', message: result.err.message })
      : res.send({ success: true, code: 200, data: result.data, message: 'Success Login' });
  };
  sendResponse(await postRequest(isValidatePayload));
});

router.get('/verify', basicVanillaAuth, async (req, res) => {
  const { token } = req.query;
  const getData = async () => commandHandler.verificationUser(token);
  const sendResponse = async (result) => {
    result.err
      ? res.send({ success: false, code: result.err.code, data: '', message: result.err.message })
      : res.send({ success: true, code: 200, data: result.data, message: 'Success Verify User' });
  };
  sendResponse(await getData());
});

module.exports = router;
