import Boom from '@hapi/boom';
import HapiRateLimit from 'hapi-rate-limit';

export const registerRateLimiting = async server => {
  if (process.env.VERCEL === 'true') {
    return;
  }

  await server.register({
    plugin: HapiRateLimit,
    options: {
      enabled: true,
      userLimit: 1000,
      pathLimit: false,
      trustProxy: true
    }
  });
};

export const registerErrorHandling = server => {
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (!response.isBoom) {
      return h.continue;
    }

    const boom = response.isBoom ? response : Boom.badImplementation('Unknown error');
    const statusCode = boom.output.statusCode;
    const message = boom.message || 'Request failed';

    return h.response({
      respCode: statusCode,
      message,
      data: null
    }).code(statusCode);
  });
};
