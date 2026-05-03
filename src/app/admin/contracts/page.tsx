"use client";

import AdminContractsWorkspace from "@/components/admin/AdminContractsWorkspace";
import { FileText } from "lucide-react";

export default function AdminContractsPage() {
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
