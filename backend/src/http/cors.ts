import type { VercelRequest, VercelResponse } from '@vercel/node';

export const handleCors = (request: VercelRequest, response: VercelResponse): boolean => {
  const origin = request.headers.origin;
  const allowedOrigin = process.env.APP_WEB_ORIGIN ?? 'http://localhost:8080';
  if (origin && origin === allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    response.setHeader('Vary', 'Origin');
  }
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return true;
  }
  return false;
};
