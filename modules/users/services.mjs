import bcrypt from 'bcryptjs';
import Boom from '@hapi/boom';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User } from '../../models/index.mjs';
import { sendEmail } from '../../services/emailService.mjs';

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

  try {
    await user.update(payload);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw Boom.conflict('Email or username already exists');
    }
    throw error;
  }
  return user;
};

export const deleteUser = async id => {
  const user = await getUserById(id);
  await user.destroy();
};

export const updateCurrentUser = async (id, payload) => {
  const user = await getUserById(id);

  const updates = { ...payload };

  if (!updates.currentPassword) {
    throw Boom.badRequest('Current password is required to update profile.');
  }

  const matches = await bcrypt.compare(updates.currentPassword, user.password);
  if (!matches) {
    throw Boom.badRequest('Current password is incorrect.');
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  if ('userName' in updates || 'superAdmin' in updates) {
    delete updates.userName;
    delete updates.superAdmin;
  }

  delete updates.currentPassword;

  try {
    await user.update(updates, {
      fields: ['firstName', 'lastName', 'email', 'phone', 'password'].filter(field => field in updates)
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw Boom.conflict('Email already exists');
    }
    throw error;
  }

  return user;
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

export const requestPasswordReset = async email => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return null;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await user.update({
    resetToken: tokenHash,
    resetTokenExpires: expiresAt
  });

  const frontendBase =
    process.env.APP_BASE_URL ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000';
  const appBaseUrl = frontendBase.replace(/\/$/, '');
  const resetLink = `${appBaseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

  const plainMessage = [
    'You recently requested to reset your CYACC Admin password.',
    'If this was you, click the link below to reset your password:',
    resetLink,
    '',
    'This link will expire in 1 hour.',
    '',
    'If you did not request a password reset, please ignore this email.'
  ].join('\n');

  const htmlMessage = `
    <p>You recently requested to reset your CYACC Admin password.</p>
    <p>If this was you, click the link below to reset your password:</p>
    <p><a href="${resetLink}" target="_blank" rel="noopener noreferrer">Reset your password</a></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
  `;

  await sendEmail({
    to: email,
    subject: 'CYACC Admin Password Reset',
    text: plainMessage,
    html: htmlMessage
  });

  return { resetLink };
};

export const validatePasswordResetToken = async (token, email) => {
  if (!token || !email) {
    throw Boom.badRequest('Invalid reset token');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      email,
      resetToken: hashedToken,
      resetTokenExpires: {
        [Op.gt]: new Date()
      }
    }
  });

  if (!user) {
    throw Boom.badRequest('Reset token is invalid or has expired');
  }

  return user;
};

export const resetPasswordWithToken = async ({ token, email, newPassword }) => {
  const user = await validatePasswordResetToken(token, email);
  const hashed = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashed,
    resetToken: null,
    resetTokenExpires: null
  });

  await sendEmail({
    to: email,
    subject: 'CYACC Admin Password Updated',
    text: 'Your CYACC Admin password has been updated successfully.',
    html: '<p>Your CYACC Admin password has been updated successfully.</p>'
  });

  return user;
};

export const changePassword = async (id, { currentPassword, newPassword }) => {
  const user = await getUserById(id);

  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) {
    throw Boom.badRequest('Current password is incorrect.');
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashed });

  await sendEmail({
    to: user.email,
    subject: 'CYACC Admin Password Changed',
    text: 'Your CYACC Admin password has been changed successfully.',
    html: '<p>Your CYACC Admin password has been changed successfully.</p>'
  });
};
