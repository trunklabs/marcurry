import type { ReactNode } from 'react';
import { Logo } from '@/components/logo';

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="bg-muted flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <Logo asLink={false} />
        </div>
        {children}
      </div>
    </div>
  );
}
