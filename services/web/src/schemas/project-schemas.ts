import { z } from 'zod';

const KEY_REGEX = /^[a-z0-9][a-z0-9-_]*[a-z0-9]$/;
const MAX_KEY_LENGTH = 100;

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').max(200),
  key: z
    .string()
    .min(2, 'Project key must be at least 2 characters')
    .max(MAX_KEY_LENGTH, `Project key must be ${MAX_KEY_LENGTH} characters or less`)
    .regex(
      KEY_REGEX,
      'Project key must start and end with alphanumeric characters and contain only lowercase letters, numbers, hyphens, and underscores'
    ),
  environments: z
    .array(
      z.object({
        name: z.string().min(2, 'Environment name must be at least 2 characters'),
        key: z
          .string()
          .min(2, 'Environment key must be at least 2 characters')
          .max(MAX_KEY_LENGTH, `Environment key must be ${MAX_KEY_LENGTH} characters or less`)
          .regex(
            KEY_REGEX,
            'Environment key must start and end with alphanumeric characters and contain only lowercase letters, numbers, hyphens, and underscores'
          ),
      })
    )
    .min(1, 'At least one environment is required')
    .refine(
      (envs) => new Set(envs.map((e) => e.name.toLowerCase())).size === envs.length,
      'Environment names must be unique'
    )
    .refine(
      (envs) => new Set(envs.map((e) => e.key.toLowerCase())).size === envs.length,
      'Environment keys must be unique'
    ),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').max(200),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
