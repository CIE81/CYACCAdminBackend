import {
  createEventHandler,
  deleteEventHandler,
  getEventHandler,
  listEventsHandler,
  updateEventHandler
} from './handlers.mjs';
import { createEventSchema, updateEventSchema, eventIdSchema } from './validation.mjs';

const basePath = '/api/events';

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
      tags: ['api', 'events'],
      description: 'List all events',
      plugins: securedSwagger
    },
    handler: listEventsHandler
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'events'],
      description: 'Get event details',
      plugins: securedSwagger,
      validate: {
        params: eventIdSchema
      }
    },
    handler: getEventHandler
  },
  {
    method: 'POST',
    path: basePath,
    options: {
      auth: 'jwt',
      tags: ['api', 'events'],
      description: 'Create an event',
      plugins: securedSwagger,
      validate: {
        payload: createEventSchema
      }
    },
    handler: createEventHandler
  },
  {
    method: 'PUT',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'events'],
      description: 'Update an event',
      plugins: securedSwagger,
      validate: {
        params: eventIdSchema,
        payload: updateEventSchema
      }
    },
    handler: updateEventHandler
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'events'],
      description: 'Delete an event',
      plugins: securedSwagger,
      validate: {
        params: eventIdSchema
      }
    },
    handler: deleteEventHandler
  }
];
