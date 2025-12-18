import { NextRequest, NextResponse } from 'next/server';
import { FlagService } from '@/lib/services/flag-service';
import { auth } from '@/lib/auth';
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
 * API Key metadata structure for flag evaluation.
 * When creating API keys for SDK access, include this metadata:
 * - organizationId: The organization the key belongs to
 * - projectId: The project the key can access
 * - allowedEnvironments: Array of environment keys the key can access (optional, empty = all)
 */
type ApiKeyMetadata = {
  organizationId?: string;
  projectId?: string;
  allowedEnvironments?: string[];
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

    // Verify API key using better-auth
    const verifyResult = await auth.api.verifyApiKey({
      body: { key: apiKey },
    });

    if (!verifyResult.valid || !verifyResult.key) {
      return NextResponse.json(
        { error: verifyResult.error?.message || 'Invalid API key', code: 'INVALID_API_KEY' },
        { status: 401 }
      );
    }

    // Get metadata for projectId and allowed environments
    // better-auth stores metadata as an object, not a JSON string
    const metadata: ApiKeyMetadata = (verifyResult.key.metadata as ApiKeyMetadata) || {};

    if (!metadata.projectId) {
      return NextResponse.json(
        { error: 'API key is not configured for project access', code: 'INVALID_API_KEY_CONFIG' },
        { status: 403 }
      );
    }

    // Check if environment is allowed (if restrictions are set)
    if (metadata.allowedEnvironments && metadata.allowedEnvironments.length > 0) {
      if (!metadata.allowedEnvironments.includes(body.environmentKey)) {
        return NextResponse.json(
          {
            error: `API key is not allowed to access environment: ${body.environmentKey}`,
            code: 'ENVIRONMENT_NOT_ALLOWED',
          },
          { status: 403 }
        );
      }
    }

    const flagService = new FlagService();
    const result = await flagService.evaluateFlag(metadata.projectId, body.environmentKey, body.flagKey, body.actor);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
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
