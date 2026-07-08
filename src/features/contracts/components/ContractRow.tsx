"use client";

import { ChevronRight, FileText } from "lucide-react";
import type { User, Contract } from "@/types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/formatters";

export function ContractRow({
  contract,
  user,
  onFund,
  onConfirm,
  onRelease,
  isBusy,
}: {
  contract: Contract;
  user: User;
  onFund: () => void;
  onConfirm: (isClient: boolean) => void;
  onRelease: () => void;
  isBusy: boolean;
}) {
  const isClient = user.id === contract.clientId;

  return (
    <div
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/30 hover:bg-primary/3 transition-all cursor-pointer"
      role="article"
      aria-label={`Contract for ${contract.job.title}`}
    >
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <FileText className="size-5 text-primary" aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm text-foreground truncate">{contract.job.title}</p>
          <StatusBadge status={contract.status} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isClient ? `with ${contract.artisan?.name}` : `via ${contract.client?.name}`}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-foreground">{formatCurrency(contract.amount)}</p>
        {contract.status === "DRAFT" && isClient && (
          <Button size="sm" className="mt-1.5 h-7 text-xs shadow-sm" onClick={onFund} disabled={isBusy}>
            Fund
          </Button>
        )}
        {contract.status === "ACTIVE" && isClient && !contract.clientConfirmedCompletion && (
          <Button size="sm" variant="outline" className="mt-1.5 h-7 text-xs bg-background" onClick={() => onConfirm(true)} disabled={isBusy}>
            Confirm
          </Button>
        )}
        {contract.status === "ACTIVE" && !isClient && !contract.artisanConfirmedCompletion && (
          <Button size="sm" variant="outline" className="mt-1.5 h-7 text-xs bg-background" onClick={() => onConfirm(false)} disabled={isBusy}>
            Submit work
          </Button>
        )}
        {contract.status === "ACTIVE" && contract.clientConfirmedCompletion && contract.artisanConfirmedCompletion && !contract.escrowReleased && isClient && (
          <Button size="sm" className="mt-1.5 h-7 text-xs shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onRelease} disabled={isBusy}>
            Release
          </Button>
        )}
      </div>

      <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" aria-label="View contract details" />
    </div>
  );
}
