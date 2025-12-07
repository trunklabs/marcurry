export class FlagNotFoundError extends Error {
  constructor(public readonly flagKey: string) {
    super(`Flag not found: ${flagKey}`);
    this.name = 'FlagNotFoundError';
  }
}

export class EnvironmentNotFoundError extends Error {
  constructor(public readonly environmentKey: string) {
    super(`Environment not found: ${environmentKey}`);
    this.name = 'EnvironmentNotFoundError';
  }
}

export class ProjectNotFoundError extends Error {
  constructor(public readonly projectId: string) {
    super(`Project not found: ${projectId}`);
    this.name = 'ProjectNotFoundError';
  }
}

export class FlagEnvironmentConfigNotFoundError extends Error {
  constructor(
    public readonly flagKey: string,
    public readonly environmentKey: string
  ) {
    super(`Flag configuration not found for flag '${flagKey}' in environment '${environmentKey}'`);
    this.name = 'FlagEnvironmentConfigNotFoundError';
  }
}

export class ProjectMustHaveEnvironmentError extends Error {
  constructor() {
    super('Project must have at least one environment');
    this.name = 'ProjectMustHaveEnvironmentError';
  }
}

export class CannotDeleteLastEnvironmentError extends Error {
  constructor(public readonly projectId: string) {
    super(`Cannot delete the last environment in project ${projectId}`);
    this.name = 'CannotDeleteLastEnvironmentError';
  }
}
