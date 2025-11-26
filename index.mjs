import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import HapiPino from 'hapi-pino';

import { serverConfig, corsConfig, swaggerOptions, isServerless } from './config/database.mjs';
import { registerAuth } from './middleware/auth.mjs';
import { registerRateLimiting, registerErrorHandling } from './middleware/security.mjs';
import { registerModules } from './modules/index.mjs';
import { sequelize } from './models/index.mjs';

let server;
let serverPromise;

const createServer = async () => {
  if (server) {
    return server;
  }

  server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: {
      cors: {
        origin: corsConfig.origin.length ? corsConfig.origin : ['*'],
        additionalHeaders: corsConfig.additionalHeaders
      },
      validate: {
        failAction: async (request, h, error) => {
          if (process.env.NODE_ENV === 'production') {
            throw Boom.badRequest(error.message);
          }
          throw error;
        }
      }
    },
    state: {
      strictHeader: false,
      ignoreErrors: true,
      clearInvalid: true,
      passThrough: true
    }
  });

  const swaggerPlugin = {
    plugin: HapiSwagger,
    options: swaggerOptions
  };

  await server.register([Inert, Vision, swaggerPlugin]);

  const pinoOptions = {
    logEvents: ['onPostStart', 'onPostStop'],
    enabled: !isServerless
  };

  if (process.env.NODE_ENV !== 'production') {
    pinoOptions.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard'
      }
    };
  }

  await server.register({
    plugin: HapiPino,
    options: pinoOptions
  });

  await registerAuth(server);
  await registerRateLimiting(server);
  registerErrorHandling(server);

  server.route({
    method: 'GET',
    path: '/api/health',
    options: {
      auth: false,
      tags: ['api', 'health'],
      description: 'Health check endpoint'
    },
    handler: () => ({
      respCode: 200,
      message: 'OK',
      data: { status: 'healthy' }
    })
  });

  registerModules(server);

  server.ext('onRequest', (request, h) => {
    request.plugins.startTime = process.hrtime.bigint();
    return h.continue;
  });

  server.events.on('response', request => {
    const startTime = request.plugins.startTime;
    if (!startTime) {
      return;
    }

    const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
    if (durationMs >= 1000) {
      server.log(
        ['warn', 'slow'],
        `${request.method.toUpperCase()} ${request.path} took ${durationMs.toFixed(0)}ms`
      );
    }
  });

  server.events.on({ name: 'request', channels: ['error'] }, (request, event) => {
    server.log(['error', 'request'], event.error);
  });

  await sequelize.authenticate();

  return server;
};

export const init = async () => {
  if (!serverPromise) {
    serverPromise = createServer();
  }
  const srv = await serverPromise;
  if (!srv.info.started) {
    await srv.initialize();
  }
  return srv;
};

export const start = async () => {
  const srv = await init();
  if (!srv.info.started) {
    await srv.start();
    srv.log(['info'], `Server running on ${srv.info.uri}`);
  }
  return srv;
};

export const stop = async () => {
  if (server && server.info.started) {
    await server.stop();
  }
};

export { server };

if (process.env.VERCEL !== 'true' && process.env.NODE_ENV !== 'test') {
  start().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

let serverInstance;
let initializationPromise;

const getServerInstance = async () => {
  if (serverInstance) {
    return serverInstance;
  }
  initializationPromise = initializationPromise || init();
  serverInstance = await initializationPromise;
  return serverInstance;
};

const allowedHeaders = headerObj => {
  const result = {};
  Object.keys(headerObj || {}).forEach(key => {
    if (!key.toLowerCase().startsWith('access-control-')) {
      result[key] = headerObj[key];
    }
  });
  return result;
};

const prepareResponse = (res, hapiResponse) => {
  res.status(hapiResponse.statusCode);
  const headers = allowedHeaders(hapiResponse.headers);
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (typeof hapiResponse.result === 'object') {
    res.json(hapiResponse.result);
  } else {
    res.send(hapiResponse.result);
  }
};

const handleOptions = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).end();
};

const serverlessHandler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    handleOptions(req, res);
    return;
  }

  const srv = await getServerInstance();
  const hapiResponse = await srv.inject({
    method: req.method,
    url: req.url,
    headers: req.headers,
    payload: req.body
  });

  prepareResponse(res, hapiResponse);
  res.end();
};

export default serverlessHandler;
