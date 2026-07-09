"use client";

import { useContractTimeline } from "../hooks/useContracts";
import { formatDate } from "@/shared/lib/formatters";
import { Clock, CheckCircle2, User, HelpCircle, Shield, AlertCircle, Ban } from "lucide-react";

export function ContractTimeline({
  contractId,
}: {
  contractId: string;
}) {
  const { data: events = [], isLoading } = useContractTimeline(contractId);

  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="size-8 rounded-full bg-muted shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground italic">
        No lifecycle events recorded yet.
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "CONTRACT_CREATED":
        return <HelpCircle className="size-4 text-muted-foreground" />;
      case "ESCROW_FUNDED":
      case "PAYMENT_VERIFIED":
        return <Clock className="size-4 text-amber-500" />;
      case "WORK_STARTED":
        return <Clock className="size-4 text-primary" />;
      case "DELIVERABLE_SUBMITTED":
      case "DELIVERABLE_RESUBMITTED":
        return <Clock className="size-4 text-info" />;
      case "CLIENT_CONFIRMED":
      case "ARTISAN_CONFIRMED":
      case "ESCROW_RELEASED":
      case "CONTRACT_COMPLETED":
        return <CheckCircle2 className="size-4 text-success" />;
      case "DISPUTE_OPENED":
      case "DISPUTE_RESOLVED":
        return <AlertCircle className="size-4 text-danger" />;
      case "CONTRACT_CANCELLED":
      case "CONTRACT_REFUNDED":
        return <Ban className="size-4 text-muted-foreground" />;
      default:
        return <Clock className="size-4 text-muted-foreground" />;
    }
  };

  const getActorRoleIcon = (role: string) => {
    switch (role) {
      case "CLIENT":
        return <User className="size-3 text-muted-foreground shrink-0" />;
      case "ARTISAN":
        return <User className="size-3 text-primary shrink-0" />;
      case "SYSTEM":
        return <Shield className="size-3 text-success shrink-0" />;
      case "ADMIN":
        return <Shield className="size-3 text-danger shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="flow-root py-4">
      <ol className="relative border-l border-border/80 ml-4 space-y-8" aria-label="Contract timeline">
        {events.map((event, index) => {
          const isLatest = index === events.length - 1;
          return (
            <li key={event.id} className="relative pl-6 group" aria-current={isLatest ? "step" : undefined}>
              {/* Event Line Node */}
              <span className="absolute -left-[17px] top-1 flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm group-hover:border-primary/50 transition-colors">
                {getEventIcon(event.eventType)}
              </span>

              <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {getActorRoleIcon(event.actor.role)}
                      {event.actor.role}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-foreground">{event.actor.name}</span>
                  </div>
                </div>

                <time className="text-xs text-muted-foreground whitespace-nowrap shrink-0 md:pt-1">
                  {formatDate(event.timestamp)}
                </time>
              </div>

              {event.metadata && Object.keys(event.metadata).length > 0 && (
                <div className="mt-2 text-xs bg-muted/30 p-2 rounded-lg border border-border/50 max-w-md">
                  <pre className="whitespace-pre-wrap font-mono text-[10px]">
                    {JSON.stringify(event.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
