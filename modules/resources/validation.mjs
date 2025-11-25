import Joi from 'joi';

export const resourceIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const createResourceSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  picture: Joi.string().uri().allow('', null),
  link: Joi.string().uri().required(),
  type: Joi.string()
    .valid('movie', 'book', 'podcast', 'website')
    .required()
});

export const updateResourceSchema = Joi.object({
  name: Joi.string().min(2).max(255),
  picture: Joi.string().uri().allow('', null),
  link: Joi.string().uri(),
  type: Joi.string().valid('movie', 'book', 'podcast', 'website')
}).min(1);


