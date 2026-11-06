import { createHash, randomBytes } from 'node:crypto';

const authorizationEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
const tokenEndpoint = 'https://oauth2.googleapis.com/token';
const userInfoEndpoint = 'https://openidconnect.googleapis.com/v1/userinfo';

export const googleScopes = (): string[] => (process.env.GOOGLE_DRIVE_SCOPES ?? 'openid email profile https://www.googleapis.com/auth/drive.metadata.readonly').split(/\s+/).filter(Boolean);

export interface OAuthTransactionValues {
  state: string;
  codeVerifier: string;
  authorizationUrl: string;
}

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
};

const challenge = (value: string): string => createHash('sha256').update(value).digest('base64url');
export const hashOAuthValue = (value: string): Buffer => createHash('sha256').update(value).digest();

export const createGoogleAuthorization = (loginHint?: string): OAuthTransactionValues => {
  const state = randomBytes(32).toString('base64url');
  const codeVerifier = randomBytes(48).toString('base64url');
  const params = new URLSearchParams({
    client_id: required('GOOGLE_CLIENT_ID'),
    redirect_uri: required('GOOGLE_REDIRECT_URI'),
    response_type: 'code',
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
    scope: googleScopes().join(' '),
    state,
    code_challenge: challenge(codeVerifier),
    code_challenge_method: 'S256',
  });
  if (loginHint) params.set('login_hint', loginHint);
  return { state, codeVerifier, authorizationUrl: `${authorizationEndpoint}?${params.toString()}` };
};

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type: string;
}

export const exchangeGoogleCode = async (code: string, codeVerifier: string): Promise<GoogleTokenResponse> => {
  const response = await fetch(tokenEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: required('GOOGLE_CLIENT_ID'), client_secret: required('GOOGLE_CLIENT_SECRET'), redirect_uri: required('GOOGLE_REDIRECT_URI'), grant_type: 'authorization_code', code_verifier: codeVerifier }) });
  if (!response.ok) throw new Error(`Google token exchange failed with ${response.status}`);
  return await response.json() as GoogleTokenResponse;
};

export const refreshGoogleToken = async (refreshToken: string): Promise<GoogleTokenResponse> => {
  const response = await fetch(tokenEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ refresh_token: refreshToken, client_id: required('GOOGLE_CLIENT_ID'), client_secret: required('GOOGLE_CLIENT_SECRET'), grant_type: 'refresh_token' }) });
  if (!response.ok) throw new Error(`Google token refresh failed with ${response.status}`);
  return await response.json() as GoogleTokenResponse;
};

export interface GoogleProfile { sub: string; email?: string; name?: string; }

export const fetchGoogleProfile = async (accessToken: string): Promise<GoogleProfile> => {
  const response = await fetch(userInfoEndpoint, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) throw new Error(`Google profile lookup failed with ${response.status}`);
  return await response.json() as GoogleProfile;
};

