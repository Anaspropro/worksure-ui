"use client";

import { use } from "react";
import { useUser } from "@/features/auth";
import { Workspaces } from "@/features/jobs";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: user } = useUser();

  if (!user) return null;

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
