import type { VercelRequest, VercelResponse } from '@vercel/node';

import { revokeSession } from '../../../src/auth/sessions.js';
import { error, json, requestId } from '../../../src/http/response.js';
import { handleCors } from '../../../src/http/cors.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (handleCors(request, response)) return;
  if (request.method !== 'POST') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST for logout.', id);
  try {
    await revokeSession(request, response);
    return json(response, 200, { data: { logged_out: true }, request_id: id }, id);
  } catch {
    return error(response, 500, 'LOGOUT_FAILED', 'Unable to sign out right now.', id, true);
  }
}
