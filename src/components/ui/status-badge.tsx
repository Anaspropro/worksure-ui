import { StateBadge } from "@/components/ui/state-badge";

function toLabel(status: string) {
  return status.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const normalized = status.toUpperCase().replace(/ /g, "_");
  
  // Map to the exact state names expected by StateBadge
  const stateMap: Record<string, "DRAFT" | "PENDING_PAYMENT" | "FUNDED" | "IN_PROGRESS" | "CLIENT_CONFIRMED" | "READY_FOR_PAYOUT" | "PAID_OUT" | "DISPUTED" | "CANCELLED" | "REFUNDED"> = {
    "DRAFT": "DRAFT",
    "PENDING_PAYMENT": "PENDING_PAYMENT", 
    "FUNDED": "FUNDED",
    "IN_PROGRESS": "IN_PROGRESS",
    "CLIENT_CONFIRMED": "CLIENT_CONFIRMED",
    "READY_FOR_PAYOUT": "READY_FOR_PAYOUT",
    "PAID_OUT": "PAID_OUT",
    "DISPUTED": "DISPUTED",
    "CANCELLED": "CANCELLED",
    "REFUNDED": "REFUNDED",
    "EXPIRED": "CANCELLED", // Map expired to cancelled styling
  };

  const state = stateMap[normalized] ?? "DRAFT";

  return (
    <StateBadge state={state} className={className}>
      {toLabel(status)}
    </StateBadge>
  );
}
