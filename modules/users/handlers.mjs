import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser
} from './services.mjs';
import { generateToken } from '../../middleware/auth.mjs';

const sanitize = user => {
  const plain = user.toJSON();
  delete plain.password;
  return plain;
};

export const listUsersHandler = async () => {
  const users = await listUsers();
  return {
    respCode: 200,
    message: 'Users retrieved successfully',
    data: users.map(sanitize)
  };
};

export const getUserHandler = async request => {
  const user = await getUserById(request.params.id);
  return {
    respCode: 200,
    message: 'User retrieved successfully',
    data: sanitize(user)
  };
};

export const createUserHandler = async (request, h) => {
  const user = await createUser(request.payload);
  return h
    .response({
      respCode: 201,
      message: 'User created successfully',
      data: sanitize(user)
    })
    .code(201);
};

export const updateUserHandler = async request => {
  const user = await updateUser(request.params.id, request.payload);
  return {
    respCode: 200,
    message: 'User updated successfully',
    data: sanitize(user)
  };
};

export const deleteUserHandler = async (request, h) => {
  await deleteUser(request.params.id);
  return h
    .response({
      respCode: 204,
      message: 'User deleted successfully',
      data: null
    })
    .code(204);
};

export const loginHandler = async request => {
  const { userName, password } = request.payload;
  const user = await authenticateUser({ userName, password });
  const token = generateToken(user);

  return {
    respCode: 200,
    message: 'Login successful',
    data: {
      token,
      user: sanitize(user)
    }
  };
};
