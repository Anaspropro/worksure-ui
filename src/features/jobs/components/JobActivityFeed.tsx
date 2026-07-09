"use client";

import { useJobTimeline } from "../hooks/useJobs";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { getInitials } from "@/shared/lib/utils";

interface JobActivityFeedProps {
  jobId: string;
}

export function JobActivityFeed({ jobId }: JobActivityFeedProps) {
  const { data: events, isLoading, error } = useJobTimeline(jobId);

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>;
  }

  if (error || !events) {
    return <div className="text-sm text-destructive">Failed to load activity feed.</div>;
  }

  if (events.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-4">No activity yet.</div>;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-muted/50 text-xs">
              {getInitials(event.actorName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">
                {event.actorName} <span className="text-muted-foreground font-normal">({event.actorRole.toLowerCase()})</span>
              </p>
              <div className="text-xs text-muted-foreground">
                {new Date(event.timestamp).toLocaleString()}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
