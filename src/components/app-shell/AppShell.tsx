"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import SidebarNav from "@/components/app-shell/SidebarNav";
import SidebarProfile from "@/components/app-shell/SidebarProfile";
import UserAvatar from "@/components/app-shell/UserAvatar";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { getDashboardPathForRole } from "@/proxy";
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_18%),linear-gradient(180deg,#f0fdf4_0%,#f9fafb_100%)] text-foreground">
      <div className="mx-auto w-full max-w-370 px-4 py-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between rounded-[24px] border border-emerald-200/70 bg-white/88 px-4 py-3 shadow-[0_18px_40px_-30px_rgba(16,185,129,0.28)] backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => router.push(getDashboardPathForRole(user.role))}
            className="flex items-center gap-3 text-left"
          >
            <UserAvatar user={user} className="h-10 w-10 rounded-2xl" />
            <div>
              <p className="text-sm font-semibold text-foreground">WorkSure</p>
              <p className="text-xs text-text-secondary">
                {user.role.toLowerCase()} workspace
              </p>
            </div>
          </button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() =>
              logoutMutation.mutate(undefined, {
                onSettled: () => router.replace("/auth/login"),
              })
            }
            disabled={logoutMutation.status === "pending"}
          >
            <LogOut className="size-4" />
          </Button>
        </div>

        <div className="grid min-h-screen gap-6 lg:grid-cols-[292px_minmax(0,1fr)]">
          <aside className="hidden rounded-[32px] border border-sidebar-border bg-[linear-gradient(180deg,#0f172a_0%,#122033_100%)] p-5 text-white shadow-[0_28px_110px_-60px_rgba(15,23,42,0.88)] lg:sticky lg:top-4 lg:block lg:h-[calc(100vh-2rem)]">
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => router.push(getDashboardPathForRole(user.role))}
                className="flex items-center gap-3 text-left"
              >
                <UserAvatar
                  user={user}
                  className="h-12 w-12 rounded-[1.35rem]"
                />
                <div>
                  <p className="text-xl font-heading tracking-tight">
                    WorkSure
                  </p>
                </div>
              </button>

              <SidebarNav role={user.role} />

              <div className="absolute inset-x-5 bottom-5 space-y-4 pt-4 text-sm">
                <SidebarProfile user={user} />

                <Button
                  variant="outline"
                  className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  onClick={() =>
                    logoutMutation.mutate(undefined, {
                      onSettled: () => router.replace("/auth/login"),
                    })
                  }
                  disabled={logoutMutation.status === "pending"}
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </div>
            </div>
          </aside>

          <div className="min-w-0 pb-28 lg:py-1 lg:pb-1">{children}</div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-200 bg-white/94 px-3 py-3 shadow-[0_-18px_40px_-30px_rgba(15,23,42,0.25)] backdrop-blur lg:hidden">
        <div className="mx-auto max-w-370 rounded-[24px] bg-[#eefcf4] px-2 py-2">
          <SidebarNav role={user.role} mobile />
        </div>
      </div>
    </div>
  );
}
