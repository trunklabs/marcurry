import { eq } from 'drizzle-orm';
import { db, apiKeys, type ApiKeyRow } from '@/db';

export type ApiKey = {
  id: string;
  projectId: string;
  name: string;
  keyPrefix: string;
  secretKeyHash: string;
  allowedEnvironmentIds: string[];
  createdAt: Date;
  lastUsedAt: Date | null;
};

export class ApiKeyRepository {
  async findById(id: string): Promise<ApiKey | null> {
    const result = await db.query.apiKeys.findFirst({
      where: eq(apiKeys.id, id),
    });

    return result ? this.toDomain(result) : null;
  }

  async findByProjectId(projectId: string): Promise<ApiKey[]> {
    const results = await db.query.apiKeys.findMany({
      where: eq(apiKeys.projectId, projectId),
      orderBy: (apiKeys, { desc }) => [desc(apiKeys.createdAt)],
    });

    return results.map(this.toDomain);
  }

  async findAll(): Promise<ApiKey[]> {
    const results = await db.query.apiKeys.findMany();
    return results.map(this.toDomain);
  }

  async findByKeyPrefix(keyPrefix: string): Promise<ApiKey | null> {
    const result = await db.query.apiKeys.findFirst({
      where: eq(apiKeys.keyPrefix, keyPrefix),
    });

    return result ? this.toDomain(result) : null;
  }

  async create(data: {
    projectId: string;
    name: string;
    keyPrefix: string;
    secretKeyHash: string;
    allowedEnvironmentIds: string[];
  }): Promise<ApiKey> {
    const [result] = await db
      .insert(apiKeys)
      .values({
        projectId: data.projectId,
        name: data.name,
        keyPrefix: data.keyPrefix,
        secretKeyHash: data.secretKeyHash,
        allowedEnvironmentIds: data.allowedEnvironmentIds,
      })
      .returning();

    return this.toDomain(result);
  }

  async update(
    id: string,
    data: {
      name?: string;
      keyPrefix?: string;
      secretKeyHash?: string;
      allowedEnvironmentIds?: string[];
    }
  ): Promise<ApiKey> {
    const [result] = await db.update(apiKeys).set(data).where(eq(apiKeys.id, id)).returning();

    return this.toDomain(result);
  }

  async updateLastUsedAt(id: string): Promise<void> {
    await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
  }

  private toDomain(row: ApiKeyRow): ApiKey {
    return {
      id: row.id,
      projectId: row.projectId,
      name: row.name,
      keyPrefix: row.keyPrefix,
      secretKeyHash: row.secretKeyHash,
      allowedEnvironmentIds: row.allowedEnvironmentIds as string[],
      createdAt: row.createdAt,
      lastUsedAt: row.lastUsedAt,
    };
  }
}
