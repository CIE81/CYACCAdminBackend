import { getDashboardStats } from './services.mjs';

export const getDashboardStatsHandler = async request => {
  const { range } = request.query;
  const stats = await getDashboardStats(range);

  return {
    respCode: 200,
    message: 'Dashboard stats retrieved successfully',
    data: stats
  };
};

