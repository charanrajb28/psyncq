import type { VercelRequest, VercelResponse } from '@vercel/node';

import { verifyPassword } from '../../../src/auth/passwords.js';
import { createSession } from '../../../src/auth/sessions.js';
import { getPool } from '../../../src/db/pool.js';
import { error, json, parseBody, requestId } from '../../../src/http/response.js';
import { handleCors } from '../../../src/http/cors.js';
import { logInfo, logWarn, logError } from '../../../src/http/logger.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (handleCors(request, response)) return;
  logInfo('auth.login_started', { request_id: id });
  if (request.method !== 'POST') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST for login.', id);
  try {
    const body = parseBody(request.body);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const result = await getPool().query<{ id: string; username: string; email: string; password_hash: string | null }>('SELECT id, username, email, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user?.password_hash || !(await verifyPassword(password, user.password_hash))) {
      logWarn('auth.login_rejected', { request_id: id, reason: 'invalid_credentials' });
      return error(response, 401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.', id);
    }
    await createSession(user.id, response);
    logInfo('auth.login_succeeded', { request_id: id, user_id: user.id });
    return json(response, 200, { data: { id: user.id, username: user.username, email: user.email }, request_id: id }, id);
  } catch (cause) {
    logError('auth.login_failed', { request_id: id, message: cause instanceof Error ? cause.message : 'unknown_error' });
    return error(response, 500, 'LOGIN_FAILED', 'Unable to sign in right now.', id, true);
  }
}
