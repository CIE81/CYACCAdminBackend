import Boom from '@hapi/boom';
import { Event, EventMember, Member } from '../../models/index.mjs';
import { Op } from 'sequelize';

const includeMembers = async events => {
  if (!events) {
    return null;
  }

  const isArray = Array.isArray(events);
  const eventsArray = isArray ? events : [events];
  
  if (eventsArray.length === 0) {
    return isArray ? [] : null;
  }

  const eventIds = eventsArray.map(e => e.id);
  
  // Get all event-member relationships
  const eventMembers = await EventMember.findAll({
    where: { eventId: { [Op.in]: eventIds } }
  });

  let membersByEventId = {};
  if (eventMembers.length > 0) {
    // Get all unique member IDs
    const memberIds = [...new Set(eventMembers.map(em => em.memberId))];
    
    // Fetch all members (active and inactive)
    const members = await Member.findAll({
      where: { 
        id: { [Op.in]: memberIds }
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'active']
    });

    // Create a map of members by ID
    const membersMap = {};
    for (const member of members) {
      membersMap[member.id] = member.toJSON ? member.toJSON() : member;
    }

    // Group members by event ID
    membersByEventId = {};
    for (const em of eventMembers) {
      if (!membersByEventId[em.eventId]) {
        membersByEventId[em.eventId] = [];
      }
      if (membersMap[em.memberId]) {
        membersByEventId[em.eventId].push(membersMap[em.memberId]);
      }
    }
  }

  // Attach members to events
  const result = eventsArray.map(event => ({
    ...(event.toJSON ? event.toJSON() : event),
    members: membersByEventId[event.id] || []
  }));

  return isArray ? result : result[0];
};

export const listEvents = async () => {
  const events = await Event.findAll({ order: [['startDateTime', 'ASC']] });
  return includeMembers(events);
};

export const getEventById = async id => {
  const event = await Event.findByPk(id);
  if (!event) {
    throw Boom.notFound('Event not found');
  }
  return includeMembers(event);
};

export const createEvent = payload => Event.create(payload);

export const updateEvent = async (id, payload) => {
  const event = await Event.findByPk(id);
  if (!event) {
    throw Boom.notFound('Event not found');
  }
  await event.update(payload);
  return getEventById(id); // Return with members
};

export const deleteEvent = async id => {
  const event = await getEventById(id);
  await event.destroy();
};

export const addMemberToEvent = async (eventId, memberId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw Boom.notFound('Event not found');
  }

  const member = await Member.findByPk(memberId);
  if (!member) {
    throw Boom.notFound('Member not found');
  }

  // Check if relationship already exists
  const existing = await EventMember.findOne({
    where: { eventId, memberId }
  });

  if (existing) {
    throw Boom.conflict('Member is already added to this event');
  }

  await EventMember.create({ eventId, memberId });
  return getEventById(eventId);
};

export const removeMemberFromEvent = async (eventId, memberId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw Boom.notFound('Event not found');
  }

  const member = await Member.findByPk(memberId);
  if (!member) {
    throw Boom.notFound('Member not found');
  }

  const eventMember = await EventMember.findOne({
    where: { eventId, memberId }
  });

  if (!eventMember) {
    throw Boom.notFound('Member is not associated with this event');
  }

  await eventMember.destroy();
  return getEventById(eventId);
};
