"use client";

import { AlertCircle, Calendar, RefreshCw } from "lucide-react";
import { formatDate } from "@/shared/lib/formatters";

export function RevisionCard({
  feedback,
  date,
  actorName,
}: {
  feedback: string;
  date: string;
  actorName?: string;
}) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-amber-500">
        <AlertCircle className="size-4 shrink-0" />
        <h4 className="text-xs font-bold uppercase tracking-wider">Revision Requested</h4>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        "{feedback}"
      </p>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground border-t border-amber-500/10 pt-2">
        <Calendar className="size-3" />
        <span>Requested by {actorName ?? "Client"} on {formatDate(date)}</span>
      </div>
    </div>
  );
}
export default RevisionCard;
