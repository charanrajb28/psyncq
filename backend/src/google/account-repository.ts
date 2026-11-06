import { decryptText, encryptText } from '../crypto/token-encryption.js';
import { getPool } from '../db/pool.js';
import { hashOAuthValue } from './oauth.js';

export interface StoredOAuthTransaction {
  userId: string;
  redirectUri: string;
  codeVerifier: string;
}

export const saveOAuthTransaction = async (userId: string, provider: string, state: string, codeVerifier: string, redirectUri: string): Promise<void> => {
  const encrypted = encryptText(codeVerifier);
  await getPool().query('INSERT INTO oauth_transactions (user_id, provider, state_hash, code_verifier_hash, code_verifier_encrypted, code_verifier_nonce, code_verifier_auth_tag, redirect_uri, expires_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() + INTERVAL \'10 minutes\')', [userId, provider, hashOAuthValue(state), hashOAuthValue(codeVerifier), encrypted.ciphertext, encrypted.nonce, encrypted.authTag, redirectUri]);
};

export const consumeOAuthTransaction = async (state: string): Promise<StoredOAuthTransaction | null> => {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await client.query<{ user_id: string; redirect_uri: string; code_verifier_encrypted: Buffer; code_verifier_nonce: Buffer; code_verifier_auth_tag: Buffer }>('SELECT user_id, redirect_uri, code_verifier_encrypted, code_verifier_nonce, code_verifier_auth_tag FROM oauth_transactions WHERE state_hash = $1 AND consumed_at IS NULL AND expires_at > NOW() FOR UPDATE', [hashOAuthValue(state)]);
    if (!result.rows[0]) { await client.query('ROLLBACK'); return null; }
    await client.query('UPDATE oauth_transactions SET consumed_at = NOW() WHERE state_hash = $1', [hashOAuthValue(state)]);
    await client.query('COMMIT');
    const row = result.rows[0];
    return { userId: row.user_id, redirectUri: row.redirect_uri, codeVerifier: decryptText({ ciphertext: row.code_verifier_encrypted, nonce: row.code_verifier_nonce, authTag: row.code_verifier_auth_tag }) };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export interface GoogleTokenBundle { accessToken: string; refreshToken: string; expiresAt: number; scope?: string; }

export const saveConnectedAccount = async (userId: string, providerAccountId: string, email: string | undefined, displayName: string | undefined, tokens: GoogleTokenBundle): Promise<string> => {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const account = await client.query<{ id: string }>('INSERT INTO connected_accounts (user_id, provider, provider_account_id, email, display_name, status) VALUES ($1, \'google_drive\', $2, $3, $4, \'CONNECTED\') ON CONFLICT (user_id, provider, provider_account_id) DO UPDATE SET email = EXCLUDED.email, display_name = EXCLUDED.display_name, status = \'CONNECTED\', updated_at = NOW() RETURNING id', [userId, providerAccountId, email ?? null, displayName ?? null]);
    const encrypted = encryptText(JSON.stringify(tokens));
    await client.query('INSERT INTO oauth_credentials (user_id, account_id, encrypted_token, nonce, auth_tag, key_version) VALUES ($1, $2, $3, $4, $5, \'env-v1\') ON CONFLICT (user_id, account_id) DO UPDATE SET encrypted_token = EXCLUDED.encrypted_token, nonce = EXCLUDED.nonce, auth_tag = EXCLUDED.auth_tag, updated_at = NOW()', [userId, account.rows[0].id, encrypted.ciphertext, encrypted.nonce, encrypted.authTag]);
    await client.query('COMMIT');
    return account.rows[0].id;
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
};

export const listConnectedAccounts = async (userId: string) => (await getPool().query('SELECT id, provider, provider_account_id, email, display_name, status, root_folder_id, connected_at, updated_at FROM connected_accounts WHERE user_id = $1 ORDER BY connected_at ASC', [userId])).rows;

export const loadTokenBundle = async (userId: string, accountId: string): Promise<GoogleTokenBundle | null> => {
  const result = await getPool().query<{ encrypted_token: Buffer; nonce: Buffer; auth_tag: Buffer }>('SELECT c.encrypted_token, c.nonce, c.auth_tag FROM oauth_credentials c JOIN connected_accounts a ON a.id = c.account_id WHERE c.user_id = $1 AND c.account_id = $2 AND a.provider = \'google_drive\'', [userId, accountId]);
  if (!result.rows[0]) return null;
  return JSON.parse(decryptText({ ciphertext: result.rows[0].encrypted_token, nonce: result.rows[0].nonce, authTag: result.rows[0].auth_tag })) as GoogleTokenBundle;
};

export const updateTokenBundle = async (userId: string, accountId: string, tokens: GoogleTokenBundle): Promise<void> => {
  const encrypted = encryptText(JSON.stringify(tokens));
  await getPool().query('UPDATE oauth_credentials SET encrypted_token = $1, nonce = $2, auth_tag = $3, updated_at = NOW() WHERE user_id = $4 AND account_id = $5', [encrypted.ciphertext, encrypted.nonce, encrypted.authTag, userId, accountId]);
};

export const disconnectAccount = async (userId: string, accountId: string): Promise<boolean> => (await getPool().query('UPDATE connected_accounts SET status = \'DISCONNECTED\', updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING id', [accountId, userId])).rowCount === 1;
