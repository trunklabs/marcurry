import type { Gate } from '../types/value-objects.js';

export class GateValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GateValidationError';
  }
}

const MAX_GATES_PER_CONFIG = 50;
const MAX_ACTOR_IDS_PER_GATE = 10000;

/**
 * Validates a list of gates.
 * Throws GateValidationError if validation fails.
 */
export function validateGates<T>(gates: Gate<T>[]): void {
  if (gates.length > MAX_GATES_PER_CONFIG) {
    throw new GateValidationError(`Maximum of ${MAX_GATES_PER_CONFIG} gates allowed per configuration`);
  }

  const booleanGateIndex = gates.findIndex((gate) => gate.type === 'boolean');

  if (booleanGateIndex !== -1 && booleanGateIndex !== gates.length - 1) {
    throw new GateValidationError(
      'Boolean gates must be positioned last because they match all users and make subsequent gates unreachable'
    );
  }

  for (const gate of gates) {
    if (gate.type !== 'actors') continue;

    if (!gate.actorIds || gate.actorIds.length === 0) {
      throw new GateValidationError('Actors gate must have at least one actor ID');
    }

    if (gate.actorIds.length > MAX_ACTOR_IDS_PER_GATE) {
      throw new GateValidationError(`Actors gate cannot have more than ${MAX_ACTOR_IDS_PER_GATE} actor IDs`);
    }

    const uniqueActorIds = new Set(gate.actorIds);
    if (uniqueActorIds.size !== gate.actorIds.length) {
      throw new GateValidationError('Actors gate contains duplicate actor IDs');
    }
  }
}
