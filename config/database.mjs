import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '..', '.env');
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

export const serverConfig = {
  port: Number(process.env.PORT) || 5000,
  host: process.env.HOST || '0.0.0.0'
};

export const corsConfig = {
  origin: (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
  headers: ['Accept', 'Content-Type', 'Authorization'],
  maxAge: 600,
  additionalHeaders: ['x-request-id']
};

export const swaggerOptions = {
  info: {
    title: 'CYACC Admin API',
    version: '1.0.0'
  },
  grouping: 'tags',
  documentationPath: '/documentation',
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  host:
    process.env.NODE_ENV === 'production'
      ? process.env.VERCEL_URL
      : `${process.env.HOST || 'localhost'}:${process.env.PORT || 5000}`,
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      'x-keyPrefix': 'Bearer '
    }
  },
  security: [{ jwt: [] }]
};

export const jwtOptions = {
  secret: process.env.JWT_SECRET || 'change-me',
  signOptions: {
    algorithm: 'HS256',
    expiresIn: '12h'
  },
  verifyOptions: {
    algorithms: ['HS256']
  }
};

export const isServerless = process.env.VERCEL === 'true';
