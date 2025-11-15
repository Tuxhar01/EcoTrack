import { AppSidebar } from '@/components/app-sidebar';
import { AppFooter } from '@/components/footer';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
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
            <div className="flex-1">
                {children}
            </div>
            <AppFooter />
        </SidebarInset>
    </SidebarProvider>
  );
}
