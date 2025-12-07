import { describe, it, expect } from 'vitest';
import { validateEnvironment, EnvironmentValidationError } from './environment-validator.js';

describe('validateEnvironment', () => {
  const validEnvironment = {
    key: 'production',
    name: 'Production',
  };

  describe('valid environments', () => {
    it('accepts a valid environment', () => {
      expect(() => validateEnvironment(validEnvironment)).not.toThrow();
    });

    it('accepts environment with hyphenated key', () => {
      expect(() =>
        validateEnvironment({
          key: 'my-staging-env',
          name: 'My Staging Environment',
        })
      ).not.toThrow();
    });

    it('accepts environment with underscored key', () => {
      expect(() =>
        validateEnvironment({
          key: 'dev_local',
          name: 'Local Development',
        })
      ).not.toThrow();
    });

    it('accepts environment with numeric key', () => {
      expect(() =>
        validateEnvironment({
          key: 'env123',
          name: 'Environment 123',
        })
      ).not.toThrow();
    });
  });

  describe('key validation', () => {
    it('throws when key is missing', () => {
      expect(() =>
        validateEnvironment({
          name: 'Production',
        })
      ).toThrow(EnvironmentValidationError);
      expect(() =>
        validateEnvironment({
          name: 'Production',
        })
      ).toThrow('Environment key is required');
    });

    it('throws when key is empty', () => {
      expect(() =>
        validateEnvironment({
          key: '',
          name: 'Production',
        })
      ).toThrow('Environment key is required');
    });

    it('throws when key format is invalid - uppercase', () => {
      expect(() =>
        validateEnvironment({
          key: 'Production',
          name: 'Production',
        })
      ).toThrow('Environment key must start and end with alphanumeric characters');
    });

    it('throws when key format is invalid - starts with hyphen', () => {
      expect(() =>
        validateEnvironment({
          key: '-production',
          name: 'Production',
        })
      ).toThrow('Environment key must start and end with alphanumeric characters');
    });

    it('throws when key format is invalid - ends with hyphen', () => {
      expect(() =>
        validateEnvironment({
          key: 'production-',
          name: 'Production',
        })
      ).toThrow('Environment key must start and end with alphanumeric characters');
    });

    it('throws when key format is invalid - contains spaces', () => {
      expect(() =>
        validateEnvironment({
          key: 'my production',
          name: 'Production',
        })
      ).toThrow('Environment key must start and end with alphanumeric characters');
    });

    it('throws when key is too long', () => {
      const longKey = 'a' + 'b'.repeat(100) + 'c';
      expect(() =>
        validateEnvironment({
          key: longKey,
          name: 'Production',
        })
      ).toThrow('Environment key must be 100 characters or less');
    });

    it('accepts key at max length', () => {
      const maxKey = 'a' + 'b'.repeat(98) + 'c';
      expect(() =>
        validateEnvironment({
          key: maxKey,
          name: 'Production',
        })
      ).not.toThrow();
    });
  });

  describe('name validation', () => {
    it('throws when name is missing', () => {
      expect(() =>
        validateEnvironment({
          key: 'production',
        })
      ).toThrow(EnvironmentValidationError);
      expect(() =>
        validateEnvironment({
          key: 'production',
        })
      ).toThrow('Environment name is required');
    });

    it('throws when name is empty', () => {
      expect(() =>
        validateEnvironment({
          key: 'production',
          name: '',
        })
      ).toThrow('Environment name is required');
    });

    it('throws when name is too long', () => {
      const longName = 'a'.repeat(201);
      expect(() =>
        validateEnvironment({
          key: 'production',
          name: longName,
        })
      ).toThrow('Environment name must be 200 characters or less');
    });

    it('accepts name at max length', () => {
      const maxName = 'a'.repeat(200);
      expect(() =>
        validateEnvironment({
          key: 'production',
          name: maxName,
        })
      ).not.toThrow();
    });

    it('accepts name with special characters', () => {
      expect(() =>
        validateEnvironment({
          key: 'production',
          name: 'Production (US-East) #1',
        })
      ).not.toThrow();
    });
  });

  describe('error type', () => {
    it('throws EnvironmentValidationError', () => {
      try {
        validateEnvironment({});
      } catch (error) {
        expect(error).toBeInstanceOf(EnvironmentValidationError);
        expect((error as EnvironmentValidationError).name).toBe('EnvironmentValidationError');
      }
    });
  });
});
