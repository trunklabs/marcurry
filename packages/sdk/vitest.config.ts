import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: '@marcurry/sdk',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
