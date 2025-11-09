import Boom from '@hapi/boom';
import { Member } from '../../models/index.mjs';

export const listMembers = () => Member.findAll({ order: [['createdAt', 'DESC']] });

export const getMemberById = async id => {
  const member = await Member.findByPk(id);
  if (!member) {
    throw Boom.notFound('Member not found');
  }
  return member;
};

export const createMember = payload => Member.create(payload);

export const updateMember = async (id, payload) => {
  const member = await getMemberById(id);
  await member.update(payload);
  return member;
};

export const deleteMember = async id => {
  const member = await getMemberById(id);
  await member.destroy();
};
