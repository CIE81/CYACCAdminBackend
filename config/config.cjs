const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envFile = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

const common = {
  dialect: 'postgres',
  define: {
    underscored: true,
    timestamps: true
  }
};

module.exports = {
  development: {
    ...common,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'cyaccadmin_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    logging: false
  },
  test: {
    ...common,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME_TEST || 'cyaccadmin_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    logging: false
  },
  production: {
    ...common,
    use_env_variable: 'DATABASE_URL',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
