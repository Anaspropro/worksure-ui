import { Badge } from "@/shared/components/ui/badge";
import { JobStatus } from "../types";
import { CheckCircle2, CircleDashed, Clock, FileEdit, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const config: Record<JobStatus, { label: string; icon: React.ElementType; variant: string }> = {
    DRAFT: { label: "Draft", icon: FileEdit, variant: "bg-muted text-muted-foreground border-transparent" },
    OPEN: { label: "Open", icon: CircleDashed, variant: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" },
    UNDER_REVIEW: { label: "Under Review", icon: Clock, variant: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" },
    AWARDED: { label: "Awarded", icon: CheckCircle2, variant: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
    CLOSED: { label: "Closed", icon: CheckCircle2, variant: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
    CANCELLED: { label: "Cancelled", icon: XCircle, variant: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" },
  };

  const { label, icon: Icon, variant } = config[status] || config.DRAFT;

  return (
    <Badge className={cn("inline-flex items-center gap-1 font-medium", variant, className)} variant="outline">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
