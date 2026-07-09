"use client";

import { FileText, Calendar, ShieldCheck, User } from "lucide-react";
import type { Contract } from "@/types";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";
import { StatusBadge } from "./status-badge";

export function ContractHeader({
  contract,
  role,
}: {
  contract: Contract;
  role: "CLIENT" | "ARTISAN" | "ADMIN";
}) {
  const isClient = role === "CLIENT";
  const partnerName = isClient ? contract.artisanName ?? contract.artisan?.name : contract.clientName ?? contract.client?.name;
  const partnerRoleLabel = isClient ? "Artisan" : "Client";

  // Determine health indicator
  let health: "green" | "amber" | "red" = "green";
  if (contract.status === "DISPUTED") {
    health = "red";
  } else if (contract.status === "DRAFT" || contract.status === "PENDING_PAYMENT" || (contract.status === "ACTIVE" && !contract.clientConfirmedCompletion && !contract.artisanConfirmedCompletion)) {
    health = "amber";
  }

  const healthColors = {
    green: "bg-emerald-500 ring-emerald-500/20",
    amber: "bg-amber-500 ring-amber-500/20",
    red: "bg-rose-500 ring-rose-500/20",
  };

  const healthText = {
    green: "On track",
    amber: "Action pending",
    red: "Disputed / Attention required",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
      {/* Background radial highlight */}
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl" />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Contract #{contract.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ring-4 ${healthColors[health]}`} />
              <span className="text-xs text-muted-foreground font-medium">
                {healthText[health]}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="size-6 text-primary shrink-0" />
              {contract.jobTitle ?? contract.job?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="size-4 text-muted-foreground/80" />
                {partnerRoleLabel}: <strong className="text-foreground font-medium">{partnerName ?? "Unknown"}</strong>
              </span>
              <span className="hidden sm:inline text-muted-foreground/30">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-4 text-muted-foreground/80" />
                Created: {formatDate(contract.proposal?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 border-t border-border/60 pt-4 md:border-none md:pt-0">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Contract Value
            </p>
            <p className="text-2xl font-black text-foreground">
              {formatCurrency(contract.amount)}
            </p>
          </div>
          <div className="h-10 w-px bg-border/60 hidden md:block" />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Status Badge
            </p>
            <StatusBadge status={contract.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
