import {
  createResourceHandler,
  deleteResourceHandler,
  getResourceHandler,
  listResourcesHandler,
  updateResourceHandler
} from './handlers.mjs';
import {
  createResourceSchema,
  resourceIdSchema,
  updateResourceSchema
} from './validation.mjs';

const basePath = '/api/resources';

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
      tags: ['api', 'resources'],
      description: 'List all resources',
      plugins: securedSwagger
    },
    handler: listResourcesHandler
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'resources'],
      description: 'Get resource details',
      plugins: securedSwagger,
      validate: {
        params: resourceIdSchema
      }
    },
    handler: getResourceHandler
  },
  {
    method: 'POST',
    path: basePath,
    options: {
      auth: 'jwt',
      tags: ['api', 'resources'],
      description: 'Create a resource',
      plugins: securedSwagger,
      validate: {
        payload: createResourceSchema
      }
    },
    handler: createResourceHandler
  },
  {
    method: 'PUT',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'resources'],
      description: 'Update a resource',
      plugins: securedSwagger,
      validate: {
        params: resourceIdSchema,
        payload: updateResourceSchema
      }
    },
    handler: updateResourceHandler
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'resources'],
      description: 'Delete a resource',
      plugins: securedSwagger,
      validate: {
        params: resourceIdSchema
      }
    },
    handler: deleteResourceHandler
  }
];


