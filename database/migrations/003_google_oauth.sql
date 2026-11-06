ALTER TABLE oauth_transactions
  ADD COLUMN IF NOT EXISTS code_verifier_encrypted BYTEA,
  ADD COLUMN IF NOT EXISTS code_verifier_nonce BYTEA,
  ADD COLUMN IF NOT EXISTS code_verifier_auth_tag BYTEA;

