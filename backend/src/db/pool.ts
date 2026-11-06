import { Pool } from 'pg';
import { logError } from '../http/logger.js';

let pool: Pool | undefined;

export const getPool = (): Pool => {
  if (pool) return pool;
  const rawConnectionString = process.env.DATABASE_URL;
  if (!rawConnectionString) throw new Error('DATABASE_URL is not configured');
  const parsedConnectionString = new URL(rawConnectionString);
  const requestedSslMode = parsedConnectionString.searchParams.get('sslmode');
  parsedConnectionString.searchParams.delete('sslmode');
  pool = new Pool({
    connectionString: parsedConnectionString.toString(),
    // Keep the pool small because Vercel can create several function instances.
    max: Number(process.env.DB_POOL_MAX ?? 2),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
    query_timeout: 8_000,
    statement_timeout: 8_000,
    // Aiven's managed endpoint requires TLS. For local development, the CA is
    // not installed yet, so preserve encryption while skipping CA validation.
    // Production should provide the Aiven CA and set rejectUnauthorized=true.
    ssl: requestedSslMode ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true' } : undefined,
  });
  pool.on('error', (error) => logError('database.pool_error', { message: error.message }));
  return pool;
};
