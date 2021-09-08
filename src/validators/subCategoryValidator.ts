import Joi from "joi";

const baseSchema = Joi.object({
    name: Joi.string().max(20).required(),
    icon_image: Joi.string(),
    extra_fields: Joi.array().items(
        Joi.object({
            name: Joi.string().max(20).required(),
            type: Joi.string().max(20).required(),
            options: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                })
            ),
        })
    ),
    brand_id: Joi.array().items(
        Joi.string()
            .regex(/^[0-9a-zA-Z-_]{12}$/)
            .required()
            .messages({ "string.pattern.base": "Invalid brand id" })
    ),
    keywords: Joi.array().items(Joi.string()),
});

const updateSchema = Joi.object({
    name: Joi.string().max(20).required(),
    icon_image: Joi.string(),
    extra_fields: Joi.array().items(
        Joi.object({
            id: Joi.string()
                .regex(/^[0-9a-zA-Z-_]{12}$/)
                .messages({ "string.pattern.base": "Invalid extra field id" }),
            _id: Joi.string()
                .regex(/^[0-9a-zA-Z-_]{12}$/)
                .messages({ "string.pattern.base": "Invalid extra field id" }),
            name: Joi.string().max(20).required(),
            type: Joi.string().max(20).required(),
            options: Joi.array().items(
                Joi.object({
                    id: Joi.string()
                        .regex(/^[0-9a-zA-Z-_]{12}$/)
                        .messages({ "string.pattern.base": "Invalid extra field option id" }),
                    _id: Joi.string()
                        .regex(/^[0-9a-zA-Z-_]{12}$/)
                        .messages({ "string.pattern.base": "Invalid extra field id" }),
                    name: Joi.string().required(),
                })
            ),
        })
    ),
    brand_id: Joi.array().items(
        Joi.string()
            .regex(/^[0-9a-zA-Z-_]{12}$/)
            .messages({ "string.pattern.base": "Invalid brand id" })
    ),
    keywords: Joi.array().items(Joi.string()),
});

export = {
    createSchema: baseSchema,
    updateSchema,
};
