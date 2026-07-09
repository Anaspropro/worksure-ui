"use client";

import { useUser } from "@/features/auth";
import { ClientContractsWorkspace, ArtisanContractsWorkspace } from "@/features/contracts";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export default function ContractsPage() {
  const userQuery = useUser();
  const user = userQuery.data;

  if (userQuery.isLoading || !user) {
    return <DashboardLoadingState />;
  }

  if (user.role === "CLIENT") {
    return <ClientContractsWorkspace user={user} />;
  }

  return <ArtisanContractsWorkspace user={user} />;
}
