
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
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = [
    { href: "/dashboard", icon: <Home />, label: "Symptom Checker", isActive: pathname === '/dashboard' },
    { href: "/dashboard/chatbot", icon: <Bot />, label: "Chatbot", isActive: pathname === '/dashboard/chatbot' },
    { href: "/dashboard/history", icon: <ClipboardList />, label: "History", isActive: pathname === '/dashboard/history' },
    { href: "/dashboard/about", icon: <Info />, label: "About", isActive: pathname === '/dashboard/about' },
  ]

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
            {navItems.map((item) => (
               <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a>
                      {item.icon}
                      {item.label}
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger/>
                <div className="hidden md:flex items-center gap-2">
                    <Logo className="size-8 text-primary" />
                    <h1 className="text-xl font-semibold">MediMind</h1>
                </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                 <Link href={item.href} key={item.href} passHref>
                    <Button variant={item.isActive ? "secondary" : "ghost"} size="sm">
                      {item.label}
                    </Button>
                 </Link>
              ))}
            </nav>

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
