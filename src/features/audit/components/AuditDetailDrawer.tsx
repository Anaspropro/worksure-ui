import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { format } from "date-fns";

interface AuditDetailDrawerProps {
  event: any | null;
  onClose: () => void;
}

export function AuditDetailDrawer({ event, onClose }: AuditDetailDrawerProps) {
  if (!event) return null;

  return (
    <Sheet open={!!event} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Audit Event Details</SheetTitle>
          <SheetDescription>
            ID: {event.id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold block text-muted-foreground">Domain</span>
              {event.domain}
            </div>
            <div>
              <span className="font-semibold block text-muted-foreground">Action</span>
              <span className="font-mono bg-muted px-1 py-0.5 rounded text-xs">{event.action}</span>
            </div>
            <div>
              <span className="font-semibold block text-muted-foreground">Timestamp</span>
              {format(new Date(event.timestamp), "PPpp")}
            </div>
            <div>
              <span className="font-semibold block text-muted-foreground">Severity</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                event.severity === 'CRITICAL' ? 'bg-destructive/10 text-destructive' :
                event.severity === 'WARNING' ? 'bg-orange-500/10 text-orange-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                {event.severity}
              </span>
            </div>
            <div>
              <span className="font-semibold block text-muted-foreground">Actor</span>
              {event.actorType} {event.actorId ? `(${event.actorId})` : ""}
            </div>
            <div>
              <span className="font-semibold block text-muted-foreground">Target</span>
              {event.targetType} {event.targetId ? `(${event.targetId})` : ""}
            </div>
            <div>
              <span className="font-semibold block text-muted-foreground">Correlation ID</span>
              <span className="font-mono text-xs break-all">{event.correlationId}</span>
            </div>
            <div>
              <span className="font-semibold block text-muted-foreground">IP Address</span>
              <span className="font-mono text-xs">{event.ipAddress || "N/A"}</span>
            </div>
          </div>

          <div>
            <span className="font-semibold block text-sm text-muted-foreground mb-2">User Agent</span>
            <div className="bg-muted/50 p-2 rounded text-xs font-mono break-words">
              {event.userAgent || "N/A"}
            </div>
          </div>

          <div>
            <span className="font-semibold block text-sm text-muted-foreground mb-2">Metadata Payload</span>
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(event.metadata, null, 2)}
            </pre>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
