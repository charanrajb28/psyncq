import type { VercelRequest, VercelResponse } from '@vercel/node';

import { consumeOAuthTransaction, saveConnectedAccount } from '../../../../src/google/account-repository.js';
import { exchangeGoogleCode, fetchGoogleProfile } from '../../../../src/google/oauth.js';
import { error, json, requestId } from '../../../../src/http/response.js';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  const id = requestId();
  if (request.method !== 'GET') return error(response, 405, 'METHOD_NOT_ALLOWED', 'Use GET for the OAuth callback.', id);
  const state = typeof request.query.state === 'string' ? request.query.state : undefined;
  const code = typeof request.query.code === 'string' ? request.query.code : undefined;
  if (!state || !code) return error(response, 400, 'INVALID_OAUTH_CALLBACK', 'The Google authorization response is incomplete.', id);
  try {
    const transaction = await consumeOAuthTransaction(state);
    if (!transaction) return error(response, 400, 'INVALID_OAUTH_STATE', 'The Google authorization request expired or was already used.', id);
    const tokens = await exchangeGoogleCode(code, transaction.codeVerifier);
    if (!tokens.refresh_token) return error(response, 400, 'MISSING_REFRESH_TOKEN', 'Google did not return a refresh token. Reconnect and approve offline access.', id);
    const profile = await fetchGoogleProfile(tokens.access_token);
    const accountId = await saveConnectedAccount(transaction.userId, profile.sub, profile.email, profile.name, { accessToken: tokens.access_token, refreshToken: tokens.refresh_token, expiresAt: Date.now() + tokens.expires_in * 1000, scope: tokens.scope });
    return json(response, 200, { data: { account_id: accountId, email: profile.email, display_name: profile.name }, request_id: id }, id);
  } catch {
    return error(response, 502, 'GOOGLE_OAUTH_FAILED', 'Google account connection failed.', id, true);
  }
}

