'use client';

import { Building2, UserPlus } from 'lucide-react';
import { Button } from '@/ui/button';
import Link from 'next/link';
import { OrganizationSwitcher } from '@daveyplate/better-auth-ui';

/**
 * Component displayed when a user is not part of any organization.
 * Provides CTAs to create a new organization or request an invitation.
 */
export function NoOrganization() {
  return (
    <div className="container mx-auto py-8">
      <div className="border-muted-foreground/25 flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
        <Building2 className="text-muted-foreground/50 mb-4 h-12 w-12" />
        <h2 className="mb-2 text-xl font-semibold">No Organization</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          You need to be part of an organization to manage feature flags. Create a new organization or ask an
          administrator to invite you to an existing one.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <OrganizationSwitcher
            trigger={
              <Button>
                <Building2 className="mr-2 h-4 w-4" />
                Create or Join Organization
              </Button>
            }
          />
          <Button variant="outline" asChild>
            <Link href="/account/organizations">
              <UserPlus className="mr-2 h-4 w-4" />
              View Organizations
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground mt-6 text-sm">
          To join an existing organization, ask an administrator to send you an invitation to your email address.
        </p>
      </div>
    </div>
  );
}
