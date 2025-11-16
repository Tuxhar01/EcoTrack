
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { AuthPopup } from '@/components/auth/auth-popup';
import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Leaf, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AppFooter } from '@/components/footer';

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isChatbotPage = pathname === '/chatbot';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold font-headline">
              <Leaf className="h-6 w-6 text-primary" />
              EcoTrack
            </Link>
          </div>
          <div className="w-full flex-1 flex justify-end">
            {!isUserLoading && !user && (
              <Button asChild variant="outline" size="sm">
                <Link href="/signup">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Link>
              </Button>
            )}
            {!isUserLoading && user?.isAnonymous && pathname !== '/' && (
              <Button asChild variant="outline" size="sm">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Link>
              </Button>
            )}
          </div>
        </header>
        <div className="flex-1">{children}</div>
        {!isChatbotPage && <AppFooter />}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {isAuthPage ? (
            children
          ) : (
            <InnerLayout>
              {children}
            </InnerLayout>
          )}
          <AuthPopup />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
