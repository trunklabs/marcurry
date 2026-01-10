import { z } from 'zod';

const KEY_REGEX = /^[a-z0-9][a-z0-9-_]*[a-z0-9]$/;
const MAX_KEY_LENGTH = 100;

export const createEnvironmentSchema = z.object({
  name: z.string().min(2, 'Environment name must be at least 2 characters').max(200),
  key: z
    .string()
    .min(2, 'Environment key must be at least 2 characters')
    .max(MAX_KEY_LENGTH, `Environment key must be ${MAX_KEY_LENGTH} characters or less`)
    .regex(
      KEY_REGEX,
      'Environment key must start and end with alphanumeric characters and contain only lowercase letters, numbers, hyphens, and underscores'
    ),
});

export const updateEnvironmentSchema = z.object({
  name: z.string().min(2, 'Environment name must be at least 2 characters').max(200),
  key: z
    .string()
    .min(2, 'Environment key must be at least 2 characters')
    .max(MAX_KEY_LENGTH, `Environment key must be ${MAX_KEY_LENGTH} characters or less`)
    .regex(
      KEY_REGEX,
      'Environment key must start and end with alphanumeric characters and contain only lowercase letters, numbers, hyphens, and underscores'
    ),
});

export type CreateEnvironmentInput = z.infer<typeof createEnvironmentSchema>;
export type UpdateEnvironmentInput = z.infer<typeof updateEnvironmentSchema>;
