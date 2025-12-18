import { describe, it, expect } from 'vitest';
import { validateGates, GateValidationError } from './gate-validator.js';
import type { Gate, BooleanGate, ActorsGate } from '../types/value-objects.js';

describe('validateGates', () => {
  describe('valid gates', () => {
    it('accepts empty gates array', () => {
      expect(() => validateGates([])).not.toThrow();
    });

    it('accepts single boolean gate', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'boolean',
          enabled: true,
          value: true,
        },
      ];
      expect(() => validateGates(gates)).not.toThrow();
    });

    it('accepts single actors gate', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1'],
          value: true,
        },
      ];
      expect(() => validateGates(gates)).not.toThrow();
    });

    it('accepts multiple actors gates', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1'],
          value: 'variant-a',
        },
        {
          id: 'gate-2',
          type: 'actors',
          enabled: true,
          actorIds: ['user-2'],
          value: 'variant-b',
        },
      ];
      expect(() => validateGates(gates)).not.toThrow();
    });

    it('accepts actors gates followed by boolean gate (last)', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1'],
          value: true,
        },
        {
          id: 'gate-2',
          type: 'boolean',
          enabled: true,
          value: false,
        },
      ];
      expect(() => validateGates(gates)).not.toThrow();
    });
  });

  describe('max gates limit', () => {
    it('accepts 50 gates', () => {
      const gates: Gate[] = Array.from({ length: 50 }, (_, i) => ({
        id: `gate-${i}`,
        type: 'actors' as const,
        enabled: true,
        actorIds: [`user-${i}`],
        value: true,
      }));
      expect(() => validateGates(gates)).not.toThrow();
    });

    it('throws when exceeding 50 gates', () => {
      const gates: Gate[] = Array.from({ length: 51 }, (_, i) => ({
        id: `gate-${i}`,
        type: 'actors' as const,
        enabled: true,
        actorIds: [`user-${i}`],
        value: true,
      }));
      expect(() => validateGates(gates)).toThrow(GateValidationError);
      expect(() => validateGates(gates)).toThrow('Maximum of 50 gates allowed per configuration');
    });
  });

  describe('boolean gate position', () => {
    it('throws when boolean gate is first with other gates after', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'boolean',
          enabled: true,
          value: true,
        },
        {
          id: 'gate-2',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1'],
          value: false,
        },
      ];
      expect(() => validateGates(gates)).toThrow(GateValidationError);
      expect(() => validateGates(gates)).toThrow(
        'Boolean gates must be positioned last because they match all users and make subsequent gates unreachable'
      );
    });

    it('throws when boolean gate is in the middle', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1'],
          value: 'a',
        },
        {
          id: 'gate-2',
          type: 'boolean',
          enabled: true,
          value: 'b',
        },
        {
          id: 'gate-3',
          type: 'actors',
          enabled: true,
          actorIds: ['user-2'],
          value: 'c',
        },
      ];
      expect(() => validateGates(gates)).toThrow(
        'Boolean gates must be positioned last because they match all users and make subsequent gates unreachable'
      );
    });

    it('accepts boolean gate as the only gate', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'boolean',
          enabled: true,
          value: true,
        },
      ];
      expect(() => validateGates(gates)).not.toThrow();
    });

    it('accepts boolean gate as the last gate', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1'],
          value: 'first',
        },
        {
          id: 'gate-2',
          type: 'actors',
          enabled: true,
          actorIds: ['user-2'],
          value: 'second',
        },
        {
          id: 'gate-3',
          type: 'boolean',
          enabled: true,
          value: 'default',
        },
      ];
      expect(() => validateGates(gates)).not.toThrow();
    });
  });

  describe('actors gate validation', () => {
    it('throws when actors gate has no actorIds', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: [],
          value: true,
        },
      ];
      expect(() => validateGates(gates)).toThrow(GateValidationError);
      expect(() => validateGates(gates)).toThrow('Actors gate must have at least one actor ID');
    });

    it('throws when actors gate has undefined actorIds', () => {
      const gates = [
        {
          id: 'gate-1',
          type: 'actors' as const,
          enabled: true,
          value: true,
        },
      ] as Gate[];
      expect(() => validateGates(gates)).toThrow('Actors gate must have at least one actor ID');
    });

    it('accepts actors gate with single actorId', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1'],
          value: true,
        },
      ];
      expect(() => validateGates(gates)).not.toThrow();
    });

    it('accepts actors gate with 10000 actorIds', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: Array.from({ length: 10000 }, (_, i) => `user-${i}`),
          value: true,
        },
      ];
      expect(() => validateGates(gates)).not.toThrow();
    });

    it('throws when actors gate exceeds 10000 actorIds', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: Array.from({ length: 10001 }, (_, i) => `user-${i}`),
          value: true,
        },
      ];
      expect(() => validateGates(gates)).toThrow(GateValidationError);
      expect(() => validateGates(gates)).toThrow('Actors gate cannot have more than 10000 actor IDs');
    });

    it('throws when actors gate has duplicate actorIds', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1', 'user-2', 'user-1'],
          value: true,
        },
      ];
      expect(() => validateGates(gates)).toThrow(GateValidationError);
      expect(() => validateGates(gates)).toThrow('Actors gate contains duplicate actor IDs');
    });

    it('accepts actors gate with unique actorIds', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1', 'user-2', 'user-3'],
          value: true,
        },
      ];
      expect(() => validateGates(gates)).not.toThrow();
    });
  });

  describe('multiple validation errors', () => {
    it('validates all actors gates', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: ['user-1'],
          value: 'valid',
        },
        {
          id: 'gate-2',
          type: 'actors',
          enabled: true,
          actorIds: ['user-2', 'user-2'],
          value: 'duplicate',
        },
      ];
      expect(() => validateGates(gates)).toThrow('Actors gate contains duplicate actor IDs');
    });
  });

  describe('error type', () => {
    it('throws GateValidationError', () => {
      const gates: Gate[] = [
        {
          id: 'gate-1',
          type: 'actors',
          enabled: true,
          actorIds: [],
          value: true,
        },
      ];
      try {
        validateGates(gates);
      } catch (error) {
        expect(error).toBeInstanceOf(GateValidationError);
        expect((error as GateValidationError).name).toBe('GateValidationError');
      }
    });
  });
});
