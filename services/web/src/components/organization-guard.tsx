import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { OrganizationPrompt } from '@/components/organization-prompt';

/**
 * Server component that checks if user is part of an organization.
 * If not, displays a prompt to create or join one.
 */
export async function OrganizationGuard({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return null;
  }

  const organizations = await auth.api.listOrganizations({ headers: await headers() });
  const hasOrganization = organizations && organizations.length > 0;

  if (!hasOrganization) {
    return <OrganizationPrompt />;
  }

  return <>{children}</>;
}
