import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireSession } from '../../../src/auth/sessions.js';
import { loadTokenBundle, updateTokenBundle } from '../../../src/google/account-repository.js';
import { refreshGoogleToken } from '../../../src/google/oauth.js';
import { error, json, parseBody, requestId } from '../../../src/http/response.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (request.method !== 'POST') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST to issue an access token.', id);
  try {
    const session = await requireSession(request);
    if (!session) return error(response, 401, 'UNAUTHENTICATED', 'Sign in is required.', id);
    const body = parseBody(request.body);
    const accountId = typeof body.account_id === 'string' ? body.account_id : '';
    const current = await loadTokenBundle(session.userId, accountId);
    if (!current) return error(response, 404, 'ACCOUNT_NOT_FOUND', 'The connected account could not be found.', id);
    if (current.expiresAt <= Date.now() + 60_000) {
      const refreshed = await refreshGoogleToken(current.refreshToken);
      const updated = { accessToken: refreshed.access_token, refreshToken: refreshed.refresh_token ?? current.refreshToken, expiresAt: Date.now() + refreshed.expires_in * 1000, scope: refreshed.scope ?? current.scope };
      await updateTokenBundle(session.userId, accountId, updated);
      return json(response, 200, { data: { access_token: updated.accessToken, expires_at: updated.expiresAt }, request_id: id }, id);
    }
    return json(response, 200, { data: { access_token: current.accessToken, expires_at: current.expiresAt }, request_id: id }, id);
  } catch {
    return error(response, 502, 'GOOGLE_TOKEN_FAILED', 'Unable to issue a Google access token.', id, true);
  }
}

