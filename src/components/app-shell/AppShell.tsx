"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck, LogOut } from "lucide-react";


import SidebarNav from "@/components/app-shell/SidebarNav";
import SidebarProfile from "@/components/app-shell/SidebarProfile";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth";
import type { User } from "@/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NotificationDropdown } from "@/components/app-shell/NotificationDropdown";

export default function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const logoutMutation = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      window.location.replace("/auth/login");
    }
  };



  return (
    <div className="flex h-[100dvh] bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex bg-primary/10 border border-primary/20 rounded-lg p-1.5 shadow-sm">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Work<span className="text-primary">Sure</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <SidebarNav user={user} />
        </div>

        <div className="p-4 border-t border-sidebar-border mt-auto space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="size-9 rounded-full bg-primary/10 border border-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">{user.name.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm" onClick={handleLogout} disabled={logoutMutation.status === "pending"}>
            <LogOut className="size-4 mr-3" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden -ml-2" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="size-5 text-foreground" />
            </Button>

          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationDropdown role={user.role} />

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

      {/* Mobile Sidebar without Framer Motion */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside
              className="relative flex w-full max-w-xs flex-col bg-sidebar border-r border-sidebar-border shadow-lg h-full"
            >
              <div className="flex items-center justify-between p-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex bg-primary/10 border border-primary/20 rounded-lg p-1.5 shadow-sm">
                    <ShieldCheck className="size-5 text-primary" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-foreground">
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
                <SidebarNav user={user} onItemClick={() => setMobileMenuOpen(false)} />
              </div>

              <div className="p-4 border-t border-sidebar-border mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.status === "pending"}
                >
                  <LogOut className="size-4 mr-3" /> Logout
                </Button>
              </div>
            </aside>
          </div>
        )}
    </div>
  );
}
