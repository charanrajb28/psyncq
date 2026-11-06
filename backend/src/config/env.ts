export type AppEnvironment = 'development' | 'staging' | 'production';

export interface BackendConfig {
  environment: AppEnvironment;
  databaseUrl?: string;
  sessionSecret?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  googleRedirectUri?: string;
  kmsKeyName?: string;
}

const asEnvironment = (value: string | undefined): AppEnvironment => value === 'staging' || value === 'production' ? value : 'development';

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): BackendConfig => ({
  environment: asEnvironment(env.APP_ENV),
  databaseUrl: env.DATABASE_URL,
  sessionSecret: env.SESSION_SECRET,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: env.GOOGLE_REDIRECT_URI,
  kmsKeyName: env.GCP_KMS_KEY_NAME,
});

export const assertProductionConfig = (config: BackendConfig): void => {
  if (config.environment !== 'production') return;
  const missing = ['databaseUrl', 'sessionSecret', 'googleClientId', 'googleClientSecret', 'googleRedirectUri', 'kmsKeyName'].filter((key) => !config[key as keyof BackendConfig]);
  if (missing.length > 0) throw new Error(`Missing production configuration: ${missing.join(', ')}`);
};

