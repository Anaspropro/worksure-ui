import { Badge } from "@/components/ui/badge";

const statusVariantMap = {
  pending: "warning",
  active: "info",
  completed: "success",
  disputed: "destructive",
  funded: "info",
  draft: "outline",
  accepted: "info",
  submitted: "info",
  cancelled: "destructive",
  refunded: "destructive",
  released: "success",
} as const;

function toLabel(status: string) {
  return status.toLowerCase().replace(/_/g, " ");
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const normalized = status.toLowerCase();
  const variant = statusVariantMap[normalized as keyof typeof statusVariantMap] ?? "outline";

  return (
    <Badge variant={variant} className={className}>
      {toLabel(status)}
    </Badge>
  );
}
