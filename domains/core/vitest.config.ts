import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: '@marcurry/core',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
