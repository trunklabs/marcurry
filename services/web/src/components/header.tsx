import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { NavLinks } from '@/components/nav-links';
import { ModeToggle } from '@/components/mode-toggle';
import { OrganizationSwitcher, UserButton } from '@daveyplate/better-auth-ui';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { paths } from '@/server/paths';

export async function Header({ className }: { className?: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = !!session?.user;

  return (
    <header className={cn('border-b', className)}>
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo path={isLoggedIn ? paths.APP : paths.LANDING} />
            <NavLinks />
          </div>
          <div className="flex items-center gap-2">
            <UserButton
              size="icon"
              additionalLinks={[
                <OrganizationSwitcher key="org-switcher" className="my-2 w-full" />,
                <ModeToggle key="mode-toggle" variant="menu" />,
              ]}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
