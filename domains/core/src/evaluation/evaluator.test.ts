import { describe, it, expect } from 'vitest';
import { evaluateFlag } from './evaluator.js';
import type { FlagEnvironmentConfig } from '../types/entities.js';
import type { Actor, BooleanGate, ActorsGate } from '../types/value-objects.js';

describe('evaluateFlag', () => {
  const actor: Actor = { id: 'user-123' };

  describe('disabled flag', () => {
    it('returns default value with enabled=false when flag is disabled', () => {
      const config: FlagEnvironmentConfig<'boolean'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: false,
        defaultValue: false,
        gates: [],
      };

      const result = evaluateFlag('my-flag', config, actor);

      expect(result).toEqual({
        flagKey: 'my-flag',
        value: false,
        enabled: false,
        reason: 'flag disabled',
      });
    });

    it('returns default value even if gates would match', () => {
      const config: FlagEnvironmentConfig<'boolean'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: false,
        defaultValue: false,
        gates: [
          {
            id: 'gate-1',
            type: 'boolean',
            enabled: true,
            value: true,
          },
        ],
      };

      const result = evaluateFlag('my-flag', config, actor);

      expect(result.enabled).toBe(false);
      expect(result.value).toBe(false);
      expect(result.reason).toBe('flag disabled');
    });
  });

  describe('enabled flag with no gates', () => {
    it('returns default value with enabled=true', () => {
      const config: FlagEnvironmentConfig<'string'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: 'default-variant',
        gates: [],
      };

      const result = evaluateFlag('feature-x', config, actor);

      expect(result).toEqual({
        flagKey: 'feature-x',
        value: 'default-variant',
        enabled: true,
        reason: 'default value',
      });
    });
  });

  describe('enabled flag with matching boolean gate', () => {
    it('returns gate value when boolean gate is enabled', () => {
      const config: FlagEnvironmentConfig<'boolean'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: false,
        gates: [
          {
            id: 'gate-1',
            type: 'boolean',
            enabled: true,
            value: true,
          },
        ],
      };

      const result = evaluateFlag('feature', config, actor);

      expect(result).toEqual({
        flagKey: 'feature',
        value: true,
        enabled: true,
        reason: 'gate matched',
        matchedGate: {
          id: 'gate-1',
          type: 'boolean',
        },
      });
    });

    it('skips disabled boolean gate and returns default', () => {
      const config: FlagEnvironmentConfig<'boolean'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: false,
        gates: [
          {
            id: 'gate-1',
            type: 'boolean',
            enabled: false,
            value: true,
          },
        ],
      };

      const result = evaluateFlag('feature', config, actor);

      expect(result.value).toBe(false);
      expect(result.reason).toBe('default value');
      expect(result.matchedGate).toBeUndefined();
    });
  });

  describe('enabled flag with actors gate', () => {
    it('returns gate value when actor matches', () => {
      const config: FlagEnvironmentConfig<'number'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: 10,
        gates: [
          {
            id: 'gate-1',
            type: 'actors',
            enabled: true,
            actorIds: ['user-123', 'user-456'],
            value: 100,
          },
        ],
      };

      const result = evaluateFlag('rate-limit', config, actor);

      expect(result).toEqual({
        flagKey: 'rate-limit',
        value: 100,
        enabled: true,
        reason: 'gate matched',
        matchedGate: {
          id: 'gate-1',
          type: 'actors',
        },
      });
    });

    it('returns default when actor does not match', () => {
      const config: FlagEnvironmentConfig<'number'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: 10,
        gates: [
          {
            id: 'gate-1',
            type: 'actors',
            enabled: true,
            actorIds: ['user-456', 'user-789'],
            value: 100,
          },
        ],
      };

      const result = evaluateFlag('rate-limit', config, actor);

      expect(result.value).toBe(10);
      expect(result.reason).toBe('default value');
      expect(result.matchedGate).toBeUndefined();
    });
  });

  describe('multiple gates', () => {
    it('returns first matching gate value', () => {
      const config: FlagEnvironmentConfig<'string'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: 'default',
        gates: [
          {
            id: 'gate-1',
            type: 'actors',
            enabled: true,
            actorIds: ['user-123'],
            value: 'first-match',
          },
          {
            id: 'gate-2',
            type: 'actors',
            enabled: true,
            actorIds: ['user-123'],
            value: 'second-match',
          },
        ],
      };

      const result = evaluateFlag('feature', config, actor);

      expect(result.value).toBe('first-match');
      expect(result.matchedGate?.id).toBe('gate-1');
    });

    it('skips non-matching gates and matches later gate', () => {
      const config: FlagEnvironmentConfig<'string'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: 'default',
        gates: [
          {
            id: 'gate-1',
            type: 'actors',
            enabled: true,
            actorIds: ['other-user'],
            value: 'vip',
          },
          {
            id: 'gate-2',
            type: 'actors',
            enabled: true,
            actorIds: ['user-123'],
            value: 'regular',
          },
        ],
      };

      const result = evaluateFlag('feature', config, actor);

      expect(result.value).toBe('regular');
      expect(result.matchedGate?.id).toBe('gate-2');
    });

    it('skips disabled gates', () => {
      const config: FlagEnvironmentConfig<'boolean'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: false,
        gates: [
          {
            id: 'gate-1',
            type: 'actors',
            enabled: false,
            actorIds: ['user-123'],
            value: true,
          },
          {
            id: 'gate-2',
            type: 'boolean',
            enabled: true,
            value: true,
          },
        ],
      };

      const result = evaluateFlag('feature', config, actor);

      expect(result.matchedGate?.id).toBe('gate-2');
    });

    it('returns default when all gates are disabled', () => {
      const config: FlagEnvironmentConfig<'boolean'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: false,
        gates: [
          {
            id: 'gate-1',
            type: 'actors',
            enabled: false,
            actorIds: ['user-123'],
            value: true,
          },
          {
            id: 'gate-2',
            type: 'boolean',
            enabled: false,
            value: true,
          },
        ],
      };

      const result = evaluateFlag('feature', config, actor);

      expect(result.value).toBe(false);
      expect(result.reason).toBe('default value');
    });
  });

  describe('different value types', () => {
    it('handles json value type', () => {
      const config: FlagEnvironmentConfig<'json'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: { theme: 'light' },
        gates: [
          {
            id: 'gate-1',
            type: 'actors',
            enabled: true,
            actorIds: ['user-123'],
            value: { theme: 'dark', beta: true },
          },
        ],
      };

      const result = evaluateFlag('config', config, actor);

      expect(result.value).toEqual({ theme: 'dark', beta: true });
    });

    it('handles number value type', () => {
      const config: FlagEnvironmentConfig<'number'> = {
        id: 'config-1',
        flagId: 'flag-1',
        environmentId: 'env-1',
        enabled: true,
        defaultValue: 50,
        gates: [],
      };

      const result = evaluateFlag('percentage', config, actor);

      expect(result.value).toBe(50);
    });
  });
});
