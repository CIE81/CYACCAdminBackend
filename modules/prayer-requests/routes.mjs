import {
  createPrayerRequestHandler,
  deletePrayerRequestHandler,
  getPrayerRequestHandler,
  listPrayerRequestsHandler,
  updatePrayerRequestHandler
} from './handlers.mjs';
import {
  createPrayerRequestSchema,
  updatePrayerRequestSchema,
  prayerRequestIdSchema
} from './validation.mjs';

const basePath = '/api/prayer-requests';

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
      tags: ['api', 'prayer-requests'],
      description: 'List all prayer requests',
      plugins: securedSwagger
    },
    handler: listPrayerRequestsHandler
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'prayer-requests'],
      description: 'Get prayer request details',
      plugins: securedSwagger,
      validate: {
        params: prayerRequestIdSchema
      }
    },
    handler: getPrayerRequestHandler
  },
  {
    method: 'POST',
    path: basePath,
    options: {
      auth: 'jwt',
      tags: ['api', 'prayer-requests'],
      description: 'Create a prayer request',
      plugins: securedSwagger,
      validate: {
        payload: createPrayerRequestSchema
      }
    },
    handler: createPrayerRequestHandler
  },
  {
    method: 'PUT',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'prayer-requests'],
      description: 'Update a prayer request',
      plugins: securedSwagger,
      validate: {
        params: prayerRequestIdSchema,
        payload: updatePrayerRequestSchema
      }
    },
    handler: updatePrayerRequestHandler
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'prayer-requests'],
      description: 'Delete a prayer request',
      plugins: securedSwagger,
      validate: {
        params: prayerRequestIdSchema
      }
    },
    handler: deletePrayerRequestHandler
  }
];
