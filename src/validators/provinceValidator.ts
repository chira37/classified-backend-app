import Joi from "joi";

const createSchema = Joi.object({
    name: Joi.string().max(20).required(),
    cities: Joi.array().items(
        Joi.object({
            name: Joi.string().max(20).required(),
        })
    ),
});

const updateSchema = Joi.object({
    name: Joi.string().max(20).required(),
    cities: Joi.array().items(
        Joi.object({
            id: Joi.string()
                .regex(/^[0-9a-zA-Z-_]{12}$/)
                .messages({ "string.pattern.base": "Invalid city id" }),
            _id: Joi.string()
                .regex(/^[0-9a-zA-Z-_]{12}$/)
                .messages({ "string.pattern.base": "Invalid city id" }),
            name: Joi.string().max(20).required(),
        })
    ),
});

export = {
    createSchema,
    updateSchema,
};
