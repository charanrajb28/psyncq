import type { VercelRequest, VercelResponse } from '@vercel/node';

import { refreshSession } from '../../../src/auth/sessions.js';
import { error, json, requestId } from '../../../src/http/response.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (request.method !== 'POST') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST to refresh a session.', id);
  try {
    if (!(await refreshSession(request, response))) return error(response, 401, 'UNAUTHENTICATED', 'Sign in is required.', id);
    return json(response, 200, { data: { refreshed: true }, request_id: id }, id);
  } catch {
    return error(response, 500, 'SESSION_REFRESH_FAILED', 'Unable to refresh the session.', id, true);
  }
}

