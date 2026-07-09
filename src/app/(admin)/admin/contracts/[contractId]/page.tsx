"use client";

import { use } from "react";
import { useUser } from "@/features/auth";
import { AdminContractDetail } from "@/features/contracts/admin/components/AdminContractDetail";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminContractDetailPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = use(params);
  const userQuery = useUser();
  const user = userQuery.data;
  const router = useRouter();

  useEffect(() => {
    if (!userQuery.isLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/auth/login");
    }
  }, [user, userQuery.isLoading, router]);

  if (userQuery.isLoading || !user || user.role !== "ADMIN") {
    return <DashboardLoadingState />;
  }

  return (
    <div className="container mx-auto py-8">
      <AdminContractDetail contractId={contractId} />
    </div>
  );
}
