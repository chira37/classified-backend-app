import Joi from "joi";

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(20).required(),
});

const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(20).required(),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({ "string.pattern.base": "Invalid user id" }),
    password: Joi.string().min(4).max(20).required(),
});

const updatePasswordSchema = Joi.object({
    password: Joi.string().min(4).max(20).required(),
});
export = {
    signInSchema,
    signUpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updatePasswordSchema,
};
