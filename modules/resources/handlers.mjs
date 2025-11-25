import {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
} from './services.mjs';

export const listResourcesHandler = async () => {
  const resources = await listResources();
  return {
    respCode: 200,
    message: 'Resources retrieved successfully',
    data: resources
  };
};

export const getResourceHandler = async request => {
  const resource = await getResourceById(request.params.id);
  return {
    respCode: 200,
    message: 'Resource retrieved successfully',
    data: resource
  };
};

export const createResourceHandler = async (request, h) => {
  const created = await createResource(request.payload);
  return h
    .response({
      respCode: 201,
      message: 'Resource created successfully',
      data: created
    })
    .code(201);
};

export const updateResourceHandler = async request => {
  const updated = await updateResource(request.params.id, request.payload);
  return {
    respCode: 200,
    message: 'Resource updated successfully',
    data: updated
  };
};

export const deleteResourceHandler = async (request, h) => {
  await deleteResource(request.params.id);
  return h
    .response({
      respCode: 204,
      message: 'Resource deleted successfully',
      data: null
    })
    .code(204);
};


