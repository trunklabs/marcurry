'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export type OwnerContext = {
  userId: string;
  organizationId: string | null;
  ownerId: string;
  ownerType: 'organization' | 'user';
};

/**
 * Get the current session and owner context (organization or personal account).
 * Throws if user is not authenticated.
 *
 * Returns organization context if user has an active organization,
 * otherwise returns personal account context.
 */
export async function getSessionContext(): Promise<OwnerContext> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error('Unauthorized: User not authenticated');
  }

  const organizations = await auth.api.listOrganizations({ headers: await headers() });
  const activeOrgId = session.session?.activeOrganizationId;

  // If user has an active organization, use it as the owner context
  if (activeOrgId && organizations.some((org) => org.id === activeOrgId)) {
    return {
      userId: session.user.id,
      organizationId: activeOrgId,
      ownerId: activeOrgId,
      ownerType: 'organization',
    };
  }

  // Otherwise, use personal account as the owner context
  return {
    userId: session.user.id,
    organizationId: null,
    ownerId: session.user.id,
    ownerType: 'user',
  };
}
