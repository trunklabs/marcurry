import { describe, it, expect } from 'vitest';
import { validateProject, ProjectValidationError } from './project-validator.js';

describe('ProjectValidationError', () => {
  it('has correct name property', () => {
    const error = new ProjectValidationError('Test error');
    expect(error.name).toBe('ProjectValidationError');
  });

  it('has correct message property', () => {
    const error = new ProjectValidationError('Something went wrong');
    expect(error.message).toBe('Something went wrong');
  });

  it('is an instance of Error', () => {
    const error = new ProjectValidationError('Test');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('validateProject', () => {
  describe('name validation', () => {
    it('accepts valid project name', () => {
      expect(() => validateProject({ name: 'My Project' })).not.toThrow();
    });

    it('accepts project name with special characters', () => {
      expect(() => validateProject({ name: 'Project #1 - Test (Beta)' })).not.toThrow();
    });

    it('accepts single character name', () => {
      expect(() => validateProject({ name: 'A' })).not.toThrow();
    });

    it('throws when name is missing', () => {
      expect(() => validateProject({})).toThrow(ProjectValidationError);
      expect(() => validateProject({})).toThrow('Project name is required');
    });

    it('throws when name is undefined', () => {
      expect(() => validateProject({ name: undefined as unknown as string })).toThrow('Project name is required');
    });

    it('throws when name is empty string', () => {
      expect(() => validateProject({ name: '' })).toThrow('Project name is required');
    });

    it('throws when name is only whitespace', () => {
      expect(() => validateProject({ name: '   ' })).toThrow('Project name is required');
    });

    it('throws when name exceeds 200 characters', () => {
      const longName = 'a'.repeat(201);
      expect(() => validateProject({ name: longName })).toThrow('Project name must be 200 characters or less');
    });

    it('accepts name at exactly 200 characters', () => {
      const maxName = 'a'.repeat(200);
      expect(() => validateProject({ name: maxName })).not.toThrow();
    });
  });

  describe('error class', () => {
    it('throws ProjectValidationError for invalid input', () => {
      try {
        validateProject({ name: '' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ProjectValidationError);
        expect((error as ProjectValidationError).name).toBe('ProjectValidationError');
      }
    });
  });
});
