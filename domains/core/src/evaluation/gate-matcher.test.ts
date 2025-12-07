import { describe, it, expect } from 'vitest';
import { matchesGate } from './gate-matcher.js';
import type { BooleanGate, ActorsGate, Actor } from '../types/value-objects.js';

describe('matchesGate', () => {
  const actor: Actor = { id: 'user-123' };

  describe('boolean gate', () => {
    it('matches when enabled', () => {
      const gate: BooleanGate<boolean> = {
        id: 'gate-1',
        type: 'boolean',
        enabled: true,
        value: true,
      };

      expect(matchesGate(gate, actor)).toBe(true);
    });

    it('does not match when disabled', () => {
      const gate: BooleanGate<boolean> = {
        id: 'gate-1',
        type: 'boolean',
        enabled: false,
        value: true,
      };

      expect(matchesGate(gate, actor)).toBe(false);
    });

    it('matches any actor when enabled', () => {
      const gate: BooleanGate<string> = {
        id: 'gate-1',
        type: 'boolean',
        enabled: true,
        value: 'variant-a',
      };

      expect(matchesGate(gate, { id: 'user-1' })).toBe(true);
      expect(matchesGate(gate, { id: 'user-2' })).toBe(true);
      expect(matchesGate(gate, { id: 'any-actor' })).toBe(true);
    });
  });

  describe('actors gate', () => {
    it('matches when actor is in the list', () => {
      const gate: ActorsGate<boolean> = {
        id: 'gate-1',
        type: 'actors',
        enabled: true,
        actorIds: ['user-123', 'user-456'],
        value: true,
      };

      expect(matchesGate(gate, { id: 'user-123' })).toBe(true);
    });

    it('does not match when actor is not in the list', () => {
      const gate: ActorsGate<boolean> = {
        id: 'gate-1',
        type: 'actors',
        enabled: true,
        actorIds: ['user-456', 'user-789'],
        value: true,
      };

      expect(matchesGate(gate, { id: 'user-123' })).toBe(false);
    });

    it('does not match when disabled even if actor is in list', () => {
      const gate: ActorsGate<boolean> = {
        id: 'gate-1',
        type: 'actors',
        enabled: false,
        actorIds: ['user-123'],
        value: true,
      };

      expect(matchesGate(gate, { id: 'user-123' })).toBe(false);
    });

    it('matches with various value types', () => {
      const stringGate: ActorsGate<string> = {
        id: 'gate-1',
        type: 'actors',
        enabled: true,
        actorIds: ['user-123'],
        value: 'premium',
      };

      const numberGate: ActorsGate<number> = {
        id: 'gate-2',
        type: 'actors',
        enabled: true,
        actorIds: ['user-123'],
        value: 100,
      };

      expect(matchesGate(stringGate, actor)).toBe(true);
      expect(matchesGate(numberGate, actor)).toBe(true);
    });

    it('handles empty actor list', () => {
      const gate: ActorsGate<boolean> = {
        id: 'gate-1',
        type: 'actors',
        enabled: true,
        actorIds: [],
        value: true,
      };

      expect(matchesGate(gate, actor)).toBe(false);
    });

    it('handles single actor in list', () => {
      const gate: ActorsGate<boolean> = {
        id: 'gate-1',
        type: 'actors',
        enabled: true,
        actorIds: ['user-123'],
        value: true,
      };

      expect(matchesGate(gate, { id: 'user-123' })).toBe(true);
      expect(matchesGate(gate, { id: 'user-other' })).toBe(false);
    });
  });

  describe('actor with attributes', () => {
    it('matches based on id regardless of attributes', () => {
      const gate: ActorsGate<boolean> = {
        id: 'gate-1',
        type: 'actors',
        enabled: true,
        actorIds: ['user-123'],
        value: true,
      };

      const actorWithAttrs: Actor = {
        id: 'user-123',
        attributes: { plan: 'premium', age: 25 },
      };

      expect(matchesGate(gate, actorWithAttrs)).toBe(true);
    });
  });
});
