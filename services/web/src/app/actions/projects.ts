'use server';

import { ProjectService } from '@/lib/services/project-service';
import { revalidatePath } from 'next/cache';
import type { Project } from '@marcurry/core';

export async function listProjectsAction(): Promise<Project[]> {
  const projectService = new ProjectService();
  return projectService.listProjects();
}

export async function getProjectAction(id: string): Promise<Project> {
  const projectService = new ProjectService();
  return projectService.getProject(id);
}

export async function createProjectAction(data: {
  name: string;
  environments: Array<{ name: string; key: string }>;
}): Promise<Project> {
  const projectService = new ProjectService();
  const project = await projectService.createProject(data);
  revalidatePath('/projects');
  return project;
}

export async function updateProjectAction(id: string, data: { name: string }): Promise<Project> {
  const projectService = new ProjectService();
  const project = await projectService.updateProject(id, data);
  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);
  return project;
}

export async function deleteProjectAction(id: string): Promise<void> {
  const projectService = new ProjectService();
  await projectService.deleteProject(id);
  revalidatePath('/projects');
}
