import Joi from "joi";

const baseSchema = Joi.object({
    user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({ "string.pattern.base": "Invalid user id" }),
    shop_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({ "string.pattern.base": "Invalid shop id" }),
    title: Joi.string().required().max(50),
    description: Joi.string().min(10).max(400).required(),
    condition: Joi.string().required(),
    price: Joi.number().required(),
    images: Joi.array().required(),
    city_id: Joi.string().required().max(20),
    province_id: Joi.string().required().max(20),
    phone_number_1: Joi.string().required(),
    phone_number_2: Joi.string().optional(),
    extras: Joi.array().required(),
    active: Joi.boolean().required(),
});

const fullUpdateSchema = baseSchema.keys({
    status: Joi.string().required(),
});

const fullCreateSchema = baseSchema.keys({
    status: Joi.string().required(),
});

export = {
    limitedCreateSchema: baseSchema,
    limitedUpdateSchema: baseSchema,
    fullUpdateSchema,
    fullCreateSchema,
};
