import { NextRequest, NextResponse } from 'next/server';
import { FlagService } from '@/lib/services/flag-service';
import { ApiKeyService } from '@/lib/services/api-key-service';
import type { Actor, EvaluationResult } from '@marcurry/core';

export type EvaluateFlagRequest = {
  environmentKey: string;
  flagKey: string;
  actor: Actor;
};

export type EvaluateFlagResponse = EvaluationResult;

export type EvaluateFlagErrorResponse = {
  error: string;
  code: string;
};

/**
 * POST /api/v1/flags/evaluate
 *
 * Evaluates a feature flag for a given actor.
 *
 * Headers:
 *   X-API-Key: Your API key (required)
 *
 * Request body:
 * {
 *   environmentKey: string;
 *   flagKey: string;
 *   actor: { id: string; attributes?: Record<string, unknown> };
 * }
 *
 * Response:
 * {
 *   flagKey: string;
 *   enabled: boolean;
 *   value: unknown;
 *   reason: string;
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<EvaluateFlagResponse | EvaluateFlagErrorResponse>> {
  try {
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey) {
      return NextResponse.json({ error: 'X-API-Key header is required', code: 'MISSING_API_KEY' }, { status: 401 });
    }

    const body = (await request.json()) as EvaluateFlagRequest;

    if (!body.environmentKey) {
      return NextResponse.json(
        { error: 'environmentKey is required', code: 'MISSING_ENVIRONMENT_KEY' },
        { status: 400 }
      );
    }

    if (!body.flagKey) {
      return NextResponse.json({ error: 'flagKey is required', code: 'MISSING_FLAG_KEY' }, { status: 400 });
    }

    if (!body.actor || !body.actor.id) {
      return NextResponse.json({ error: 'actor with id is required', code: 'MISSING_ACTOR' }, { status: 400 });
    }

    const apiKeyService = new ApiKeyService();
    const { projectId } = await apiKeyService.validateApiKeyForEnvironment(apiKey, body.environmentKey);

    const flagService = new FlagService();
    const result = await flagService.evaluateFlag(projectId, body.environmentKey, body.flagKey, body.actor);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'InvalidApiKeyError') {
        return NextResponse.json({ error: error.message, code: 'INVALID_API_KEY' }, { status: 401 });
      }
      if (error.name === 'EnvironmentNotAllowedError') {
        return NextResponse.json({ error: error.message, code: 'ENVIRONMENT_NOT_ALLOWED' }, { status: 403 });
      }
      if (error.name === 'FlagNotFoundError') {
        return NextResponse.json({ error: error.message, code: 'FLAG_NOT_FOUND' }, { status: 404 });
      }
      if (error.name === 'EnvironmentNotFoundError') {
        return NextResponse.json({ error: error.message, code: 'ENVIRONMENT_NOT_FOUND' }, { status: 404 });
      }
      if (error.name === 'ProjectNotFoundError') {
        return NextResponse.json({ error: error.message, code: 'PROJECT_NOT_FOUND' }, { status: 404 });
      }
      if (error.name === 'FlagEnvironmentConfigNotFoundError') {
        return NextResponse.json({ error: error.message, code: 'FLAG_CONFIG_NOT_FOUND' }, { status: 404 });
      }
    }

    console.error('Flag evaluation error:', error);
    return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
