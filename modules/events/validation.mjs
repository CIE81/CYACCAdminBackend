import Joi from 'joi';

export const eventIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const createEventSchema = Joi.object({
  name: Joi.string().min(3).required(),
  startDateTime: Joi.date().iso().required(),
  endDateTime: Joi.date().iso().min(Joi.ref('startDateTime')).required(),
  pictureLink: Joi.string().uri().allow('', null),
  description: Joi.string().allow('', null),
  location: Joi.string().allow('', null)
});

export const updateEventSchema = Joi.object({
  name: Joi.string().min(3),
  startDateTime: Joi.date().iso(),
  endDateTime: Joi.date().iso(),
  pictureLink: Joi.string().uri().allow('', null),
  description: Joi.string().allow('', null),
  location: Joi.string().allow('', null)
})
  .min(1)
  .custom((value, helpers) => {
    if (value.startDateTime && value.endDateTime && value.endDateTime < value.startDateTime) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Date validation');
