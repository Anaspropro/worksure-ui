"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import ClientDashboard from "@/features/dashboard/components/ClientDashboard";
import ArtisanDashboard from "@/features/dashboard/components/ArtisanDashboard";
import AdminDashboardWorkspace from "@/components/features/admin/AdminDashboardWorkspace";
import { useUser } from "@/features/auth";
import { getDashboardPathForRole } from "@/shared/api/fetcher";
import type { UserRole } from "@/types";

export default function DashboardPage({
  role,
}: {
  role?: UserRole;
}) {
  const router = useRouter();
  const userQuery = useUser();
  const user = userQuery.data;

  useEffect(() => {
    if (userQuery.isLoading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!role) {
      router.replace(getDashboardPathForRole(user.role));
      return;
    }

    if (user.role !== role) {
      router.replace(getDashboardPathForRole(user.role));
    }
  }, [role, router, user, userQuery.isLoading]);

  if (userQuery.isLoading || !user || (role && user.role !== role)) {
    return <DashboardLoadingState />;
  }

  const activeRole = role ?? user.role;

  if (activeRole === "CLIENT") {
    return <ClientDashboard user={user} />;
  }

  if (activeRole === "ARTISAN") {
    return <ArtisanDashboard user={user} />;
  }

  if (activeRole === "ADMIN") {
    return <AdminDashboardWorkspace />;
  }

  return <DashboardLoadingState />;
}
