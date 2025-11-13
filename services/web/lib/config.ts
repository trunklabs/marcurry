import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_ADAPTER: z.enum(['in-memory', 'redis', 'typeorm']),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string(),
});

const serverParsed = serverSchema.safeParse(process.env);

const clientParsed = clientSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!serverParsed.success) {
  console.error('❌ Invalid server-side environment variables:', z.treeifyError(serverParsed.error));
  throw new Error('Invalid server-side environment variables. Check .env.local');
}

if (!clientParsed.success) {
  console.error('❌ Invalid client-side environment variables:', z.treeifyError(clientParsed.error));
  throw new Error('Invalid client-side environment variables. Check .env.local');
}

export const config = {
  ...serverParsed.data,
  ...clientParsed.data,
};
