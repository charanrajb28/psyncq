import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireSession } from '../../../src/auth/sessions.js';
import { getPool } from '../../../src/db/pool.js';
import { error, json, requestId } from '../../../src/http/response.js';
import { handleCors } from '../../../src/http/cors.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (handleCors(request, response)) return;
  if (request.method !== 'GET') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use GET for the current user.', id);
  try {
    const session = await requireSession(request);
    if (!session) return error(response, 401, 'UNAUTHENTICATED', 'Sign in is required.', id);
    const result = await getPool().query<{ id: string; username: string; email: string }>('SELECT id, username, email FROM users WHERE id = $1', [session.userId]);
    if (!result.rows[0]) return error(response, 401, 'UNAUTHENTICATED', 'Sign in is required.', id);
    return json(response, 200, { data: result.rows[0], request_id: id }, id);
  } catch {
    return error(response, 500, 'SESSION_LOOKUP_FAILED', 'Unable to load the current user.', id, true);
  }
}
