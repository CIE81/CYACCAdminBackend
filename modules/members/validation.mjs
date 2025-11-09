import Joi from 'joi';

export const memberIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const createMemberSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  joinDate: Joi.date().iso().required(),
  active: Joi.boolean().default(true)
});

export const updateMemberSchema = Joi.object({
  firstName: Joi.string().min(2),
  lastName: Joi.string().min(2),
  email: Joi.string().email(),
  joinDate: Joi.date().iso(),
  active: Joi.boolean()
}).min(1);
