"use client";

import type { Contract } from "@/types";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";
import { Wallet, ShieldCheck, HelpCircle, FileText, ArrowUpRight } from "lucide-react";

export function EscrowSummary({
  contract,
}: {
  contract: Contract;
}) {
  const isFunded = !!contract.fundedAt;
  const isReleased = contract.escrowReleased;

  // Determine dynamic financial details
  const contractAmount = formatCurrency(contract.amount);
  
  let escrowStatus = "Awaiting Funding";
  let escrowStatusColor = "text-muted-foreground bg-muted";
  
  if (contract.status === "REFUNDED") {
    escrowStatus = "Refunded";
    escrowStatusColor = "text-rose-500 bg-rose-500/10";
  } else if (isReleased) {
    escrowStatus = "Released";
    escrowStatusColor = "text-emerald-500 bg-emerald-500/10";
  } else if (isFunded) {
    escrowStatus = "Locked in Escrow";
    escrowStatusColor = "text-amber-500 bg-amber-500/10";
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Escrow Financial Summary</h3>
            <p className="text-xs text-muted-foreground">Verification details and platform obligations</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${escrowStatusColor}`}>
          {escrowStatus}
        </span>
      </div>

      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Agreement Budget
          </p>
          <p className="text-sm font-bold text-foreground">
            {contractAmount}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Expected Release Condition
          </p>
          <p className="text-sm font-medium text-foreground">
            Both parties must confirm completion
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Funding Method / Gateway
          </p>
          <p className="text-sm font-medium text-foreground">
            {isFunded ? "Paystack Security Broker" : "Pending client checkout"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Payment Verification
          </p>
          <p className="text-sm font-medium text-foreground flex items-center gap-1">
            {isFunded ? (
              <>
                <ShieldCheck className="size-4 text-emerald-500" />
                Verified ✓
              </>
            ) : (
              "Awaiting transaction check"
            )}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Escrow Funding Date
          </p>
          <p className="text-sm font-medium text-foreground">
            {contract.fundedAt ? formatDate(contract.fundedAt) : "Not funded"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Escrow Release Date
          </p>
          <p className="text-sm font-medium text-foreground">
            {contract.escrowReleasedAt ? formatDate(contract.escrowReleasedAt) : "Not released"}
          </p>
        </div>

        {contract.status === "REFUNDED" && (
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Refund Status
            </p>
            <p className="text-sm font-semibold text-rose-500">
              Fully refunded to source wallet
            </p>
          </div>
        )}

        <div className="space-y-1 sm:col-span-2 border-t border-border/40 pt-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
            Transaction Broker Reference
          </p>
          <p className="text-xs font-mono text-muted-foreground select-all">
            {isFunded ? `ps_ref_${contract.id.slice(0, 12)}_sec` : "Not generated"}
          </p>
        </div>
      </div>
    </div>
  );
}
