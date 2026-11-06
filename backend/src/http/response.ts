import { randomUUID } from 'node:crypto';
import type { VercelResponse } from '@vercel/node';

export const requestId = (): string => `req_${randomUUID()}`;

export const json = (response: VercelResponse, status: number, body: unknown, id: string): void => {
  response.setHeader('X-Request-Id', id);
  response.status(status).json(body);
};

export const error = (response: VercelResponse, status: number, code: string, message: string, id: string, retryable = false): void => {
  json(response, status, { error: { code, message, retryable }, request_id: id }, id);
};

export const parseBody = (body: unknown): Record<string, unknown> => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid_body');
  return body as Record<string, unknown>;
};

