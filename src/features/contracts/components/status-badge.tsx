import { StateBadge } from "./state-badge";
import { CheckCircle2, Clock, AlertTriangle, XCircle, Ban } from "lucide-react";

function toLabel(status: string) {
  return status.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export function StatusBadge({
  status,
  className,
}: {
  status?: string | null;
  className?: string;
}) {
  if (!status || typeof status !== "string") {
    return (
      <StateBadge state="DRAFT" className={className}>
        <Clock className="size-3" />
        Unknown
      </StateBadge>
    );
  }

  const normalized = status.toUpperCase().replace(/ /g, "_");
  
  // Map to the exact state names expected by StateBadge
  const stateMap: Record<string, "DRAFT" | "PENDING_PAYMENT" | "FUNDED" | "IN_PROGRESS" | "CLIENT_CONFIRMED" | "READY_FOR_PAYOUT" | "PAID_OUT" | "DISPUTED" | "CANCELLED" | "REFUNDED" | "PAYMENT_FAILED" | "EXPIRED"> = {
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
    "PAYMENT_FAILED": "PAYMENT_FAILED",
    "EXPIRED": "EXPIRED",
  };

  const state = stateMap[normalized] ?? "DRAFT";

  // Pick an icon based on state class
  const getIcon = () => {
    switch (state) {
      case "PAID_OUT":
      case "REFUNDED":
        return <CheckCircle2 className="size-3 shrink-0" />;
      case "DISPUTED":
      case "PAYMENT_FAILED":
        return <AlertTriangle className="size-3 shrink-0" />;
      case "CANCELLED":
      case "EXPIRED":
        return <Ban className="size-3 shrink-0" />;
      default:
        return <Clock className="size-3 shrink-0" />;
    }
  };

  return (
    <StateBadge state={state} className={className}>
      {getIcon()}
      {toLabel(status)}
    </StateBadge>
  );
}
