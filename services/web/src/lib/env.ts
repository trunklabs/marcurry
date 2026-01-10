import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === 'true' ||
    process.env.CI === 'true' ||
    process.env.npm_lifecycle_event === 'build',
});

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
