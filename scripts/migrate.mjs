import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { Sequelize as SequelizeLib, DataTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CRITICAL: Load and fix environment variables BEFORE importing connection module
// Check for custom env file path, otherwise use default .env
let envPath = process.env.DOTENV_CONFIG_PATH;
if (envPath) {
  // Resolve relative paths from project root
  envPath = path.isAbsolute(envPath) ? envPath : path.resolve(__dirname, '..', envPath);
} else {
  envPath = path.resolve(__dirname, '../.env');
}

// Load the env file
const envResult = dotenv.config({ path: envPath });
if (envResult.error && !envResult.error.message.includes('ENOENT')) {
  console.warn(`[migrate] Warning loading env file: ${envResult.error.message}`);
} else if (!envResult.error) {
  console.log(`[migrate] Loaded environment from: ${envPath}`);
}

// Fix DATABASE_URL if it has duplicate prefix BEFORE importing connection
let dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
  // Check for duplicate prefix and fix it
  if (dbUrl.startsWith('DATABASE_URL=')) {
    console.warn('[migrate] WARNING: DATABASE_URL has duplicate prefix, fixing...');
    dbUrl = dbUrl.replace(/^DATABASE_URL=/, '').trim();
    process.env.DATABASE_URL = dbUrl;
    console.log('[migrate] Fixed DATABASE_URL');
  }
  
  // Trim any whitespace
  dbUrl = dbUrl.trim();
  process.env.DATABASE_URL = dbUrl;
  
  // Validate it's a proper connection string
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.error('[migrate] ERROR: DATABASE_URL does not appear to be a valid PostgreSQL connection string');
    console.error('[migrate] It should start with postgresql:// or postgres://');
    console.error(`[migrate] Current value starts with: ${dbUrl.substring(0, 30)}`);
    process.exitCode = 1;
    process.exit(1);
  }
  
  console.log(`[migrate] DATABASE_URL is set (starts with: ${dbUrl.substring(0, 20)}...)`);
  console.log(`[migrate] DATABASE_URL length: ${dbUrl.length} characters`);
} else {
  console.log('[migrate] DATABASE_URL not found, will use individual DB_* variables');
  console.log(`[migrate] DB_HOST: ${process.env.DB_HOST || 'not set'}`);
  console.log(`[migrate] DB_NAME: ${process.env.DB_NAME || 'not set'}`);
  console.log(`[migrate] DB_USER: ${process.env.DB_USER || 'not set'}`);
}

// NOW dynamically import connection after env vars are loaded and fixed
// IMPORTANT: Use dynamic import so it happens AFTER we fix DATABASE_URL
// Static imports are hoisted and execute before our fix code
let sequelize;

const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations');
const META_TABLE = 'SequelizeMeta';
const FILE_EXTENSION_PATTERN = /\.(mjs|cjs|js)$/i;

const log = (message) => console.log(`[migrate] ${message}`);

const normalizeTableName = (table) => {
  if (typeof table === 'string') {
    return table.toLowerCase();
  }

  if (table && typeof table === 'object') {
    if ('tableName' in table && table.tableName) {
      return String(table.tableName).toLowerCase();
    }
    if ('name' in table && table.name) {
      return String(table.name).toLowerCase();
    }
  }

  return String(table).toLowerCase();
};

const ensureMetaTable = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  const hasMetaTable = tables.map(normalizeTableName).includes(META_TABLE.toLowerCase());

  if (!hasMetaTable) {
    await queryInterface.createTable(META_TABLE, {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      }
    });
  }
};

const getMigrationKey = (name) => name.replace(FILE_EXTENSION_PATTERN, '');

const getMigrationFiles = async () => {
  const entries = await fs.readdir(MIGRATIONS_DIR);

  return entries
    .filter((file) => file.endsWith('.mjs') || file.endsWith('.js') || file.endsWith('.cjs'))
    .sort();
};

const getExecutedMigrations = async () => {
  await ensureMetaTable(sequelize.getQueryInterface());
  const [results] = await sequelize.query(
    `SELECT name FROM "${META_TABLE}" ORDER BY name ASC`
  );

  return results.map((row) => row.name);
};

const loadMigration = async (name) => {
  const migrationModule = await import(pathToFileURL(path.join(MIGRATIONS_DIR, name)));
  const migration = migrationModule.default ?? migrationModule;

  if (!migration || typeof migration.up !== 'function') {
    throw new Error(`Migration "${name}" does not export an "up" function`);
  }

  return migration;
};

const recordMigration = async (queryInterface, name) => {
  try {
    await queryInterface.bulkInsert(
      META_TABLE,
      [{ name }],
      { fields: ['name'] }
    );
  } catch (error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      log(`Migration "${name}" is already recorded. Skipping insert.`);
      return;
    }

    throw error;
  }
};

const removeMigrationRecord = async (queryInterface, name) => {
  await queryInterface.bulkDelete(META_TABLE, { name });
};

