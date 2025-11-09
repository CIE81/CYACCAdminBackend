import { getDashboardStatsHandler } from './handlers.mjs';
import { dashboardQuerySchema } from './validation.mjs';

const basePath = '/api/dashboard/stats';

const securedSwagger = {
  'hapi-swagger': {
    security: [{ jwt: [] }]
  }
};

export default () => [
  {
    method: 'GET',
    path: basePath,
    options: {
      auth: 'jwt',
      tags: ['api', 'dashboard'],
      description: 'Retrieve dashboard summary statistics',
      plugins: securedSwagger,
      validate: {
        query: dashboardQuerySchema
      }
    },
    handler: getDashboardStatsHandler
  }
];

