import type { Actor } from '../types/value-objects.js';
import type { FlagEnvironmentConfig, FlagValueType, FlagValueTypeMap } from '../types/entities.js';
import type { EvaluationResult } from '../types/evaluation.js';
import { matchesGate } from './gate-matcher.js';

/**
 * Evaluates a flag for a given actor.
 * Returns the value from the first matching gate, or the default value if no gates match.
 */
export function evaluateFlag<T extends FlagValueType>(
  flagKey: string,
  config: FlagEnvironmentConfig<T>,
  actor: Actor
): EvaluationResult<FlagValueTypeMap[T]> {
  if (!config.enabled) {
    return {
      flagKey,
      value: config.defaultValue,
      enabled: false,
      reason: 'flag disabled',
    };
  }

  for (const gate of config.gates) {
    if (matchesGate(gate, actor)) {
      return {
        flagKey,
        value: gate.value,
        enabled: true,
        reason: 'gate matched',
        matchedGate: {
          id: gate.id,
          type: gate.type,
        },
      };
    }
  }

  return {
    flagKey,
    value: config.defaultValue,
    enabled: true,
    reason: 'default value',
  };
}
