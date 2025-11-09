import bcrypt from 'bcryptjs';
import Boom from '@hapi/boom';
import { User } from '../../models/index.mjs';

export const listUsers = async () => User.findAll({ order: [['createdAt', 'DESC']] });

export const getUserById = async id => {
  const user = await User.findByPk(id);
  if (!user) {
    throw Boom.notFound('User not found');
  }
  return user;
};

export const getUserByUserName = userName => User.findOne({ where: { userName } });

export const createUser = async payload => {
  const hashed = await bcrypt.hash(payload.password, 10);
  try {
    const created = await User.create({ ...payload, password: hashed });
    return created;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw Boom.conflict('Email or username already exists');
    }
    throw error;
  }
};

export const updateUser = async (id, payload) => {
  const user = await getUserById(id);
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  await user.update(payload);
  return user;
};

export const deleteUser = async id => {
  const user = await getUserById(id);
  await user.destroy();
};

export const authenticateUser = async ({ userName, password }) => {
  const user = await getUserByUserName(userName);
  if (!user) {
    throw Boom.unauthorized('Invalid credentials');
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    throw Boom.unauthorized('Invalid credentials');
  }

  return user;
};
