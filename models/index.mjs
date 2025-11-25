import sequelize from '../config/connection.mjs';
import User from './user.mjs';
import PrayersRequest from './prayersRequest.mjs';
import Member from './member.mjs';
import Event from './event.mjs';
import Parish from './parish.mjs';
import Resource from './resource.mjs';
import EventMember from './eventMember.mjs';

export { sequelize, User, PrayersRequest, Member, Event, Parish, Resource, EventMember };

export const initModels = () => ({
  User,
  PrayersRequest,
  Member,
  Event,
  Parish,
  Resource,
  EventMember
});
