'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUserProfile } from '@/lib/data';
import { Button } from './ui/button';
import { Footprints, LayoutDashboard, Leaf, MessageSquare, UserCircle, Settings, LifeBuoy, LogOut, Lightbulb, Info, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const navItems = [
  { href: '/', icon: Home, label: 'Home'},
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/activities', icon: Footprints, label: 'Activities' },
  { href: '/insights', icon: Lightbulb, label: 'Insights' },
  { href: '/chatbot', icon: MessageSquare, label: 'AI Coach' },
  { href: '/profile', icon: UserCircle, label: 'Profile' },
  { href: '/about', icon: Info, label: 'About' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
             <Leaf className="h-6 w-6 text-primary" />
          </Button>
          <span className="text-lg font-semibold font-headline group-data-[collapsible=icon]:hidden">
            EcoTrack
          </span>
        </div>
        <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <div className="flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.name} />
                        <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
                        <span className="font-medium">{mockUserProfile.name}</span>
                        <span className="text-xs text-muted-foreground">{mockUserProfile.email}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 ml-2" side="top" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" /><span>Profile</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/"><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
