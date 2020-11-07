const joi = require('joi');

const userSchema = joi.object({
  email: joi.string().email({ minDomainSegments: 2 }).required(),
  password: joi.string().required(),
});

const userLogin = joi.object({
  email: joi.string().email({ minDomainSegments: 2 }).required(),
  password: joi.string().required(),
  isActive: joi.boolean().default(true),
});

module.exports = {
  userSchema,
  userLogin,
};
