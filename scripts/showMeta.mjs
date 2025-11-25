import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import sequelize from '../config/connection.mjs';

const run = async () => {
  try {
    const [rows] = await sequelize.query('SELECT name FROM "SequelizeMeta" ORDER BY name ASC;');
    console.log(rows);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();

