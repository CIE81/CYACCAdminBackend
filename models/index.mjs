import sequelize from '../config/connection.mjs';
import User from './user.mjs';
import PrayersRequest from './prayersRequest.mjs';
import Member from './member.mjs';
import Event from './event.mjs';

export { sequelize, User, PrayersRequest, Member, Event };

export const initModels = () => ({
  User,
  PrayersRequest,
  Member,
  Event
});
