"use client";

import { useUser } from "@/features/auth";
import AppShell from "@/components/app-shell/AppShell";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userQuery = useUser();
  const user = userQuery.data;

  if (userQuery.isPending || !user) {
    return <DashboardLoadingState />;
  }

  return <AppShell user={user}>{children}</AppShell>;
}
