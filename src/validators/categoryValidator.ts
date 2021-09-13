import Joi from "joi";

const baseSchema = Joi.object({
    name: Joi.string().max(20).required(),
    icon_image: Joi.string(),
    sub_category_id: Joi.array().items(
        Joi.string()
            .regex(/^[0-9a-zA-Z-_]{12}$/)
            .messages({ "string.pattern.base": "Invalid sub category id" })
    ),
});

export = {
    createSchema: baseSchema,
    updateSchema: baseSchema,
};
