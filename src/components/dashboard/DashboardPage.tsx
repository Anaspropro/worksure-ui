"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import WorkspaceDashboard from "@/components/dashboard/workspace/WorkspaceDashboard";
import { useUser } from "@/hooks/useAuth";
import { getDashboardPathForRole } from "@/api-client";
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

  return <WorkspaceDashboard roleView={role ?? user.role} user={user} />;
}
