import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function tryCatch<T, E = Error>(promise: T | Promise<T>) {
  try {
    const data = await promise;
    return [null, data] as const;
  } catch (error) {
    return [error as E, null] as const;
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Parses database and validation errors into user-friendly messages.
 */
export function parseErrorMessage(error: unknown, fallbackMessage: string): string {
  if (!error) return fallbackMessage;

  if (error instanceof Error) {
    const message = error.message;

    if (message.includes('Failed query:') || message.includes('SQL') || message.includes('params:')) {
      if (message.includes('flags')) {
        return 'A flag with this key already exists in this project';
      }
      if (message.includes('environments')) {
        return 'An environment with this key already exists in this project';
      }
      if (message.includes('projects') || message.includes('project_owners')) {
        return 'A project with this key already exists';
      }
      return 'This record already exists';
    }

    if (message.includes('duplicate key') || message.includes('unique constraint') || message.includes('violates')) {
      if (message.includes('flags_project_key_unique') || message.includes('"flags"')) {
        return 'A flag with this key already exists in this project';
      }
      if (message.includes('environments_project_key_unique') || message.includes('"environments"')) {
        return 'An environment with this key already exists in this project';
      }
      if (
        message.includes('project_owners_org_key_uidx') ||
        message.includes('project_owners_user_key_uidx') ||
        message.includes('"projects"')
      ) {
        return 'A project with this key already exists';
      }
      return 'This record already exists';
    }

    if (
      message.includes('FlagValidationError') ||
      message.includes('ProjectValidationError') ||
      message.includes('EnvironmentValidationError')
    ) {
      return message.replace(/^(Flag|Project|Environment)ValidationError:\s*/, '');
    }

    if (
      message.includes('query') ||
      message.includes('Query') ||
      message.includes('database') ||
      message.includes('Database')
    ) {
      return fallbackMessage;
    }

    return message;
  }

  return fallbackMessage;
}