const runPendingMigrations = async () => {
  const queryInterface = sequelize.getQueryInterface();
  await ensureMetaTable(queryInterface);

  const files = await getMigrationFiles();
  const executed = await getExecutedMigrations();
  const executedKeys = new Set(executed.map(getMigrationKey));
  const pending = files.filter((file) => !executedKeys.has(getMigrationKey(file)));

  if (pending.length === 0) {
    log('No pending migrations. Database schema is up to date.');
    return;
  }

  for (const file of pending) {
    log(`Running migration: ${file}`);
    const migration = await loadMigration(file);
    await migration.up(queryInterface, SequelizeLib, sequelize);
    await recordMigration(queryInterface, file);
    log(`Completed migration: ${file}`);
  }
};

const undoLastMigration = async () => {
  const queryInterface = sequelize.getQueryInterface();
  await ensureMetaTable(queryInterface);

  const executed = await getExecutedMigrations();

  if (executed.length === 0) {
    log('No migrations have been executed yet.');
    return;
  }

  const lastMigration = executed[executed.length - 1];
  const lastKey = getMigrationKey(lastMigration);
  const files = await getMigrationFiles();
  const matchingFile = files.find((file) => getMigrationKey(file) === lastKey);

  if (!matchingFile) {
    throw new Error(`Unable to locate migration file for ${lastMigration}`);
  }

  const migration = await loadMigration(matchingFile);

  if (typeof migration.down !== 'function') {
    throw new Error(`Migration "${lastMigration}" does not export a "down" function`);
  }

  log(`Reverting migration: ${lastMigration}`);
  await migration.down(queryInterface, SequelizeLib, sequelize);
  await removeMigrationRecord(queryInterface, lastMigration);
  log(`Reverted migration: ${lastMigration}`);
};

const undoAllMigrations = async () => {
  const queryInterface = sequelize.getQueryInterface();
  await ensureMetaTable(queryInterface);

  const executed = await getExecutedMigrations();

  if (executed.length === 0) {
    log('No migrations have been executed yet.');
    return;
  }

  const files = await getMigrationFiles();

  for (let i = executed.length - 1; i >= 0; i -= 1) {
    const file = executed[i];
    const fileKey = getMigrationKey(file);
    const matchingFile = files.find((entry) => getMigrationKey(entry) === fileKey);

    if (!matchingFile) {
      throw new Error(`Unable to locate migration file for ${file}`);
    }

    const migration = await loadMigration(matchingFile);

    if (typeof migration.down !== 'function') {
      throw new Error(`Migration "${file}" does not export a "down" function`);
    }

    log(`Reverting migration: ${file}`);
    await migration.down(queryInterface, SequelizeLib, sequelize);
    await removeMigrationRecord(queryInterface, file);
    log(`Reverted migration: ${file}`);
  }
};

const markMigrationExecuted = async (inputName) => {
  if (!inputName) {
    throw new Error('Please provide the migration name to mark as executed.');
  }

  const files = await getMigrationFiles();
  const desiredKey = getMigrationKey(inputName.trim());
  const matchingFile = files.find((file) => getMigrationKey(file) === desiredKey);

  if (!matchingFile) {
    throw new Error(`Unable to find a migration matching "${inputName}".`);
  }

  const queryInterface = sequelize.getQueryInterface();
  await ensureMetaTable(queryInterface);

  const executed = await getExecutedMigrations();
  const executedKeys = new Set(executed.map(getMigrationKey));

  if (executedKeys.has(desiredKey)) {
    log(`Migration "${matchingFile}" is already recorded as executed.`);
    return;
  }

  await recordMigration(queryInterface, matchingFile);
  log(`Marked migration as executed: ${matchingFile}`);
};

const showStatus = async () => {
  const files = await getMigrationFiles();
  const executed = await getExecutedMigrations();
  const executedKeys = new Set(executed.map(getMigrationKey));

  if (files.length === 0) {
    log('No migration files found.');
    return;
  }

  log('Migration status:');

  files.forEach((file) => {
    const status = executedKeys.has(getMigrationKey(file)) ? 'up' : 'down';
    console.log(`${status.padEnd(4)} ${file}`);
  });
};

const run = async () => {
  const command = process.argv[2] || 'up';

  // Dynamically import connection AFTER environment is fixed
  // This ensures DATABASE_URL is fixed before connection.mjs creates the sequelize instance
  if (!sequelize) {
    console.log('[migrate] Loading connection module (DATABASE_URL should be fixed now)...');
    const connectionModule = await import('../config/connection.mjs');
    sequelize = connectionModule.default;
    console.log(`[migrate] Connection module loaded, DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
  }

  try {
    switch (command) {
    case 'up':
    case 'migrate':
      await runPendingMigrations();
      break;
    case 'down':
    case 'undo':
      await undoLastMigration();
      break;
    case 'down:all':
    case 'undo:all':
      await undoAllMigrations();
      break;
    case 'status':
      await showStatus();
      break;
    case 'mark':
      await markMigrationExecuted(process.argv[3]);
      break;
    default:
      console.error(`Unknown command "${command}".`);
      console.log('Available commands: up, down, down:all, status, mark <migration-name>');
      process.exitCode = 1;
      return;
    }
  } catch (error) {
    console.error('Migration error:', error);
    process.exitCode = 1;
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};

run();

