import {
  listPrayerRequests,
  getPrayerRequestById,
  createPrayerRequest,
  updatePrayerRequest,
  deletePrayerRequest
} from './services.mjs';

export const listPrayerRequestsHandler = async () => {
  const requests = await listPrayerRequests();
  return {
    respCode: 200,
    message: 'Prayer requests retrieved successfully',
    data: requests
  };
};

export const getPrayerRequestHandler = async request => {
  const prayerRequest = await getPrayerRequestById(request.params.id);
  return {
    respCode: 200,
    message: 'Prayer request retrieved successfully',
    data: prayerRequest
  };
};

export const createPrayerRequestHandler = async (request, h) => {
  const created = await createPrayerRequest(request.payload);
  return h
    .response({
      respCode: 201,
      message: 'Prayer request created successfully',
      data: created
    })
    .code(201);
};

export const updatePrayerRequestHandler = async request => {
  const updated = await updatePrayerRequest(request.params.id, request.payload);
  return {
    respCode: 200,
    message: 'Prayer request updated successfully',
    data: updated
  };
};

export const deletePrayerRequestHandler = async (request, h) => {
  await deletePrayerRequest(request.params.id);
  return h
    .response({
      respCode: 204,
      message: 'Prayer request deleted successfully',
      data: null
    })
    .code(204);
};
