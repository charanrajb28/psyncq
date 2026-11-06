import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireSession } from '../../../src/auth/sessions.js';
import { disconnectAccount } from '../../../src/google/account-repository.js';
import { error, json, parseBody, requestId } from '../../../src/http/response.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (request.method !== 'POST') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST to disconnect an account.', id);
  try {
    const session = await requireSession(request);
    if (!session) return error(response, 401, 'UNAUTHENTICATED', 'Sign in is required.', id);
    const body = parseBody(request.body);
    const accountId = typeof body.account_id === 'string' ? body.account_id : '';
    if (!(await disconnectAccount(session.userId, accountId))) return error(response, 404, 'ACCOUNT_NOT_FOUND', 'The connected account could not be found.', id);
    return json(response, 200, { data: { disconnected: true }, request_id: id }, id);
  } catch {
    return error(response, 500, 'ACCOUNT_DISCONNECT_FAILED', 'Unable to disconnect the account.', id, true);
  }
}

