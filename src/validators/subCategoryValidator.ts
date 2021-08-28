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
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({ "string.pattern.base": "Invalid user id" })
    ),
    keywords: Joi.array().items(Joi.string()),
});

export = {
    createSchema: baseSchema,
    updateSchema: baseSchema,
};
