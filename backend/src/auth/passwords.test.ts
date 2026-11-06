import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { hashPassword, verifyPassword } from './passwords.js';

describe('password hashing', () => {
  it('hashes and verifies without storing the original password', async () => {
    const password = 'correct horse battery staple';
    const encoded = await hashPassword(password);
    assert.equal(encoded.includes(password), false);
    assert.equal(await verifyPassword(password, encoded), true);
    assert.equal(await verifyPassword('wrong password', encoded), false);
  });
});
