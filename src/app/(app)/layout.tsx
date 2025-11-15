import { AppSidebar } from '@/components/app-sidebar';
import { AppFooter } from '@/components/footer';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <SidebarTrigger className="md:hidden" />
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
