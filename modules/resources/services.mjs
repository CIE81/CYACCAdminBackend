import Boom from '@hapi/boom';
import { Resource } from '../../models/index.mjs';

export const listResources = () =>
  Resource.findAll({
    order: [['name', 'ASC']]
  });

export const getResourceById = async id => {
  const resource = await Resource.findByPk(id);
  if (!resource) {
    throw Boom.notFound('Resource not found');
  }
  return resource;
};

export const createResource = payload => Resource.create(payload);

export const updateResource = async (id, payload) => {
  const resource = await getResourceById(id);
  await resource.update(payload);
  return resource;
};

export const deleteResource = async id => {
  const resource = await getResourceById(id);
  await resource.destroy();
};


