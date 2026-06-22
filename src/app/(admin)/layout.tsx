"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useAuth";
import AppShell from "@/components/app-shell/AppShell";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userQuery = useUser();
  const user = userQuery.data;
  const router = useRouter();

  useEffect(() => {
    if (!userQuery.isAuthLoading && (!userQuery.isAuthenticated || user?.role !== "ADMIN")) {
      router.replace("/auth/login");
    }
  }, [user, userQuery.isAuthenticated, userQuery.isAuthLoading, router]);

  if (userQuery.isAuthLoading || !userQuery.isAuthenticated || user?.role !== "ADMIN") {
    return <DashboardLoadingState />;
  }

  return <AppShell user={user}>{children}</AppShell>;
}
