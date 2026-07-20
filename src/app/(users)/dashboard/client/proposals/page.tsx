"use client";

import { ClientProposalsWorkspace } from "@/features/proposals/workspaces/ClientProposalsWorkspace";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { useUser } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDashboardPathForRole } from "@/shared/api/fetcher";

export default function ClientProposalsPage() {
  const router = useRouter();
  const userQuery = useUser();
  const user = userQuery.data;

  useEffect(() => {
    if (userQuery.isLoading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.role !== "CLIENT") {
      router.replace(getDashboardPathForRole(user.role));
    }
  }, [router, user, userQuery.isLoading]);

  if (userQuery.isLoading || !user || user.role !== "CLIENT") {
    return <DashboardLoadingState />;
  }

  return (
    <div className="flex-1 h-full max-w-[1600px] mx-auto w-full">
      <ClientProposalsWorkspace user={user} />
    </div>
  );
}
