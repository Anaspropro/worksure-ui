"use client";

import AdminContractsWorkspace from "@/components/features/admin/AdminContractsWorkspace";
import { FileText } from "lucide-react";
import { useUser } from "@/hooks/useAuth";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminContractsPage() {
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
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="size-8 text-primary" />
            Contract Analytics
          </h1>
          <p className="text-text-secondary max-w-2xl">
            System-wide overview of all service agreements, financial escrow states, and settlement progress.
          </p>
        </div>

        <AdminContractsWorkspace />
      </div>
  );
}
