import type { ProjectId, EnvironmentId, GateId } from './identifiers.js';
import type { Actor } from './value-objects.js';
import type { GateType } from './value-objects.js';

/** Information needed to evaluate a flag for an actor. */
export type EvaluationContext = {
  projectId: ProjectId;
  environmentId: EnvironmentId;
  actor: Actor;
};

/** The result of evaluating a flag for an actor. */
export type EvaluationResult<T = boolean | string | number | object> = {
  flagKey: string;
  value: T;
  enabled: boolean;
  reason: string;
  matchedGate?: {
    id: GateId;
    type: GateType;
  };
};
