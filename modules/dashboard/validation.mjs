import Joi from 'joi';

export const dashboardQuerySchema = Joi.object({
  range: Joi.string()
    .valid('day', 'week', 'month', 'year', 'all')
    .default('month')
});

