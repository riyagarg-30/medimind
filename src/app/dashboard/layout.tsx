
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bot,
  ClipboardList,
  Home,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <Logo className="size-8 text-primary" />
            <h1 className="text-xl font-semibold">MediMind</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                  <Home />
                  Symptom Checker
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/dashboard/chatbot" passHref>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/chatbot'}>
                        <Bot />
                        Chatbot
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/dashboard/history" passHref>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/history'}>
                        <ClipboardList />
                        History
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/dashboard/about" passHref>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/about'}>
                        <Info />
                        About
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="relative ml-auto flex-1 md:grow-0"></div>
            <Avatar>
                <AvatarImage
                src="https://picsum.photos/seed/101/128/128"
                alt="User avatar"
                data-ai-hint="female portrait"
                />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
