import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser,
  requestPasswordReset,
  validatePasswordResetToken,
  resetPasswordWithToken,
  updateCurrentUser,
  changePassword
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

export const updateProfileHandler = async request => {
  const userId = request.auth?.credentials?.id;
  const user = await updateCurrentUser(userId, request.payload);
  return {
    respCode: 200,
    message: 'Profile updated successfully.',
    data: {
      id: user.id,
      ...sanitize(user)
    }
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

export const forgotPasswordHandler = async request => {
  const { email } = request.payload;
  await requestPasswordReset(email);

  return {
    respCode: 200,
    message: 'If an account exists for the provided email, a reset link has been sent.',
    data: null
  };
};

export const validateResetTokenHandler = async request => {
  const { token, email } = request.query;
  await validatePasswordResetToken(token, email);

  return {
    respCode: 200,
    message: 'Reset token is valid.',
    data: null
  };
};

export const resetPasswordHandler = async request => {
  const { token, email, password } = request.payload;
  const user = await resetPasswordWithToken({ token, email, newPassword: password });
  const authToken = generateToken(user);

  return {
    respCode: 200,
    message: 'Password reset successfully.',
    data: {
      token: authToken,
      user: sanitize(user)
    }
  };
};

export const changePasswordHandler = async request => {
  const userId = request.auth?.credentials?.id;
  const { currentPassword, newPassword } = request.payload;

  await changePassword(userId, { currentPassword, newPassword });

  return {
    respCode: 200,
    message: 'Password changed successfully.',
    data: null
  };
};
