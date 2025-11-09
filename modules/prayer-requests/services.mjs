import Boom from '@hapi/boom';
import { PrayersRequest } from '../../models/index.mjs';

export const listPrayerRequests = () => PrayersRequest.findAll({ order: [['date', 'DESC']] });

export const getPrayerRequestById = async id => {
  const prayerRequest = await PrayersRequest.findByPk(id);
  if (!prayerRequest) {
    throw Boom.notFound('Prayer request not found');
  }
  return prayerRequest;
};

export const createPrayerRequest = payload => {
  const now = new Date();
  return PrayersRequest.create({
    ...payload,
    date: payload.date ? new Date(payload.date) : now
  });
};

export const updatePrayerRequest = async (id, payload) => {
  const prayerRequest = await getPrayerRequestById(id);
  const now = new Date();
  await prayerRequest.update({
    ...payload,
    date: payload.date ? new Date(payload.date) : now
  });
  return prayerRequest;
};

export const deletePrayerRequest = async id => {
  const prayerRequest = await getPrayerRequestById(id);
  await prayerRequest.destroy();
};
