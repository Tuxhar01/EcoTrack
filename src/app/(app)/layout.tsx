import { AppSidebar } from '@/components/app-sidebar';
import { AppFooter } from '@/components/footer';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col min-h-screen">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
                <SidebarTrigger />
                 <div className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-primary" />
                    <Link href="/" className="text-lg font-bold font-headline">
                        EcoTrack
                    </Link>
                </div>
                <div className="w-full flex-1">
                    {/* Add content here if needed, like a search bar */}
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
