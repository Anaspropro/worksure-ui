"use client";

import { use } from "react";
import { useUser } from "@/features/auth";
import { ClientContractDetail, ArtisanContractDetail } from "@/features/contracts";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = use(params);
  const userQuery = useUser();
  const user = userQuery.data;

  if (userQuery.isLoading || !user) {
    return <DashboardLoadingState />;
  }

  if (user.role === "CLIENT") {
    return <ClientContractDetail contractId={contractId} user={user} />;
  }

  return <ArtisanContractDetail contractId={contractId} user={user} />;
}
