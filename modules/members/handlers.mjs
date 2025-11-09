import {
  listMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} from './services.mjs';

export const listMembersHandler = async () => {
  const members = await listMembers();
  return {
    respCode: 200,
    message: 'Members retrieved successfully',
    data: members
  };
};

export const getMemberHandler = async request => {
  const member = await getMemberById(request.params.id);
  return {
    respCode: 200,
    message: 'Member retrieved successfully',
    data: member
  };
};

export const createMemberHandler = async (request, h) => {
  const created = await createMember(request.payload);
  return h
    .response({
      respCode: 201,
      message: 'Member created successfully',
      data: created
    })
    .code(201);
};

export const updateMemberHandler = async request => {
  const updated = await updateMember(request.params.id, request.payload);
  return {
    respCode: 200,
    message: 'Member updated successfully',
    data: updated
  };
};

export const deleteMemberHandler = async (request, h) => {
  await deleteMember(request.params.id);
  return h
    .response({
      respCode: 204,
      message: 'Member deleted successfully',
      data: null
    })
    .code(204);
};
