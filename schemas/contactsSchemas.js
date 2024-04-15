import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean()
})

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string()
})

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
})

export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
})

export const usersSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
})

export const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().required(),
})