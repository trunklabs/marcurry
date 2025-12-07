import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { ApiKeyRepository, type ApiKey } from '@/lib/repositories/api-key-repository';
import { ProjectRepository } from '@/lib/repositories/project-repository';
import { EnvironmentRepository } from '@/lib/repositories/environment-repository';
import { ProjectNotFoundError } from '@marcurry/core';

export class ApiKeyNotFoundError extends Error {
  constructor(id: string) {
    super(`API key not found: ${id}`);
    this.name = 'ApiKeyNotFoundError';
  }
}

export class InvalidApiKeyError extends Error {
  constructor() {
    super('Invalid API key');
    this.name = 'InvalidApiKeyError';
  }
}

export class EnvironmentNotAllowedError extends Error {
  constructor(environmentKey: string) {
    super(`API key is not allowed to access environment: ${environmentKey}`);
    this.name = 'EnvironmentNotAllowedError';
  }
}

export type ApiKeyWithSecret = ApiKey & {
  secretKey: string;
};

export type ApiKeyPublic = Omit<ApiKey, 'secretKeyHash'>;

export class ApiKeyService {
  private apiKeyRepo: ApiKeyRepository;
  private projectRepo: ProjectRepository;
  private environmentRepo: EnvironmentRepository;

  constructor() {
    this.apiKeyRepo = new ApiKeyRepository();
    this.projectRepo = new ProjectRepository();
    this.environmentRepo = new EnvironmentRepository();
  }

  /**
   * Generate a secure random API key with prefix for identification
   */
  private generateSecretKey(): string {
    const prefix = 'mc_'; // marcurry prefix
    const randomPart = randomBytes(32).toString('base64url');
    return `${prefix}${randomPart}`;
  }

  /**
   * Generate a secure random API key with prefix for identification
   */
  private hashSecretKey(secretKey: string): string {
    return bcrypt.hashSync(secretKey, 10);
  }

  /**
   * Verify that a secret key matches a stored hash
   */
  private verifySecretKey(secretKey: string, hash: string): boolean {
    return bcrypt.compareSync(secretKey, hash);
  }

  /**
   * Create a new API key. Returns the secret key only once.
   */
  async createApiKey(data: {
    projectId: string;
    name: string;
    allowedEnvironmentIds: string[];
  }): Promise<ApiKeyWithSecret> {
    const project = await this.projectRepo.findById(data.projectId);
    if (!project) {
      throw new ProjectNotFoundError(data.projectId);
    }

    const projectEnvs = await this.environmentRepo.findByProjectId(data.projectId);
    const projectEnvIds = new Set(projectEnvs.map((e) => e.id));
    for (const envId of data.allowedEnvironmentIds) {
      if (!projectEnvIds.has(envId)) {
        throw new Error(`Environment ${envId} does not belong to project ${data.projectId}`);
      }
    }

    const secretKey = this.generateSecretKey();
    const secretKeyHash = this.hashSecretKey(secretKey);

    const apiKey = await this.apiKeyRepo.create({
      projectId: data.projectId,
      name: data.name,
      secretKeyHash,
      allowedEnvironmentIds: data.allowedEnvironmentIds,
    });

    return {
      ...apiKey,
      secretKey,
    };
  }

  /**
   * List all API keys for a project (without secret hashes)
   */
  async listApiKeys(projectId: string): Promise<ApiKeyPublic[]> {
    const apiKeys = await this.apiKeyRepo.findByProjectId(projectId);
    return apiKeys.map(this.toPublic);
  }

  /**
   * Get a single API key by ID (without secret hash)
   */
  async getApiKey(id: string): Promise<ApiKeyPublic> {
    const apiKey = await this.apiKeyRepo.findById(id);
    if (!apiKey) {
      throw new ApiKeyNotFoundError(id);
    }
    return this.toPublic(apiKey);
  }

  /**
   * Update API key name or allowed environments
   */
  async updateApiKey(
    id: string,
    data: {
      name?: string;
      allowedEnvironmentIds?: string[];
    }
  ): Promise<ApiKeyPublic> {
    const existing = await this.apiKeyRepo.findById(id);
    if (!existing) {
      throw new ApiKeyNotFoundError(id);
    }

    if (data.allowedEnvironmentIds) {
      const projectEnvs = await this.environmentRepo.findByProjectId(existing.projectId);
      const projectEnvIds = new Set(projectEnvs.map((e) => e.id));
      for (const envId of data.allowedEnvironmentIds) {
        if (!projectEnvIds.has(envId)) {
          throw new Error(`Environment ${envId} does not belong to project ${existing.projectId}`);
        }
      }
    }

    const updated = await this.apiKeyRepo.update(id, data);
    return this.toPublic(updated);
  }

  /**
   * Rotate an API key - generates new secret, invalidates old one.
   * Returns the new secret key only once.
   */
  async rotateApiKey(id: string): Promise<ApiKeyWithSecret> {
    const existing = await this.apiKeyRepo.findById(id);
    if (!existing) {
      throw new ApiKeyNotFoundError(id);
    }

    const secretKey = this.generateSecretKey();
    const secretKeyHash = this.hashSecretKey(secretKey);

    const updated = await this.apiKeyRepo.update(id, { secretKeyHash });

    return {
      ...updated,
      secretKey,
    };
  }

  /**
   * Delete an API key
   */
  async deleteApiKey(id: string): Promise<void> {
    const existing = await this.apiKeyRepo.findById(id);
    if (!existing) {
      throw new ApiKeyNotFoundError(id);
    }
    await this.apiKeyRepo.delete(id);
  }

  /**
   * Validate an API key and return the associated project ID and allowed environments.
   * Updates last used timestamp.
   */
  async validateApiKey(secretKey: string): Promise<{
    projectId: string;
    allowedEnvironmentIds: string[];
  }> {
    const allKeys = await this.apiKeyRepo.findAll();

    for (const apiKey of allKeys) {
      if (this.verifySecretKey(secretKey, apiKey.secretKeyHash)) {
        this.apiKeyRepo.updateLastUsedAt(apiKey.id).catch(() => {});
        return {
          projectId: apiKey.projectId,
          allowedEnvironmentIds: apiKey.allowedEnvironmentIds,
        };
      }
    }

    throw new InvalidApiKeyError();
  }

  /**
   * Validate that an API key has access to a specific environment.
   */
  async validateApiKeyForEnvironment(secretKey: string, environmentKey: string): Promise<{ projectId: string }> {
    const { projectId, allowedEnvironmentIds } = await this.validateApiKey(secretKey);

    if (allowedEnvironmentIds.length === 0) {
      throw new EnvironmentNotAllowedError(environmentKey);
    }

    const environment = await this.environmentRepo.findByKey(projectId, environmentKey);
    if (!environment) {
      throw new EnvironmentNotAllowedError(environmentKey);
    }

    if (!allowedEnvironmentIds.includes(environment.id)) {
      throw new EnvironmentNotAllowedError(environmentKey);
    }

    return { projectId };
  }

  private toPublic(apiKey: ApiKey): ApiKeyPublic {
    const { secretKeyHash: _, ...publicKey } = apiKey;
    return publicKey;
  }
}
