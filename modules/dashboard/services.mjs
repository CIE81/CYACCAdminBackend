import { Op } from 'sequelize';
import PrayersRequest from '../../models/prayersRequest.mjs';
import Event from '../../models/event.mjs';
import Member from '../../models/member.mjs';

const RANGE_START_FACTORY = {
  day: () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  },
  week: () => {
    const date = new Date();
    const day = date.getDay();
    const diff = (day + 6) % 7; // Monday as start of the week
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  },
  month: () => {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  },
  year: () => {
    const date = new Date();
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  },
  all: () => null
};

const getRangeStart = range => {
  const factory = RANGE_START_FACTORY[range] || RANGE_START_FACTORY.month;
  return factory();
};

const formatDateOnly = date => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDashboardStats = async range => {
  const normalizedRange = range ?? 'month';
  const rangeStart = getRangeStart(normalizedRange);

  const prayerWhere = rangeStart
    ? {
        date: {
          [Op.gte]: formatDateOnly(rangeStart)
        }
      }
    : undefined;

  const eventsWhere = rangeStart
    ? {
        startDateTime: {
          [Op.gte]: rangeStart
        }
      }
    : undefined;

  const membersWhere = rangeStart
    ? {
        joinDate: {
          [Op.gte]: formatDateOnly(rangeStart)
        }
      }
    : undefined;

  const countWithWhere = (model, where) => (where ? model.count({ where }) : model.count());

  const [prayerCount, prayerTotal, eventsCount, eventsTotal, membersCount, membersTotal] = await Promise.all([
    countWithWhere(PrayersRequest, prayerWhere),
    PrayersRequest.count(),
    countWithWhere(Event, eventsWhere),
    Event.count(),
    countWithWhere(Member, membersWhere),
    Member.count()
  ]);

  return {
    range: normalizedRange,
    rangeStart: rangeStart ? rangeStart.toISOString() : null,
    metrics: {
      prayerRequests: {
        total: prayerTotal,
        rangeCount: prayerCount
      },
      events: {
        total: eventsTotal,
        rangeCount: eventsCount
      },
      members: {
        total: membersTotal,
        rangeCount: membersCount
      }
    }
  };
};

