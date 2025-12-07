'use server';

import { ApiKeyService, type ApiKeyPublic, type ApiKeyWithSecret } from '@/lib/services/api-key-service';
import { revalidatePath } from 'next/cache';

export async function listApiKeysAction(projectId: string): Promise<ApiKeyPublic[]> {
  const apiKeyService = new ApiKeyService();
  return apiKeyService.listApiKeys(projectId);
}

export async function getApiKeyAction(id: string): Promise<ApiKeyPublic> {
  const apiKeyService = new ApiKeyService();
  return apiKeyService.getApiKey(id);
}

export async function createApiKeyAction(data: {
  projectId: string;
  name: string;
  allowedEnvironmentIds: string[];
}): Promise<ApiKeyWithSecret> {
  const apiKeyService = new ApiKeyService();
  const apiKey = await apiKeyService.createApiKey(data);
  revalidatePath(`/projects/${data.projectId}`);
  return apiKey;
}

export async function updateApiKeyAction(
  id: string,
  projectId: string,
  data: {
    name?: string;
    allowedEnvironmentIds?: string[];
  }
): Promise<ApiKeyPublic> {
  const apiKeyService = new ApiKeyService();
  const apiKey = await apiKeyService.updateApiKey(id, data);
  revalidatePath(`/projects/${projectId}`);
  return apiKey;
}

export async function rotateApiKeyAction(id: string, projectId: string): Promise<ApiKeyWithSecret> {
  const apiKeyService = new ApiKeyService();
  const apiKey = await apiKeyService.rotateApiKey(id);
  revalidatePath(`/projects/${projectId}`);
  return apiKey;
}

export async function deleteApiKeyAction(id: string, projectId: string): Promise<void> {
  const apiKeyService = new ApiKeyService();
  await apiKeyService.deleteApiKey(id);
  revalidatePath(`/projects/${projectId}`);
}
