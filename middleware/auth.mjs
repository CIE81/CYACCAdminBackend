import Boom from '@hapi/boom';
import HapiJwt from 'hapi-auth-jwt2';
import jwt from 'jsonwebtoken';
import { jwtOptions } from '../config/database.mjs';
import { User } from '../models/index.mjs';

const validate = async decoded => {
  if (!decoded?.id) {
    return { isValid: false };
  }

  const user = await User.findByPk(decoded.id);
  if (!user) {
    return { isValid: false };
  }

  return {
    isValid: true,
    credentials: {
      id: user.id,
      userName: user.userName,
      email: user.email,
      superAdmin: user.superAdmin
    }
  };
};

export const registerAuth = async server => {
  await server.register(HapiJwt);
  server.auth.strategy('jwt', 'jwt', {
    key: jwtOptions.secret,
    validate,
    verifyOptions: jwtOptions.verifyOptions
  });
  server.auth.default('jwt');
};

export const requireSuperAdmin = (request, h) => {
  if (!request.auth?.credentials?.superAdmin) {
    throw Boom.forbidden('Super admin access required');
  }
  return h.continue;
};

export const generateToken = user =>
  jwt.sign(
    {
      id: user.id,
      userName: user.userName,
      superAdmin: user.superAdmin
    },
    jwtOptions.secret,
    jwtOptions.signOptions
  );
