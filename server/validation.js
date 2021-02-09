const Joi = require('joi');

//Register Validation
const registerValidation = data => {
    //VALIDATION
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
        backctl: Joi.boolean().required()
    });
    return schema.validate(data);
};

const loginValidation = data => {
    //VALIDATION
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
