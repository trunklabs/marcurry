import type { ProjectId, EnvironmentId, FlagId, FlagEnvironmentConfigId } from './identifiers.js';
import type { Gate } from './value-objects.js';

/** Map of flag value types to their TypeScript types. */
export type FlagValueTypeMap = {
  boolean: boolean;
  string: string;
  number: number;
  json: object;
};

/** Supported flag value types. */
export type FlagValueType = keyof FlagValueTypeMap;

/** Container for grouping related flags and environments. */
export type Project = {
  id: ProjectId;
  name: string;
  key: string;
};

/** Represents where your code runs (dev, staging, prod, etc). */
export type Environment = {
  id: EnvironmentId;
  projectId: ProjectId;
  name: string;
  key: string;
};

/**
 * Metadata about a flag.
 *
 * The value type determines the value to be returned when the flag is enabled.
 *
 * For example,
 *
 * - `boolean` returns a boolean value.
 * - `string` returns a string value.
 * - `number` returns a number value.
 * - `json` returns an object value.
 *
 * One flag can only have one value type.
 */
export type Flag<T extends FlagValueType = FlagValueType> = {
  id: FlagId;
  projectId: ProjectId;
  key: string;
  name: string;
  valueType: T;
  defaultValue: FlagValueTypeMap[T];
};

/**
 * Configuration for a flag in a specific environment.
 *
 * The default value determines the value to be returned when no gates match.
 *
 * For example, if a flag has the value type "string", and the default value is "foo",
 * for actors that do not pass any gates, the flag will return the default value "foo".
 *
 * This ensures that non-boolean flags always have a valid return value.
 */
export type FlagEnvironmentConfig<T extends FlagValueType = FlagValueType> = {
  id: FlagEnvironmentConfigId;
  flagId: FlagId;
  environmentId: EnvironmentId;
  enabled: boolean;
  defaultValue: FlagValueTypeMap[T];
  gates: Gate<FlagValueTypeMap[T]>[];
};
