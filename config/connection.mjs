import { Sequelize } from 'sequelize';

const createSequelize = () => {
  const isServerless = process.env.VERCEL === 'true';
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
