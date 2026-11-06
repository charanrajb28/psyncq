import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireSession } from '../../../src/auth/sessions.js';
import { saveOAuthTransaction } from '../../../src/google/account-repository.js';
import { createGoogleAuthorization } from '../../../src/google/oauth.js';
import { error, json, parseBody, requestId } from '../../../src/http/response.js';
import { handleCors } from '../../../src/http/cors.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (handleCors(request, response)) return;
  if (request.method !== 'POST') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST to begin account connection.', id);
  try {
    const session = await requireSession(request);
    if (!session) return error(response, 401, 'UNAUTHENTICATED', 'Sign in is required.', id);
    const body = request.body ? parseBody(request.body) : {};
    const loginHint = typeof body.login_hint === 'string' ? body.login_hint : undefined;
    const authorization = createGoogleAuthorization(loginHint);
    await saveOAuthTransaction(session.userId, 'google_drive', authorization.state, authorization.codeVerifier, process.env.GOOGLE_REDIRECT_URI ?? '');
    return json(response, 200, { data: { authorization_url: authorization.authorizationUrl }, request_id: id }, id);
  } catch {
    return error(response, 503, 'OAUTH_UNAVAILABLE', 'Google account connection is not configured.', id, true);
  }
}
