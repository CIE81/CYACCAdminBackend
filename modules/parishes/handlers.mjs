import {
  listParishes,
  getParishById,
  createParish,
  updateParish,
  deleteParish
} from './services.mjs';

export const listParishesHandler = async () => {
  const parishes = await listParishes();
  return {
    respCode: 200,
    message: 'Parishes retrieved successfully',
    data: parishes
  };
};

export const getParishHandler = async request => {
  const parish = await getParishById(request.params.id);
  return {
    respCode: 200,
    message: 'Parish retrieved successfully',
    data: parish
  };
};

export const createParishHandler = async (request, h) => {
  const created = await createParish(request.payload);
  return h
    .response({
      respCode: 201,
      message: 'Parish created successfully',
      data: created
    })
    .code(201);
};

export const updateParishHandler = async request => {
  const updated = await updateParish(request.params.id, request.payload);
  return {
    respCode: 200,
    message: 'Parish updated successfully',
    data: updated
  };
};

export const deleteParishHandler = async (request, h) => {
  await deleteParish(request.params.id);
  return h
    .response({
      respCode: 204,
      message: 'Parish deleted successfully',
      data: null
    })
    .code(204);
};


