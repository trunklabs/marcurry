import type { Project } from '../types/entities.js';

export class ProjectValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectValidationError';
  }
}

const MAX_PROJECT_NAME_LENGTH = 200;

/**
 * Validates project properties.
 * Throws ProjectValidationError if validation fails.
 */
export function validateProject(project: Partial<Project>): void {
  if (!project.name || project.name.trim().length === 0) {
    throw new ProjectValidationError('Project name is required');
  }

  if (project.name.length > MAX_PROJECT_NAME_LENGTH) {
    throw new ProjectValidationError(`Project name must be ${MAX_PROJECT_NAME_LENGTH} characters or less`);
  }
}
