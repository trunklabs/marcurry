import { z } from 'zod';

const KEY_REGEX = /^[a-z0-9][a-z0-9-_]*[a-z0-9]$/;
const MAX_KEY_LENGTH = 100;

export const createFlagSchema = z
  .object({
    projectId: z.string().min(1, 'Project is required'),
    name: z.string().min(2, 'Flag name must be at least 2 characters').max(200),
    key: z
      .string()
      .min(2, 'Flag key must be at least 2 characters')
      .max(MAX_KEY_LENGTH, `Flag key must be ${MAX_KEY_LENGTH} characters or less`)
      .regex(
        KEY_REGEX,
        'Flag key must start and end with alphanumeric characters and contain only lowercase letters, numbers, hyphens, and underscores'
      ),
    description: z.string().optional(),
    valueType: z.enum(['boolean', 'string', 'number', 'json']),
    defaultValue: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.valueType === 'boolean' && !['true', 'false'].includes(data.defaultValue)) {
      ctx.addIssue({
        code: 'custom',
        message: "Boolean value must be 'true' or 'false'",
        path: ['defaultValue'],
      });
    }
    if (data.valueType === 'number' && isNaN(Number(data.defaultValue))) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid number format',
        path: ['defaultValue'],
      });
    }
    if (data.valueType === 'json') {
      try {
        JSON.parse(data.defaultValue);
      } catch {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid JSON format',
          path: ['defaultValue'],
        });
      }
    }
  });

export const updateFlagSchema = z.object({
  name: z.string().min(2, 'Flag name must be at least 2 characters').max(200),
});

export type CreateFlagInput = z.infer<typeof createFlagSchema>;
export type UpdateFlagInput = z.infer<typeof updateFlagSchema>;
