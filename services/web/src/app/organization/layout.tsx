import type { ReactNode } from 'react';
import { RedirectToSignIn } from '@daveyplate/better-auth-ui';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { OrganizationGuard } from '@/components/organization-guard';

export default function OrganizationLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <RedirectToSignIn />
      <OrganizationGuard>
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)',
              '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </OrganizationGuard>
    </>
  );
}
