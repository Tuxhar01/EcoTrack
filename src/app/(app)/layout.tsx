
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { AppFooter } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { Leaf, LogIn } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isUserLoading } = useUser();

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
                    {!isUserLoading && user?.isAnonymous && (
                        <Button asChild variant="outline" size="sm">
                            <Link href="/login">
                                <LogIn className="mr-2 h-4 w-4" />
                                Login / Sign Up
                            </Link>
                        </Button>
                    )}
                </div>
            </header>
            <div className="flex-1">
                {children}
            </div>
            <AppFooter />
        </SidebarInset>
    </SidebarProvider>
  );
}
