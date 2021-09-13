import Joi from "joi";

const baseSchema = Joi.object({
    user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({ "string.pattern.base": "Invalid user id" }),
    shop_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({ "string.pattern.base": "Invalid shop id" }),
    category_id: Joi.string()
        .regex(/^[0-9a-zA-Z-_]{12}$/)
        .messages({ "string.pattern.base": "Invalid category id" }),
    sub_category_id: Joi.string()
        .regex(/^[0-9a-zA-Z-_]{12}$/)
        .messages({ "string.pattern.base": "Invalid Sub category id" }),
    title: Joi.string().required().max(50),
    description: Joi.string().min(10).max(400).required(),
    condition: Joi.string().required(),
    price: Joi.number().required(),
    images: Joi.array(), // .required(), fix this
    city_id: Joi.string().required().max(20),
    province_id: Joi.string().required().max(20),
    phone_no_1: Joi.string().required(),
    phone_no_2: Joi.string().optional(),
    extras: Joi.array(),
    active: Joi.boolean().required(),
});

const fullUpdateSchema = baseSchema.keys({
    status: Joi.string().required(),
});

const fullCreateSchema = baseSchema.keys({
    status: Joi.string().required(),
});

const changeStatusSchema = Joi.object({
    status: Joi.string().required(),
    note: Joi.string().allow("").max(400),
});

export = {
    limitedCreateSchema: baseSchema,
    limitedUpdateSchema: baseSchema,
    fullUpdateSchema: baseSchema,
    fullCreateSchema: baseSchema,
    changeStatusSchema,
};
