import { describe, it, expect } from 'vitest';
import { validateFlag, FlagValidationError } from './flag-validator.js';

describe('validateFlag', () => {
  const validFlag = {
    key: 'my-flag',
    name: 'My Flag',
    valueType: 'boolean' as const,
    defaultValue: false,
  };

  describe('valid flags', () => {
    it('accepts a valid boolean flag', () => {
      expect(() => validateFlag(validFlag)).not.toThrow();
    });

    it('accepts a valid string flag', () => {
      expect(() =>
        validateFlag({
          key: 'string-flag',
          name: 'String Flag',
          valueType: 'string',
          defaultValue: 'default',
        })
      ).not.toThrow();
    });

    it('accepts a valid number flag', () => {
      expect(() =>
        validateFlag({
          key: 'number-flag',
          name: 'Number Flag',
          valueType: 'number',
          defaultValue: 100,
        })
      ).not.toThrow();
    });

    it('accepts a valid json flag', () => {
      expect(() =>
        validateFlag({
          key: 'json-flag',
          name: 'JSON Flag',
          valueType: 'json',
          defaultValue: { theme: 'dark' },
        })
      ).not.toThrow();
    });
  });

  describe('key validation', () => {
    it('throws when key is missing', () => {
      expect(() =>
        validateFlag({
          name: 'My Flag',
          valueType: 'boolean',
          defaultValue: false,
        })
      ).toThrow(FlagValidationError);
      expect(() =>
        validateFlag({
          name: 'My Flag',
          valueType: 'boolean',
          defaultValue: false,
        })
      ).toThrow('Flag key is required');
    });

    it('throws when key is empty', () => {
      expect(() =>
        validateFlag({
          key: '',
          name: 'My Flag',
          valueType: 'boolean',
          defaultValue: false,
        })
      ).toThrow('Flag key is required');
    });

    it('throws when key format is invalid', () => {
      expect(() =>
        validateFlag({
          key: 'Invalid-Key',
          name: 'My Flag',
          valueType: 'boolean',
          defaultValue: false,
        })
      ).toThrow('Flag key must start and end with alphanumeric characters');
    });

    it('throws when key is too long', () => {
      const longKey = 'a' + 'b'.repeat(100) + 'c';
      expect(() =>
        validateFlag({
          key: longKey,
          name: 'My Flag',
          valueType: 'boolean',
          defaultValue: false,
        })
      ).toThrow('Flag key must be 100 characters or less');
    });
  });

  describe('name validation', () => {
    it('throws when name is missing', () => {
      expect(() =>
        validateFlag({
          key: 'my-flag',
          valueType: 'boolean',
          defaultValue: false,
        })
      ).toThrow(FlagValidationError);
      expect(() =>
        validateFlag({
          key: 'my-flag',
          valueType: 'boolean',
          defaultValue: false,
        })
      ).toThrow('Flag name is required');
    });

    it('throws when name is empty', () => {
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: '',
          valueType: 'boolean',
          defaultValue: false,
        })
      ).toThrow('Flag name is required');
    });

    it('throws when name is too long', () => {
      const longName = 'a'.repeat(201);
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: longName,
          valueType: 'boolean',
          defaultValue: false,
        })
      ).toThrow('Flag name must be 200 characters or less');
    });

    it('accepts name at max length', () => {
      const maxName = 'a'.repeat(200);
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: maxName,
          valueType: 'boolean',
          defaultValue: false,
        })
      ).not.toThrow();
    });
  });

  describe('valueType validation', () => {
    it('throws when valueType is missing', () => {
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: 'My Flag',
          defaultValue: false,
        })
      ).toThrow(FlagValidationError);
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: 'My Flag',
          defaultValue: false,
        })
      ).toThrow('Flag value type is required');
    });
  });

  describe('defaultValue validation', () => {
    it('throws when defaultValue is undefined', () => {
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: 'My Flag',
          valueType: 'boolean',
        })
      ).toThrow(FlagValidationError);
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: 'My Flag',
          valueType: 'boolean',
        })
      ).toThrow('Flag default value is required');
    });

    it('throws when defaultValue is null', () => {
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: 'My Flag',
          valueType: 'boolean',
          defaultValue: null as any,
        })
      ).toThrow('Flag default value is required');
    });

    it('accepts false as defaultValue', () => {
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: 'My Flag',
          valueType: 'boolean',
          defaultValue: false,
        })
      ).not.toThrow();
    });

    it('accepts 0 as defaultValue', () => {
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: 'My Flag',
          valueType: 'number',
          defaultValue: 0,
        })
      ).not.toThrow();
    });

    it('accepts empty string as defaultValue', () => {
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: 'My Flag',
          valueType: 'string',
          defaultValue: '',
        })
      ).not.toThrow();
    });

    it('accepts empty object as defaultValue', () => {
      expect(() =>
        validateFlag({
          key: 'my-flag',
          name: 'My Flag',
          valueType: 'json',
          defaultValue: {},
        })
      ).not.toThrow();
    });
  });

  describe('error type', () => {
    it('throws FlagValidationError', () => {
      try {
        validateFlag({});
      } catch (error) {
        expect(error).toBeInstanceOf(FlagValidationError);
        expect((error as FlagValidationError).name).toBe('FlagValidationError');
      }
    });
  });
});
