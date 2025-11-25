import Joi from 'joi';

export const parishIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const baseParishSchema = {
  name: Joi.string().min(2).max(255),
  address: Joi.string().max(500).allow('', null),
  phone: Joi.string().max(50).allow('', null),
  email: Joi.string().email().allow('', null),
  website: Joi.string().uri().allow('', null),
  massSchedule: Joi.object().unknown(true).allow(null),
  confessionSchedule: Joi.object().unknown(true).allow(null)
};

export const createParishSchema = Joi.object({
  ...baseParishSchema,
  name: baseParishSchema.name.required()
});

export const updateParishSchema = Joi.object(baseParishSchema).min(1);


