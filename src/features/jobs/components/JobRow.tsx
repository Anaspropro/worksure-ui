"use client";

import { BriefcaseBusiness, ChevronRight } from "lucide-react";
import type { Job } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/formatters";

export function JobRow({ job }: { job: Job }) {
  return (
    <div
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/30 hover:bg-primary/3 transition-all"
      role="article"
      aria-label={`Job listing for ${job.title}`}
    >
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <BriefcaseBusiness className="size-5 text-primary" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">{job.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{job.description}</p>
      </div>
      <div className="text-right flex-shrink-0 space-y-1">
        <p className="text-sm font-bold">{formatCurrency(job.budget)}</p>
        <StatusBadge status={job.status} />
      </div>
      <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" aria-label="View job details" />
    </div>
  );
}
