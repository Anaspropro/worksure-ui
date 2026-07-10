import { OnlineStatus } from "../../types";
import { cn } from "@/shared/lib/utils";

interface OnlineIndicatorProps {
  status: OnlineStatus;
  className?: string;
}

export function OnlineIndicator({ status, className }: OnlineIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full border border-background shrink-0",
        {
          "bg-emerald-500": status === "ONLINE",
          "bg-amber-500": status === "DO_NOT_DISTURB",
          "bg-muted-foreground/40": status === "OFFLINE" || status === "LAST_SEEN",
        },
        className
      )}
      title={status}
    />
  );
}
