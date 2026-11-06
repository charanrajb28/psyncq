export interface MigrationDefinition {
  id: string;
  filename: string;
  description: string;
}

export const migrations: readonly MigrationDefinition[] = [
  { id: '001', filename: '001_initial_schema.sql', description: 'Create users, connected accounts, and encrypted credential metadata tables.' },
  { id: '002', filename: '002_authentication.sql', description: 'Add password hashes, sessions, and OAuth transaction state.' },
  { id: '003', filename: '003_google_oauth.sql', description: 'Store encrypted PKCE verifier material for Google OAuth callbacks.' },
];
