import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listProjectsAction } from '@/server/projects';
import { CreateFlagForm } from '@/components/create-flag-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/ui/breadcrumb';

export default async function NewFlagPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });

  // If no session, return null and let RedirectToSignIn handle the redirect
  if (!session?.user) {
    return null;
  }

  const projects = await listProjectsAction();
  const params = await searchParams;
  const preselectedProjectId = params.project;

  // If no projects exist, redirect to create project page
  if (projects.length === 0) {
    redirect('/app/projects/new');
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app/flags">Feature Flags</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Flag</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create Flag</h1>
        <p className="text-muted-foreground">Set up a new feature flag</p>
      </div>

      {/* Form */}
      <CreateFlagForm projects={projects} preselectedProjectId={preselectedProjectId} />
    </div>
  );
}
