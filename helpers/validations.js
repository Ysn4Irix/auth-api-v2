/**
 * @author Ysn4Irix
 * @email ysn4irix@gmail.com
 * @create date 29-06-2022
 * @modify date 30-06-2022
 * @desc [body Validations]
 */

const Joi = require("joi");

const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};

const validateRegister = (data) => {
    const schema = Joi.object({
        fullname: Joi.string().min(4).max(20).required(),
        username: Joi.string().min(6).max(15).required(),
        /* email: Joi.string().pattern(new RegExp("^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$")).required().messages({
                "string.pattern.base": "Only gmail or googlemail are accepted"
            }), */
        email: Joi.string().min(6).max(35).email().lowercase().required(),
        password: Joi.string().min(6).max(20).required(),
    })
    return schema.validateAsync(data, options)
}

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(35).email().lowercase().required(),
        password: Joi.string().max(20).min(6).required(),
    })
    return schema.validateAsync(data, options)
}

const validateToken = (data) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required()
    })
    return schema.validateAsync(data, options)
}

module.exports = {
    validateRegister,
    validateLogin,
    validateToken
};