"use client";

import { useUser } from "@/features/auth";
import { Workspaces } from "@/features/jobs";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export default function JobsPage() {
  const { data: user, isLoading } = useUser();
  
  if (isLoading || !user) {
    return <DashboardLoadingState message="Loading jobs workspace" />;
  }

  if (user.role === "CLIENT") {
    return <Workspaces.ClientJobsWorkspace />;
  }
  
  if (user.role === "ARTISAN") {
    return <Workspaces.MarketplaceWorkspace />;
  }
  
  if (user.role === "ADMIN") {
    return <Workspaces.AdminJobsWorkspace />;
  }

  return null;
}
