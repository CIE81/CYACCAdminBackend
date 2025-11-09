import Joi from 'joi';

export const prayerRequestIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const createPrayerRequestSchema = Joi.object({
  content: Joi.string().min(3).required(),
  date: Joi.date().iso().optional()
});

export const updatePrayerRequestSchema = Joi.object({
  content: Joi.string().min(3),
  date: Joi.date().iso().optional()
}).min(1);
