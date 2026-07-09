"use client";

import { useContractActivity } from "../hooks/useContracts";
import { formatDate } from "@/shared/lib/formatters";
import { Activity, User, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

export function ActivityFeed({
  contractId,
}: {
  contractId: string;
}) {
  const { data: activities = [], isLoading } = useContractActivity(contractId);

  if (isLoading) {
    return (
      <div className="space-y-4 py-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="size-7 rounded bg-muted shrink-0" />
            <div className="flex-1 space-y-1.5 py-0.5">
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="h-2.5 bg-muted rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-muted-foreground italic">
        No active operations logged.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <Activity className="size-4 text-primary shrink-0" />
        <h3 className="text-sm font-bold text-foreground">Operational Activity Log</h3>
      </div>

      <div className="divide-y divide-border/40 max-h-[300px] overflow-y-auto pr-2 space-y-3">
        {activities.map((act) => {
          return (
            <div key={act.id} className="flex items-start gap-3 pt-3 first:pt-0">
              <div className="size-7 rounded bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground shrink-0 uppercase">
                {act.actor.name.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-normal font-medium">
                  <strong className="text-primary font-semibold">{act.actor.name}</strong> ({act.actor.role.toLowerCase()}): {act.description}
                </p>
                <time className="text-[10px] text-muted-foreground block mt-0.5">
                  {formatDate(act.timestamp)}
                </time>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default ActivityFeed;
