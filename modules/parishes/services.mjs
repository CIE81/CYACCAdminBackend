import Boom from '@hapi/boom';
import { Parish } from '../../models/index.mjs';

export const listParishes = () =>
  Parish.findAll({
    order: [['name', 'ASC']]
  });

export const getParishById = async id => {
  const parish = await Parish.findByPk(id);
  if (!parish) {
    throw Boom.notFound('Parish not found');
  }
  return parish;
};

export const createParish = payload => Parish.create(payload);

export const updateParish = async (id, payload) => {
  const parish = await getParishById(id);
  await parish.update(payload);
  return parish;
};

export const deleteParish = async id => {
  const parish = await getParishById(id);
  await parish.destroy();
};


