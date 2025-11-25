import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables (migration scripts load dotenv before importing this)
// Only load default .env if NODE_ENV is not production (production uses custom path)
// This ensures migrations can load custom env files
if (process.env.NODE_ENV !== 'production' && !process.env.DOTENV_CONFIG_PATH) {
  dotenv.config();
}

const createSequelize = () => {
  const isServerless = process.env.VERCEL === 'true';
  
  // Debug logging in production/migration scenarios
  if (process.env.NODE_ENV === 'production') {
    console.log(`[connection] DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
    if (process.env.DATABASE_URL) {
      console.log(`[connection] DATABASE_URL starts with: ${process.env.DATABASE_URL.substring(0, 30)}...`);
    }
  }
  
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      pool: {
        max: isServerless ? 1 : 5,
        min: 0,
        acquire: isServerless ? 10000 : 30000,
        idle: isServerless ? 1000 : 10000
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        },
        connectTimeout: 10000
      }
    });
  }
  
  // If no DATABASE_URL, log what we're using
  if (process.env.NODE_ENV === 'production') {
    console.log('[connection] No DATABASE_URL, using individual DB_* variables');
    console.log(`[connection] DB_USER: ${process.env.DB_USER || 'postgres'}`);
    console.log(`[connection] DB_HOST: ${process.env.DB_HOST || '127.0.0.1'}`);
    console.log(`[connection] DB_NAME: ${process.env.DB_NAME || 'cyaccadmin_dev'}`);
  }

  return new Sequelize(
    process.env.DB_NAME || 'cyaccadmin_dev',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {}
    }
  );
};

const sequelize = createSequelize();

export default sequelize;
export const getSequelize = () => sequelize;
