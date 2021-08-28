import Joi from "joi";

const baseSchema = Joi.object({
    first_name: Joi.string().required().max(20),
    last_name: Joi.string().required().max(20),
    phone_number_1: Joi.string().required(),
    phone_number_2: Joi.string().optional(),
    address_1: Joi.object().keys({
        line_1: Joi.string().allow("").max(40),
        line_2: Joi.string().allow("").max(40),
        city: Joi.string().allow("").max(20),
        province: Joi.string().allow("").max(20),
        zip_code: Joi.string().allow("").max(10),
    }),
    address_2: Joi.object().keys({
        line_1: Joi.string().allow("").max(40),
        line_2: Joi.string().allow("").max(40),
        city: Joi.string().allow("").max(20),
        province: Joi.string().allow("").max(20),
        zip_code: Joi.string().allow("").max(10),
    }),
    profile_image: Joi.string(),
    note: Joi.string().allow("").max(400),
    active: Joi.boolean(),
});

const fullUpdateSchema = baseSchema.keys({
    email: Joi.string().email().required(),
    password: Joi.string().allow("").min(8).max(40),
    verified: Joi.boolean().required(),
    role: Joi.string().required(),
});

const createSchema = baseSchema.keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(40).required(),
    verified: Joi.boolean().required(),
    role: Joi.string().required(),
});

const updateEmailSchema = Joi.object({
    email: Joi.string().email().required(),
});

const verifyEmailSchema = Joi.object({
    token: Joi.string().required(),
    user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({ "string.pattern.base": "Invalid user id" }),
});

export = {
    limitedUpdateSchema: baseSchema,
    fullUpdateSchema,
    createSchema,
    updateEmailSchema,
    verifyEmailSchema,
};
