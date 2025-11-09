import {
  createMemberHandler,
  deleteMemberHandler,
  getMemberHandler,
  listMembersHandler,
  updateMemberHandler
} from './handlers.mjs';
import {
  createMemberSchema,
  updateMemberSchema,
  memberIdSchema
} from './validation.mjs';

const basePath = '/api/members';

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
      tags: ['api', 'members'],
      description: 'List all members',
      plugins: securedSwagger
    },
    handler: listMembersHandler
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'members'],
      description: 'Get member details',
      plugins: securedSwagger,
      validate: {
        params: memberIdSchema
      }
    },
    handler: getMemberHandler
  },
  {
    method: 'POST',
    path: basePath,
    options: {
      auth: 'jwt',
      tags: ['api', 'members'],
      description: 'Create a member',
      plugins: securedSwagger,
      validate: {
        payload: createMemberSchema
      }
    },
    handler: createMemberHandler
  },
  {
    method: 'PUT',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'members'],
      description: 'Update a member',
      plugins: securedSwagger,
      validate: {
        params: memberIdSchema,
        payload: updateMemberSchema
      }
    },
    handler: updateMemberHandler
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'members'],
      description: 'Delete a member',
      plugins: securedSwagger,
      validate: {
        params: memberIdSchema
      }
    },
    handler: deleteMemberHandler
  }
];
