import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/ui/toast';
import { Toaster } from '@/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { ClientProviders } from '@/components/client-providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Marcurry - Feature Flag Management',
  description: 'Feature Flag Management Solution',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.className} flex w-full content-center items-center justify-center antialiased`}
      >
        <ToastProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ClientProviders>{children}</ClientProviders>
            <Toaster />
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
