import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(120).required(),
  lastName: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  userName: Joi.string().min(3).max(120).required(),
  password: Joi.string().min(8).max(255).required(),
  superAdmin: Joi.boolean().default(false)
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(120),
  lastName: Joi.string().min(2).max(120),
  email: Joi.string().email(),
  phone: Joi.string().allow('', null),
  userName: Joi.string().min(3).max(120),
  password: Joi.string().min(8).max(255),
  superAdmin: Joi.boolean()
}).min(1);

export const userIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const loginSchema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetTokenQuerySchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required()
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(120).required(),
  lastName: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  currentPassword: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(255).required()
});