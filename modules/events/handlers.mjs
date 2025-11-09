import {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from './services.mjs';

export const listEventsHandler = async () => {
  const events = await listEvents();
  return {
    respCode: 200,
    message: 'Events retrieved successfully',
    data: events
  };
};

export const getEventHandler = async request => {
  const event = await getEventById(request.params.id);
  return {
    respCode: 200,
    message: 'Event retrieved successfully',
    data: event
  };
};

export const createEventHandler = async (request, h) => {
  const created = await createEvent(request.payload);
  return h
    .response({
      respCode: 201,
      message: 'Event created successfully',
      data: created
    })
    .code(201);
};

export const updateEventHandler = async request => {
  const updated = await updateEvent(request.params.id, request.payload);
  return {
    respCode: 200,
    message: 'Event updated successfully',
    data: updated
  };
};

export const deleteEventHandler = async (request, h) => {
  await deleteEvent(request.params.id);
  return h
    .response({
      respCode: 204,
      message: 'Event deleted successfully',
      data: null
    })
    .code(204);
};
