#!/usr/bin/env node
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { init, stop } from '../index.mjs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const OUTPUT_DIR = path.resolve(__dirname, '../swagger');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'swagger.json');

const main = async () => {
  const server = await init();
  const response = await server.inject({
    method: 'GET',
    url: '/swagger.json'
  });

  if (response.statusCode !== 200) {
    throw new Error(`Failed to fetch swagger spec: ${response.statusCode}`);
  }

  const spec =
    typeof response.result === 'string' ? JSON.parse(response.result) : response.result;

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(spec, null, 2) + '\n', 'utf-8');

  await stop();
  console.log(`Swagger spec written to ${OUTPUT_FILE}`);
};

main().catch(error => {
  console.error('Failed to generate swagger.json:', error);
  process.exitCode = 1;
});

