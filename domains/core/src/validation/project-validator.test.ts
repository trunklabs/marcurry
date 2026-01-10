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
  describe('key validation', () => {
    it('accepts valid key with lowercase letters', () => {
      expect(() => validateProject({ key: 'my-project', name: 'My Project' })).not.toThrow();
    });

    it('accepts key with numbers', () => {
      expect(() => validateProject({ key: 'project-123', name: 'Project 123' })).not.toThrow();
    });

    it('accepts key with underscores', () => {
      expect(() => validateProject({ key: 'my_project', name: 'My Project' })).not.toThrow();
    });

    it('accepts key with mixed hyphens and underscores', () => {
      expect(() => validateProject({ key: 'my-project_v2', name: 'My Project' })).not.toThrow();
    });

    it('accepts two character key', () => {
      expect(() => validateProject({ key: 'ab', name: 'AB' })).not.toThrow();
    });

    it('throws when key is missing', () => {
      expect(() => validateProject({ name: 'My Project' })).toThrow(ProjectValidationError);
      expect(() => validateProject({ name: 'My Project' })).toThrow('Project key is required');
    });

    it('throws when key is empty string', () => {
      expect(() => validateProject({ key: '', name: 'My Project' })).toThrow('Project key is required');
    });

    it('throws when key contains uppercase letters', () => {
      expect(() => validateProject({ key: 'My-Project', name: 'My Project' })).toThrow(ProjectValidationError);
    });

    it('throws when key contains spaces', () => {
      expect(() => validateProject({ key: 'my project', name: 'My Project' })).toThrow(ProjectValidationError);
    });

    it('throws when key starts with hyphen', () => {
      expect(() => validateProject({ key: '-my-project', name: 'My Project' })).toThrow(ProjectValidationError);
    });

    it('throws when key ends with hyphen', () => {
      expect(() => validateProject({ key: 'my-project-', name: 'My Project' })).toThrow(ProjectValidationError);
    });

    it('throws when key contains special characters', () => {
      expect(() => validateProject({ key: 'my@project', name: 'My Project' })).toThrow(ProjectValidationError);
    });

    it('throws when key exceeds 100 characters', () => {
      const longKey = 'a'.repeat(101);
      expect(() => validateProject({ key: longKey, name: 'My Project' })).toThrow(
        'Project key must be 100 characters or less'
      );
    });

    it('accepts key at exactly 100 characters', () => {
      const maxKey = 'a'.repeat(100);
      expect(() => validateProject({ key: maxKey, name: 'My Project' })).not.toThrow();
    });
  });

  describe('name validation', () => {
    it('accepts valid project name', () => {
      expect(() => validateProject({ key: 'my-project', name: 'My Project' })).not.toThrow();
    });

    it('accepts project name with special characters', () => {
      expect(() => validateProject({ key: 'project-1', name: 'Project #1 - Test (Beta)' })).not.toThrow();
    });

    it('accepts single character name', () => {
      expect(() => validateProject({ key: 'aa', name: 'A' })).not.toThrow();
    });

    it('throws when name is missing', () => {
      expect(() => validateProject({ key: 'my-project' })).toThrow(ProjectValidationError);
      expect(() => validateProject({ key: 'my-project' })).toThrow('Project name is required');
    });

    it('throws when name is undefined', () => {
      expect(() => validateProject({ key: 'my-project', name: undefined as unknown as string })).toThrow(
        'Project name is required'
      );
    });

    it('throws when name is empty string', () => {
      expect(() => validateProject({ key: 'my-project', name: '' })).toThrow('Project name is required');
    });

    it('throws when name is only whitespace', () => {
      expect(() => validateProject({ key: 'my-project', name: '   ' })).toThrow('Project name is required');
    });

    it('throws when name exceeds 200 characters', () => {
      const longName = 'a'.repeat(201);
      expect(() => validateProject({ key: 'my-project', name: longName })).toThrow(
        'Project name must be 200 characters or less'
      );
    });

    it('accepts name at exactly 200 characters', () => {
      const maxName = 'a'.repeat(200);
      expect(() => validateProject({ key: 'my-project', name: maxName })).not.toThrow();
    });
  });

  describe('error class', () => {
    it('throws ProjectValidationError for invalid key', () => {
      try {
        validateProject({ key: 'INVALID', name: 'Test' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ProjectValidationError);
        expect((error as ProjectValidationError).name).toBe('ProjectValidationError');
      }
    });

    it('throws ProjectValidationError for invalid name', () => {
      try {
        validateProject({ key: 'valid-key', name: '' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ProjectValidationError);
        expect((error as ProjectValidationError).name).toBe('ProjectValidationError');
      }
    });
  });
});
