import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { getPool } from '../src/db/pool.js';

const migrationsDirectory = path.resolve(process.cwd(), '..', 'database', 'migrations');

const main = async (): Promise<void> => {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock($1)', [937241]);
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      id VARCHAR(100) PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    const filenames = (await readdir(migrationsDirectory)).filter((filename) => /^\d+_.*\.sql$/.test(filename)).sort();
    for (const filename of filenames) {
      const id = filename.split('_')[0];
      const existing = await client.query('SELECT 1 FROM schema_migrations WHERE id = $1', [id]);
      if (existing.rowCount) {
        console.log(`skip ${filename}`);
        continue;
      }
      const sql = await readFile(path.join(migrationsDirectory, filename), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (id, filename) VALUES ($1, $2)', [id, filename]);
        await client.query('COMMIT');
        console.log(`applied ${filename}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [937241]).catch(() => undefined);
    client.release();
    await pool.end();
  }
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

