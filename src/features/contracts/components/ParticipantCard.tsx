"use client";

import type { Contract } from "@/types";
import { User, Mail, ShieldAlert } from "lucide-react";

export function ParticipantCard({
  contract,
  role,
}: {
  contract: Contract;
  role: "CLIENT" | "ARTISAN" | "ADMIN";
}) {
  const isClient = role === "CLIENT";

  const renderMember = (
    title: string,
    name?: string | null,
    email?: string | null,
    roleBadge?: string
  ) => {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 font-bold text-primary">
          {name ? name.slice(0, 2).toUpperCase() : <User className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
            {title}
          </span>
          <p className="font-semibold text-sm text-foreground truncate mt-0.5">{name ?? "Unknown Partner"}</p>
          {email && (
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
              <Mail className="size-3" />
              {email}
            </span>
          )}
        </div>
        {roleBadge && (
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
            {roleBadge}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">Agreement Participants</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {renderMember("Client", contract.clientName ?? contract.client?.name, contract.client?.email, "Client")}
        {renderMember("Artisan", contract.artisanName ?? contract.artisan?.name, contract.artisan?.email, "Artisan")}
      </div>
    </div>
  );
}
