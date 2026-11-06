import type { VercelRequest, VercelResponse } from '@vercel/node';

import { hashPassword } from '../../../src/auth/passwords.js';
import { createSession } from '../../../src/auth/sessions.js';
import { validateEmail, validatePassword, validateUsername } from '../../../src/auth/validation.js';
import { getPool } from '../../../src/db/pool.js';
import { error, json, parseBody, requestId } from '../../../src/http/response.js';
import { handleCors } from '../../../src/http/cors.js';
import { logInfo, logWarn, logError } from '../../../src/http/logger.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (handleCors(request, response)) return;
  logInfo('auth.registration_started', { request_id: id });
  if (request.method !== 'POST') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST for registration.', id);
  try {
    const body = parseBody(request.body);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : body.email;
    const username = body.username ?? (typeof email === 'string' ? email.split('@')[0] : undefined);
    if (!validateEmail(email) || !validateUsername(username) || !validatePassword(body.password)) return error(response, 400, 'INVALID_REGISTRATION', 'Provide a valid username, email, and password of at least 12 characters.', id);
    const result = await getPool().query<{ id: string; username: string; email: string }>('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email', [username, email, await hashPassword(body.password)]);
    await createSession(result.rows[0].id, response);
    logInfo('auth.registration_succeeded', { request_id: id, user_id: result.rows[0].id });
    return json(response, 201, { data: result.rows[0], request_id: id }, id);
  } catch (cause) {
    if ((cause as { code?: string }).code === '23505') {
      logWarn('auth.registration_rejected', { request_id: id, reason: 'account_exists' });
      return error(response, 409, 'ACCOUNT_EXISTS', 'An account with that username or email already exists.', id);
    }
    logError('auth.registration_failed', { request_id: id, message: cause instanceof Error ? cause.message : 'unknown_error' });
    return error(response, 500, 'REGISTRATION_FAILED', 'Unable to create the account.', id, true);
  }
}
