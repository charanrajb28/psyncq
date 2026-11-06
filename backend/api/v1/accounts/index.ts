import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireSession } from '../../../src/auth/sessions.js';
import { listConnectedAccounts } from '../../../src/google/account-repository.js';
import { error, json, requestId } from '../../../src/http/response.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (request.method !== 'GET') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use GET to list accounts.', id);
  try {
    const session = await requireSession(request);
    if (!session) return error(response, 401, 'UNAUTHENTICATED', 'Sign in is required.', id);
    return json(response, 200, { data: await listConnectedAccounts(session.userId), request_id: id }, id);
  } catch {
    return error(response, 500, 'ACCOUNT_LIST_FAILED', 'Unable to load connected accounts.', id, true);
  }
}

