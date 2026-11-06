import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto';
const scrypt = (password: string, salt: Uint8Array, keyLength: number, options: { N: number; r: number; p: number }): Promise<Buffer> => new Promise((resolve, reject) => {
  nodeScrypt(password, salt, keyLength, options, (error, derived) => error ? reject(error) : resolve(derived as Buffer));
});
const COST = 16_384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;

const encode = (value: Uint8Array): string => Buffer.from(value).toString('base64url');
const decode = (value: string): Buffer => Buffer.from(value, 'base64url');

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const derived = (await scrypt(password, salt, 32, { N: COST, r: BLOCK_SIZE, p: PARALLELIZATION })) as Buffer;
  return `scrypt$${COST}$${BLOCK_SIZE}$${PARALLELIZATION}$${encode(salt)}$${encode(derived)}`;
};

export const verifyPassword = async (password: string, encoded: string): Promise<boolean> => {
  const [algorithm, cost, blockSize, parallelization, saltValue, hashValue] = encoded.split('$');
  if (algorithm !== 'scrypt' || !cost || !blockSize || !parallelization || !saltValue || !hashValue) return false;
  const expected = decode(hashValue);
  const actual = (await scrypt(password, decode(saltValue), expected.length, {
    N: Number(cost), r: Number(blockSize), p: Number(parallelization),
  })) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
};
