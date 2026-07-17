import { useAuditTimeline } from "../api/use-audit";
import { format } from "date-fns";
import { Activity, ShieldAlert, Info } from "lucide-react";

interface AuditTimelineProps {
  targetType: string;
  targetId: string;
}

export function AuditTimeline({ targetType, targetId }: AuditTimelineProps) {
  const { data, isLoading } = useAuditTimeline(targetType, targetId);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground animate-pulse">Loading timeline...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-sm text-muted-foreground">No audit events found for this entity.</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((event: any, index: number) => {
        const isLast = index === data.length - 1;
        const Icon = event.severity === 'CRITICAL' ? ShieldAlert : event.severity === 'WARNING' ? Activity : Info;
        const iconColor = event.severity === 'CRITICAL' ? 'text-destructive' : event.severity === 'WARNING' ? 'text-orange-500' : 'text-primary';

        return (
          <div key={event.id} className="relative pl-6">
            {!isLast && (
              <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-border" />
            )}
            <div className="absolute left-0 top-1.5 bg-background rounded-full border p-0.5">
              <Icon className={`size-4 ${iconColor}`} />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{event.action}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(event.timestamp), "MMM d, h:mm a")}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                By {event.actorType} {event.actorId ? `(${event.actorId})` : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
