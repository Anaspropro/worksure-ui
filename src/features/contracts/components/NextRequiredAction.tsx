"use client";

import type { Contract } from "@/types";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle, ArrowRight, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

export type NextActionType =
  | "FUND_ESCROW"
  | "ARTISAN_SUBMIT"
  | "CLIENT_APPROVE"
  | "RELEASE_PAYMENT"
  | "ADMIN_DISPUTE"
  | "LEAVE_REVIEW"
  | "NONE";

export function NextRequiredAction({
  contract,
  role,
  onAction,
  isBusy,
}: {
  contract: Contract;
  role: "CLIENT" | "ARTISAN" | "ADMIN";
  onAction: (action: NextActionType) => void;
  isBusy?: boolean;
}) {
  const isClient = role === "CLIENT";
  const isArtisan = role === "ARTISAN";
  const isAdmin = role === "ADMIN";

  let actionType: NextActionType = "NONE";
  let message = "";
  let description = "";
  let ctaText = "";
  let severity: "info" | "warning" | "success" | "danger" = "info";

  // State calculations
  if (isAdmin) {
    if (contract.status === "DISPUTED") {
      actionType = "ADMIN_DISPUTE";
      message = "Disputed contract requires platform investigation.";
      description = "Review workspace records, conversation history, and deliverables to resolve this dispute.";
      ctaText = "Investigate Dispute";
      severity = "danger";
    } else {
      actionType = "NONE";
      message = "No immediate operational action required.";
      description = "Contract is monitored. Platform will auto-audit system settlement upon completion.";
      severity = "info";
    }
  } else if (isClient) {
    if (contract.status === "DRAFT" || contract.status === "PENDING_PAYMENT") {
      actionType = "FUND_ESCROW";
      message = "Fund escrow to activate this contract.";
      description = "Your artisan is ready to start. Deposit funds into our secure escrow to begin work.";
      ctaText = "Fund Escrow";
      severity = "warning";
    } else if (contract.status === "ACTIVE" || contract.status === "IN_PROGRESS") {
      if (contract.artisanConfirmedCompletion && !contract.clientConfirmedCompletion) {
        actionType = "CLIENT_APPROVE";
        message = "Review submitted deliverables & approve work.";
        description = "The artisan has submitted deliverables. Inspect the files, confirm completion, or request a revision.";
        ctaText = "Review Deliverables";
        severity = "warning";
      } else if (contract.clientConfirmedCompletion && contract.artisanConfirmedCompletion && !contract.escrowReleased) {
        actionType = "RELEASE_PAYMENT";
        message = "Release escrow payment to the artisan.";
        description = "Both parties have confirmed completion. Release the funds to complete the contract.";
        ctaText = "Release Payment";
        severity = "success";
      } else if (!contract.clientConfirmedCompletion) {
        actionType = "CLIENT_APPROVE";
        message = "Monitor work and confirm completion.";
        description = "The contract is active. You can confirm completion once the work is finalized to your satisfaction.";
        ctaText = "Confirm Completion";
        severity = "info";
      } else {
        actionType = "NONE";
        message = "Awaiting artisan completion confirmation.";
        description = "You have approved the work. Payout will unlock once the artisan also confirms completion.";
        severity = "info";
      }
    } else if (contract.status === "COMPLETED" || contract.status === "PAID_OUT") {
      actionType = "LEAVE_REVIEW";
      message = "Contract successfully completed.";
      description = "All funds have been released. Don't forget to submit your review for this contract.";
      ctaText = "Leave a Review";
      severity = "success";
    } else {
      actionType = "NONE";
      message = `Contract is in ${contract.status.toLowerCase()} state.`;
      description = "No further actions are required from your end.";
      severity = "info";
    }
  } else if (isArtisan) {
    if (contract.status === "DRAFT" || contract.status === "PENDING_PAYMENT") {
      actionType = "NONE";
      message = "Awaiting escrow funding from client.";
      description = "Do not begin work yet. You will be notified once the client funds the secure escrow.";
      severity = "info";
    } else if (contract.status === "FUNDED") {
      actionType = "ARTISAN_SUBMIT";
      message = "Escrow is funded. Start work and submit deliverables.";
      description = "Your payment is secured in escrow. Start the project and submit files when ready.";
      ctaText = "Submit Deliverables";
      severity = "warning";
    } else if (contract.status === "ACTIVE" || contract.status === "IN_PROGRESS") {
      if (!contract.artisanConfirmedCompletion) {
        actionType = "ARTISAN_SUBMIT";
        message = "Submit completed deliverables.";
        description = "Provide your files or confirm completion so the client can inspect and release the payment.";
        ctaText = "Submit Deliverables";
        severity = "warning";
      } else if (!contract.clientConfirmedCompletion) {
        actionType = "NONE";
        message = "Awaiting client verification & approval.";
        description = "You have submitted work. The client must review deliverables and confirm completion.";
        severity = "info";
      } else if (!contract.escrowReleased) {
        actionType = "NONE";
        message = "Awaiting final escrow release.";
        description = "Both parties confirmed completion. The client is authorizing the bank release.";
        severity = "info";
      }
    } else if (contract.status === "COMPLETED" || contract.status === "PAID_OUT") {
      actionType = "LEAVE_REVIEW";
      message = "Payout processed successfully.";
      description = "Funds have been released to your earnings ledger. Submit your review for this client.";
      ctaText = "Leave a Review";
      severity = "success";
    } else {
      actionType = "NONE";
      message = `Contract is in ${contract.status.toLowerCase()} state.`;
      description = "No further actions are required from your end.";
      severity = "info";
    }
  }

  if (actionType === "NONE" && !description) {
    return null;
  }

  const severityStyles = {
    info: {
      bg: "bg-primary/5 border-primary/20",
      icon: <Sparkles className="size-5 text-primary shrink-0" />,
      titleColor: "text-foreground",
    },
    warning: {
      bg: "bg-amber-500/5 border-amber-500/20",
      icon: <AlertCircle className="size-5 text-amber-500 shrink-0" />,
      titleColor: "text-foreground",
    },
    success: {
      bg: "bg-emerald-500/5 border-emerald-500/20",
      icon: <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />,
      titleColor: "text-foreground",
    },
    danger: {
      bg: "bg-rose-500/5 border-rose-500/20",
      icon: <ShieldAlert className="size-5 text-rose-500 shrink-0" />,
      titleColor: "text-foreground",
    },
  };

  const style = severityStyles[severity];

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all ${style.bg}`}>
      <div className="flex gap-4 items-start">
        {style.icon}
        <div className="space-y-1.5 flex-1 min-w-0">
          <h3 className={`text-sm font-semibold leading-none ${style.titleColor}`}>
            {message}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        {actionType !== "NONE" && ctaText && (
          <Button
            size="sm"
            onClick={() => onAction(actionType)}
            disabled={isBusy}
            className="shrink-0 flex items-center gap-1 shadow-sm text-xs h-9 px-4"
          >
            {ctaText}
            <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
