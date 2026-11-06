import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logInfo } from '../src/http/logger.js';

export default function handler(_request: VercelRequest, response: VercelResponse) {
  logInfo('health.checked');
  response.status(200).json({ service: 'psyncq-api', status: 'ok', phase: 1 });
}
