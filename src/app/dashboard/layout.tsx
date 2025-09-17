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
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChatWidget } from '@/components/chat-widget';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = [
    { href: "/dashboard", icon: <Home />, label: "Symptom Checker" },
    { href: "/dashboard/chatbot", icon: <Bot />, label: "Chatbot" },
    { href: "/dashboard/history", icon: <ClipboardList />, label: "History" },
    { href: "/dashboard/profile", icon: <User />, label: "Profile" },
    { href: "/dashboard/about", icon: <Info />, label: "About" },
  ]

  const handleLogoClick = () => {
    window.location.href = '/dashboard';
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogoClick} aria-label="Reload App">
              <Logo className="size-8 text-primary" />
            </Button>
            <h1 className="text-xl font-semibold">MediMind</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
               <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href}>
                      {item.icon}
                      {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card/80 backdrop-blur-sm px-4 sm:px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger/>
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogoClick} aria-label="Reload App">
                    <Logo className="size-8 text-primary" />
                  </Button>
                  <h1 className="text-xl font-semibold">MediMind</h1>
                </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item, index) => (
                 <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <Link href={item.href} passHref>
                        <Button variant={pathname === item.href ? "secondary" : "ghost"} size="sm">
                        {item.label}
                        </Button>
                    </Link>
                 </motion.div>
              ))}
            </nav>

            <div className="relative ml-auto flex-1 md:grow-0"></div>
            <ThemeToggle />
            <Link href="/dashboard/profile">
                <Avatar>
                    <AvatarImage
                    src="https://picsum.photos/seed/101/128/128"
                    alt="User avatar"
                    data-ai-hint="female portrait"
                    />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </Link>
        </motion.header>
        <main className="flex-1 overflow-auto">{children}</main>
        <ChatWidget />
      </SidebarInset>
    </SidebarProvider>
  );
}
