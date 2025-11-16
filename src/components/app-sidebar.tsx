
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Footprints, LayoutDashboard, MessageSquare, UserCircle, Settings, LifeBuoy, LogOut, Lightbulb, Info, Home, Target, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { href: '/', icon: Home, label: 'Home'},
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/activities', icon: Footprints, label: 'Activities' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/insights', icon: Lightbulb, label: 'Insights' },
  { href: '/chatbot', icon: MessageSquare, label: 'EcoAssist' },
  { href: '/profile', icon: UserCircle, label: 'Profile' },
  { href: '/about', icon: Info, label: 'About' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  }

  const userInitial = user?.displayName?.[0] || user?.email?.[0] || 'G';

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2">
      </SidebarHeader>
      <SidebarContent className="pt-8">
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
                        {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
                        <span className="font-medium">{user?.displayName || (user?.isAnonymous ? 'Guest User' : 'No User')}</span>
                        <span className="text-xs text-muted-foreground">{user?.isAnonymous ? '' : user?.email}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 ml-2" side="top" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user && !user.isAnonymous ? (
                    <>
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
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /><span>Log out</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem asChild>
                           <Link href="/login"><LogIn className="mr-2 h-4 w-4" /><span>Login</span></Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href="/signup"><UserCircle className="mr-2 h-4 w-4" /><span>Sign Up</span></Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
