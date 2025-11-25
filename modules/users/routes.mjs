import { requireSuperAdmin } from '../../middleware/auth.mjs';
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  listUsersHandler,
  loginHandler,
  updateUserHandler,
  forgotPasswordHandler,
  validateResetTokenHandler,
  resetPasswordHandler,
  updateProfileHandler,
  changePasswordHandler
} from './handlers.mjs';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  loginSchema,
  forgotPasswordSchema,
  resetTokenQuerySchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema
} from './validation.mjs';

const basePath = '/api/users';

const securedSwagger = {
  'hapi-swagger': {
    security: [{ jwt: [] }]
  }
};

export default () => [
  {
    method: 'POST',
    path: '/api/auth/login',
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Authenticate user and return JWT',
      notes: 'Returns a JWT token for authenticated users',
      plugins: {
        'hapi-swagger': {
          security: []
        }
      },
      validate: {
        payload: loginSchema
      }
    },
    handler: loginHandler
  },
  {
    method: 'POST',
    path: '/api/auth/forgot-password',
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Request password reset email',
      plugins: {
        'hapi-swagger': {
          security: []
        }
      },
      validate: {
        payload: forgotPasswordSchema
      }
    },
    handler: forgotPasswordHandler
  },
  {
    method: 'GET',
    path: '/api/auth/reset-password/validate',
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Validate password reset token',
      plugins: {
        'hapi-swagger': {
          security: []
        }
      },
      validate: {
        query: resetTokenQuerySchema
      }
    },
    handler: validateResetTokenHandler
  },
  {
    method: 'POST',
    path: '/api/auth/reset-password',
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Reset password using token',
      plugins: {
        'hapi-swagger': {
          security: []
        }
      },
      validate: {
        payload: resetPasswordSchema
      }
    },
    handler: resetPasswordHandler
  },
  {
    method: 'PUT',
    path: '/api/users/me',
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      description: 'Update current user profile',
      plugins: securedSwagger,
      validate: {
        payload: updateProfileSchema
      }
    },
    handler: updateProfileHandler
  },
  {
    method: 'POST',
    path: '/api/users/me/change-password',
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      description: 'Change current user password',
      plugins: securedSwagger,
      validate: {
        payload: changePasswordSchema
      }
    },
    handler: changePasswordHandler
  },
  {
    method: 'GET',
    path: basePath,
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      pre: [{ method: requireSuperAdmin }],
      description: 'List all users',
      notes: 'Returns all registered users',
      plugins: securedSwagger,
      validate: {}
    },
    handler: listUsersHandler
  },
  {
    method: 'GET',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      pre: [{ method: requireSuperAdmin }],
      description: 'Get user details',
      plugins: securedSwagger,
      validate: {
        params: userIdParamSchema
      }
    },
    handler: getUserHandler
  },
  {
    method: 'POST',
    path: basePath,
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      pre: [{ method: requireSuperAdmin }],
      description: 'Create a new user',
      plugins: securedSwagger,
      validate: {
        payload: createUserSchema
      }
    },
    handler: createUserHandler
  },
  {
    method: 'PUT',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      pre: [{ method: requireSuperAdmin }],
      description: 'Update a user',
      plugins: securedSwagger,
      validate: {
        params: userIdParamSchema,
        payload: updateUserSchema
      }
    },
    handler: updateUserHandler
  },
  {
    method: 'DELETE',
    path: `${basePath}/{id}`,
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      pre: [{ method: requireSuperAdmin }],
      description: 'Delete a user',
      plugins: securedSwagger,
      validate: {
        params: userIdParamSchema
      }
    },
    handler: deleteUserHandler
  }
];
