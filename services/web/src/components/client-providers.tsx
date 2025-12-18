'use client';

import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { authClient } from '@/lib/auth-client';

export function ClientProviders({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
      account
      changeEmail
      organization
      apiKey={{
        prefix: 'app_',
        metadata: { environment: 'local' },
      }}
    >
      {children}
    </AuthUIProvider>
  );
}
