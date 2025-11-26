import Boom from '@hapi/boom';
import HapiRateLimit from 'hapi-rate-limit';

export const corsConfig = {
  origin: (() => {
    const allowedOrigins = [];

    allowedOrigins.push('http://localhost:3000');
    allowedOrigins.push('http://localhost:5000');

    allowedOrigins.push('https://cyacc-admin-web.vercel.app');

    if (process.env.VERCEL_URL) {
      allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
    }

    if (process.env.ALLOWED_ORIGINS) {
      const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
      allowedOrigins.push(...envOrigins);
    }

    if (process.env.NODE_ENV === 'development' || process.env.VERCEL) {
      return ['*'];
    }

    return allowedOrigins;
  })(),
  credentials: true,
  additionalHeaders: ['x-api-key']
};

export const registerRateLimiting = async server => {
  await server.register({
    plugin: HapiRateLimit,
    options: {
      enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
      userLimit: parseInt(process.env.RATE_LIMIT_MAX, 10) || 500,
      pathLimit: false,
      authLimit: 5,
      trustProxy: true,
      userCache: {
        expiresIn: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 900000
      }
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
