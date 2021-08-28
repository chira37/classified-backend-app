import Joi from "joi";

const baseSchema = Joi.object({
    name: Joi.string().max(20).required(),
    icon_image: Joi.string(),
});

export = {
    createSchema: baseSchema,
    updateSchema: baseSchema,
};
