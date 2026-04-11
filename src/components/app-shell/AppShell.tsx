"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import SidebarNav from "@/components/app-shell/SidebarNav";
import SidebarProfile from "@/components/app-shell/SidebarProfile";
import { Button } from "@/components/ui/button";
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
  const logoutMutation = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () =>
    logoutMutation.mutate(undefined, {
      onSettled: () => router.replace("/auth/login"),
    });

  return (
    <div className="">
      <header className="sticky top-0 z-50 mx-auto w-full max-w-370 px-4 py-4 lg:px-6">
        <div className="">
          <div className="hidden items-center justify-between gap-6 rounded-[28px] border border-emerald-200/70 bg-white/90 px-5 py-4 shadow-[0_18px_48px_-34px_rgba(16,185,129,0.32)] lg:flex">
            <div className="">
              <Image
                src="/worksure-logo.png"
                alt="WorkSure Logo"
                width={36}
                height={36}
                className="h-9 w-9 rounded-2xl object-cover"
              />
            </div>

            <div className="min-w-0">
              <SidebarNav role={user.role} desktop />
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {/* <div className="rounded-full border border-emerald-100 bg-emerald-50/70 px-4 py-2">
                <SidebarProfile user={user} />
              </div> */}
              <Button
                variant="outline"
                className="rounded-full border-emerald-200 bg-white text-foreground hover:bg-emerald-50"
                onClick={handleLogout}
                disabled={logoutMutation.status === "pending"}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[24px] border border-emerald-200/70 bg-white/88 px-4 py-3 shadow-[0_18px_40px_-30px_rgba(16,185,129,0.28)] backdrop-blur lg:hidden">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
              <Image
                src="/worksure-logo.png"
                alt="WorkSure Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-2xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  WorkSure
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={handleLogout}
              disabled={logoutMutation.status === "pending"}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-370 px-4 py-4 lg:px-6">
        <main className="min-h-screen min-w-0 py-2">{children}</main>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-60 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="absolute left-0 top-0 flex h-full w-[86%] max-w-80 flex-col border-r border-sidebar-border bg-[linear-gradient(180deg,#0f172a_0%,#122033_100%)] px-5 py-5 text-white shadow-[0_28px_110px_-60px_rgba(15,23,42,0.88)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/worksure-logo.png"
                  alt="WorkSure Logo"
                  width={34}
                  height={34}
                  className="h-8 w-8 rounded-2xl object-cover"
                />
                <p className="text-lg font-heading tracking-tight">WorkSure</p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/10 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto">
              <SidebarNav role={user.role} />
            </div>

            <div className="space-y-4 border-t border-white/10 pt-4">
              <SidebarProfile user={user} />
              <Button
                variant="outline"
                className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                onClick={handleLogout}
                disabled={logoutMutation.status === "pending"}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
