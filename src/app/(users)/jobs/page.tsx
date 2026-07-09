"use client";

import { useUser } from "@/features/auth";
import { Workspaces } from "@/features/jobs";

export default function JobsPage() {
  const { data: user } = useUser();
  
  if (!user) return null;

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
