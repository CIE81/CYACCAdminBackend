import {
  createEventHandler,
  deleteEventHandler,
  getEventHandler,
  listEventsHandler,
  updateEventHandler,
  addMemberToEventHandler,
  removeMemberFromEventHandler
} from './handlers.mjs';
import {
  createEventSchema,
  updateEventSchema,
  eventIdSchema,
  addMemberToEventSchema,
  eventMemberIdSchema
} from './validation.mjs';

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
  },
  {
    method: 'POST',
    path: `${basePath}/{id}/members`,
    options: {
      auth: 'jwt',
      tags: ['api', 'events'],
      description: 'Add a member to an event',
      plugins: securedSwagger,
      validate: {
        params: eventIdSchema,
        payload: addMemberToEventSchema
      }
    },
    handler: addMemberToEventHandler
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}/members/{memberId}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'events'],
      description: 'Remove a member from an event',
      plugins: securedSwagger,
      validate: {
        params: eventMemberIdSchema
      }
    },
    handler: removeMemberFromEventHandler
  }
];
