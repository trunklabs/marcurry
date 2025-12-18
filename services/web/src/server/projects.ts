'use server';

import { ProjectService } from '@/lib/services/project-service';
import { revalidatePath } from 'next/cache';
import { getSessionContext } from '@/server/auth-context';
import type { Project } from '@marcurry/core';

export async function listProjectsAction(): Promise<Project[]> {
  const ctx = await getSessionContext();
  const projectService = new ProjectService();
  return projectService.listProjectsByOwner(ctx.ownerId, ctx.ownerType);
}

export async function getProjectAction(id: string): Promise<Project> {
  const ctx = await getSessionContext();
  const projectService = new ProjectService();
  return projectService.getProject(id, ctx.ownerId, ctx.ownerType);
}

export async function createProjectAction(data: {
  name: string;
  environments: Array<{ name: string; key: string }>;
}): Promise<Project> {
  const ctx = await getSessionContext();
  const projectService = new ProjectService();
  const project = await projectService.createProject({
    ...data,
    ownerId: ctx.ownerId,
    ownerType: ctx.ownerType,
    createdBy: ctx.userId,
  });
  revalidatePath('/app');
  revalidatePath('/app/projects');
  revalidatePath('/app/flags');
  return project;
}

export async function updateProjectAction(id: string, data: { name: string }): Promise<Project> {
  const ctx = await getSessionContext();
  const projectService = new ProjectService();
  const project = await projectService.updateProject(id, data, ctx.ownerId, ctx.ownerType);
  revalidatePath('/app');
  revalidatePath('/app/projects');
  revalidatePath('/app/flags');
  return project;
}

export async function deleteProjectAction(id: string): Promise<void> {
  const ctx = await getSessionContext();
  const projectService = new ProjectService();
  await projectService.deleteProject(id, ctx.ownerId, ctx.ownerType);
  revalidatePath('/app');
  revalidatePath('/app/projects');
  revalidatePath('/app/flags');
}
