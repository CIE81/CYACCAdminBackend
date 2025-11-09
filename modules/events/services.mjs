import Boom from '@hapi/boom';
import { Event } from '../../models/index.mjs';

export const listEvents = () => Event.findAll({ order: [['startDateTime', 'ASC']] });

export const getEventById = async id => {
  const event = await Event.findByPk(id);
  if (!event) {
    throw Boom.notFound('Event not found');
  }
  return event;
};

export const createEvent = payload => Event.create(payload);

export const updateEvent = async (id, payload) => {
  const event = await getEventById(id);
  await event.update(payload);
  return event;
};

export const deleteEvent = async id => {
  const event = await getEventById(id);
  await event.destroy();
};
