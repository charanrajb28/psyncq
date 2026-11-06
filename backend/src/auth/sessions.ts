import { createHash, randomBytes } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getPool } from '../db/pool.js';

const SESSION_DAYS = 30;
const cookieName = 'psyncq_session';
const hashToken = (token: string): Buffer => createHash('sha256').update(token).digest();

const readCookie = (request: VercelRequest, name: string): string | undefined => {
  const cookies = request.headers.cookie?.split(';') ?? [];
  const match = cookies.map((cookie) => cookie.trim().split('=')).find(([key]) => key === name);
  return match?.[1];
};

const cookie = (token: string, maxAge: number): string => {
  const secure = process.env.APP_ENV === 'production' ? '; Secure' : '';
  return `${cookieName}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax${secure}`;
};

export const createSession = async (userId: string, response: VercelResponse): Promise<void> => {
  const rawToken = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await getPool().query('INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [userId, hashToken(rawToken), expiresAt]);
  response.setHeader('Set-Cookie', cookie(rawToken, SESSION_DAYS * 24 * 60 * 60));
};

export const revokeSession = async (request: VercelRequest, response: VercelResponse): Promise<void> => {
  const rawToken = readCookie(request, cookieName);
  if (rawToken) await getPool().query('UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL', [hashToken(rawToken)]);
  response.setHeader('Set-Cookie', cookie('', 0));
};

export const requireSession = async (request: VercelRequest): Promise<{ userId: string } | null> => {
  const rawToken = readCookie(request, cookieName);
  if (!rawToken) return null;
  const result = await getPool().query<{ user_id: string }>('UPDATE sessions SET last_seen_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW() RETURNING user_id', [hashToken(rawToken)]);
  return result.rows[0] ? { userId: result.rows[0].user_id } : null;
};

export const refreshSession = async (request: VercelRequest, response: VercelResponse): Promise<boolean> => {
  const session = await requireSession(request);
  if (!session) return false;
  await revokeSession(request, response);
  await createSession(session.userId, response);
  return true;
};

