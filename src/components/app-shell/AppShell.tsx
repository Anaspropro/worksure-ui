"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut, X, Bell, Search, ShieldCheck } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SidebarNav from "@/components/app-shell/SidebarNav";
import SidebarProfile from "@/components/app-shell/SidebarProfile";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText } from "@/components/ui/input-group";
import { useLogout } from "@/hooks/useAuth";
import type { User } from "@/types";

export default function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () =>
    logoutMutation.mutate(undefined, {
      onSettled: () => router.replace("/auth/login"),
    });

  // Basic title mapping from pathname
  const segments = pathname.split('/').filter(Boolean);
  const title = segments.length > 0 ? segments[0] : "Dashboard";

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex bg-primary rounded-lg p-1.5 shadow-sm">
              <ShieldCheck className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-sidebar-foreground">
              Work<span className="text-primary">Sure</span>
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-2">
           <SidebarNav role={user.role} />
        </div>
        
        <div className="p-4 border-t border-sidebar-border mt-auto space-y-3">
           <div className="flex items-center gap-3 px-1">
             <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
               <span className="text-sm font-bold text-primary">{user.name.charAt(0)}</span>
             </div>
             <div className="min-w-0 flex-1">
               <p className="truncate text-sm font-semibold text-sidebar-foreground">{user.name}</p>
               <p className="truncate text-[11px] text-sidebar-foreground/50 capitalize">{user.role.toLowerCase()}</p>
             </div>
           </div>
           <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent text-sm" onClick={handleLogout} disabled={logoutMutation.status === "pending"}>
              <LogOut className="size-4 mr-3" /> Logout
           </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
         <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-glass-bg backdrop-blur-xl px-4 sm:px-6">
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="lg:hidden -ml-2" onClick={() => setMobileMenuOpen(true)}>
                  <Menu className="size-5 text-foreground" />
               </Button>
               <div>
                  <h1 className="text-xl font-bold capitalize text-foreground hidden sm:block">{title}</h1>
                  {title === "dashboard" && <p className="text-xs text-muted-foreground hidden sm:block">Welcome back, {user.name.split(' ')[0]} 👋</p>}
               </div>
            </div>
            
            <div className="flex items-center gap-5">
               <div className="hidden md:block w-64 lg:w-80">
                 <InputGroup className="h-9 rounded-full border-border bg-muted/50 overflow-hidden">
                    <InputGroupAddon className="bg-transparent border-none">
                      <InputGroupText className="bg-transparent border-none">
                         <Search className="size-4 text-muted-foreground ml-2" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Search..." className="text-sm bg-transparent border-none focus-visible:ring-0 shadow-none border-0" />
                 </InputGroup>
               </div>
               
               <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
                  <Bell className="size-5" />
                  <span className="absolute top-1.5 right-2 size-2 bg-destructive rounded-full border-2 border-card"></span>
               </Button>
               
               <div className="pl-2 border-l border-border h-8 flex items-center">
                  <SidebarProfile user={user} />
               </div>
            </div>
         </header>
         
         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
               {children}
            </div>
         </main>
      </div>

      {/* Mobile Sidebar with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.aside
              className="relative flex w-full max-w-xs flex-col bg-sidebar border-r border-sidebar-border shadow-2xl h-full"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex bg-primary rounded-lg p-1.5 shadow-sm">
                    <ShieldCheck className="size-5 text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-sidebar-foreground">
                    Work<span className="text-primary">Sure</span>
                  </span>
                </Link>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-sidebar-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <SidebarNav role={user.role} />
              </div>

              <div className="p-4 border-t border-sidebar-border mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4 mr-3" /> Logout
                </Button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
