"use client";

import { use } from "react";
import { useUser } from "@/features/auth";
import { Workspaces } from "@/features/jobs";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: user, isLoading } = useUser();

  if (isLoading || !user) {
    return <DashboardLoadingState message="Loading job details" />;
  }

  if (user.role === "CLIENT") {
    return <Workspaces.ClientJobDetail jobId={resolvedParams.id} />;
  }

  if (user.role === "ARTISAN") {
    return <Workspaces.ArtisanJobDetail jobId={resolvedParams.id} />;
  }

  // Note: Admin has a different route in this setup, but handled here just in case
  if (user.role === "ADMIN") {
    return <Workspaces.AdminJobDetail jobId={resolvedParams.id} />;
  }

  return null;
}
