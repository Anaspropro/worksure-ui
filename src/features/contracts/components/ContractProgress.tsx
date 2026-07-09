"use client";

import type { Contract } from "@/types";

export function ContractProgress({
  contract,
}: {
  contract: Contract;
}) {
  const steps = [
    { status: "DRAFT", label: "Draft", desc: "Awaiting funds" },
    { status: "FUNDED", label: "Funded", desc: "Escrow locked" },
    { status: "ACTIVE", label: "In Progress", desc: "Work ongoing" },
    { status: "COMPLETED", label: "Completed", desc: "Funds released" },
  ];

  const statusOrder: Record<string, number> = {
    DRAFT: 0,
    PENDING_PAYMENT: 0,
    FUNDED: 1,
    ACTIVE: 2,
    IN_PROGRESS: 2,
    CLIENT_CONFIRMED: 2,
    READY_FOR_PAYOUT: 2,
    PAID_OUT: 3,
    COMPLETED: 3,
    CANCELLED: -1,
    REFUNDED: -1,
    PAYMENT_FAILED: -1,
    EXPIRED: -1,
  };

  const currentOrder = statusOrder[contract.status] ?? -1;

  if (currentOrder === -1) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
        Contract is in a terminal or abnormal state: <strong>{contract.status.replace(/_/g, " ")}</strong>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative gap-y-4">
        {/* Progress Line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border sm:hidden" />
        <div className="hidden sm:block absolute top-[18px] left-10 right-10 h-0.5 bg-border" />
        
        {steps.map((step, idx) => {
          const stepOrder = statusOrder[step.status];
          const isPast = stepOrder < currentOrder;
          const isCurrent = stepOrder === currentOrder;
          
          return (
            <div
              key={step.status}
              className="relative z-10 flex flex-row sm:flex-col items-center gap-3 bg-card sm:bg-transparent pl-10 sm:pl-0 w-full sm:w-1/4 sm:text-center"
            >
              <div
                className={`flex items-center justify-center size-9 rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                  isPast
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-background border-primary text-primary ring-4 ring-primary/10"
                      : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {isPast ? (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <div className="space-y-0.5">
                <p
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isCurrent ? "text-primary font-extrabold" : isPast ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
