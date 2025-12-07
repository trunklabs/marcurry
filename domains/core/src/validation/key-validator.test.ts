import { describe, it, expect } from 'vitest';
import { KEY_REGEX, MAX_KEY_LENGTH, validateKey } from './key-validator.js';

class TestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestError';
  }
}

describe('KEY_REGEX', () => {
  it('should match valid keys', () => {
    expect(KEY_REGEX.test('my-key')).toBe(true);
    expect(KEY_REGEX.test('my_key')).toBe(true);
    expect(KEY_REGEX.test('my-key-123')).toBe(true);
    expect(KEY_REGEX.test('a1')).toBe(true);
    expect(KEY_REGEX.test('production')).toBe(true);
  });

  it('should reject invalid keys', () => {
    expect(KEY_REGEX.test('')).toBe(false);
    expect(KEY_REGEX.test('a')).toBe(false);
    expect(KEY_REGEX.test('-key')).toBe(false);
    expect(KEY_REGEX.test('key-')).toBe(false);
    expect(KEY_REGEX.test('_key')).toBe(false);
    expect(KEY_REGEX.test('key_')).toBe(false);
    expect(KEY_REGEX.test('My-Key')).toBe(false);
    expect(KEY_REGEX.test('my key')).toBe(false);
  });
});

describe('MAX_KEY_LENGTH', () => {
  it('should be 100', () => {
    expect(MAX_KEY_LENGTH).toBe(100);
  });
});

describe('validateKey', () => {
  it('should accept valid keys', () => {
    expect(() => validateKey('valid-key', 'Test', TestError)).not.toThrow();
    expect(() => validateKey('my_key_123', 'Test', TestError)).not.toThrow();
  });

  it('should throw when key is missing', () => {
    expect(() => validateKey(undefined, 'Test', TestError)).toThrow('Test key is required');
    expect(() => validateKey('', 'Test', TestError)).toThrow('Test key is required');
  });

  it('should throw when key is too long', () => {
    const longKey = 'a' + 'b'.repeat(100) + 'c';
    expect(() => validateKey(longKey, 'Test', TestError)).toThrow('Test key must be 100 characters or less');
  });

  it('should throw when key format is invalid', () => {
    expect(() => validateKey('-invalid', 'Test', TestError)).toThrow(
      'Test key must start and end with alphanumeric characters'
    );
  });

  it('should use the provided error class', () => {
    try {
      validateKey(undefined, 'Test', TestError);
    } catch (error) {
      expect(error).toBeInstanceOf(TestError);
      expect((error as TestError).name).toBe('TestError');
    }
  });
});
