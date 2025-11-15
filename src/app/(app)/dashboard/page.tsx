import { AppSidebar } from '@/components/app-sidebar';
import { AppFooter } from '@/components/footer';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { EmissionsChart } from '@/components/dashboard/emissions-chart';
import { GamificationPanel } from '@/components/dashboard/gamification-panel';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { mockUserProfile } from '@/lib/data';

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
         <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1" />
          </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold font-headline md:text-3xl">
              Welcome back, {mockUserProfile.name.split(' ')[0]}!
            </h1>
          </div>
          <StatsCards />
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <EmissionsChart />
            </div>
            <GamificationPanel />
          </div>
        </main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
