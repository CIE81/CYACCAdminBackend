import {
  createParishHandler,
  deleteParishHandler,
  getParishHandler,
  listParishesHandler,
  updateParishHandler
} from './handlers.mjs';
import {
  createParishSchema,
  parishIdSchema,
  updateParishSchema
} from './validation.mjs';

const basePath = '/api/parishes';

const securedSwagger = {
  'hapi-swagger': {
    security: [{ jwt: [] }]
  }
};

export default () => [
  {
    method: 'GET',
    path: basePath,
    options: {
      auth: 'jwt',
      tags: ['api', 'parishes'],
      description: 'List all parishes',
      plugins: securedSwagger
    },
    handler: listParishesHandler
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'parishes'],
      description: 'Get parish details',
      plugins: securedSwagger,
      validate: {
        params: parishIdSchema
      }
    },
    handler: getParishHandler
  },
  {
    method: 'POST',
    path: basePath,
    options: {
      auth: 'jwt',
      tags: ['api', 'parishes'],
      description: 'Create a parish',
      plugins: securedSwagger,
      validate: {
        payload: createParishSchema
      }
    },
    handler: createParishHandler
  },
  {
    method: 'PUT',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'parishes'],
      description: 'Update a parish',
      plugins: securedSwagger,
      validate: {
        params: parishIdSchema,
        payload: updateParishSchema
      }
    },
    handler: updateParishHandler
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'parishes'],
      description: 'Delete a parish',
      plugins: securedSwagger,
      validate: {
        params: parishIdSchema
      }
    },
    handler: deleteParishHandler
  }
];


