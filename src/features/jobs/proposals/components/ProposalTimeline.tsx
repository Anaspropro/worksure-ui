"use client";

import { useProposalTimeline } from "../hooks/useProposals";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Circle, User, Building, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalTimelineProps {
  proposalId: string;
}

export function ProposalTimeline({ proposalId }: ProposalTimelineProps) {
  const { data: events, isLoading, error } = useProposalTimeline(proposalId);

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>;
  }

  if (error || !events) {
    return <div className="text-sm text-destructive">Failed to load timeline.</div>;
  }

  if (events.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-4">No events recorded.</div>;
  }

  return (
    <div className="relative border-l border-muted ml-3 space-y-6">
      {events.map((event, index) => {
        const isLatest = index === events.length - 1;
        
        let Icon = Settings;
        if (event.actorRole === "CLIENT") Icon = Building;
        else if (event.actorRole === "ARTISAN") Icon = User;
        
        return (
          <div key={event.id} className="relative pl-6">
            <div className={cn(
              "absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full border-4 border-background bg-muted",
              isLatest && "bg-primary text-primary-foreground border-primary/20"
            )}>
              <Icon className={cn("h-3.5 w-3.5", isLatest ? "text-primary-foreground" : "text-muted-foreground")} />
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">{event.description}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">{event.actorRole}</span>
                <span>•</span>
                <span>{new Date(event.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
