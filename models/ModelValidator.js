const Joi = require("joi");

class ModelValidator {
  isRegistrationModel(obj) {
    const { username, password, email } = obj;
    const schema = {
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required()
    };
    return this.isValid({ username, password, email }, schema);
  }
  isLoginModel(obj) {
    const schema = {
      username: Joi.string().required()
    };
    return this.isValid(obj, schema);
  }

  isValid(obj, schema) {
    return Joi.validate(obj, schema).error === null;
  }
}

module.exports = ModelValidator;
