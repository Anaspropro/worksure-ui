"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { useAdminAuditLogs } from "@/hooks/useAdmin";
import { formatDate } from "@/lib/formatters";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAuditWorkspace() {
  const [page] = useState(1);
  const { data: auditResponse, isLoading } = useAdminAuditLogs(page, 20);

  const logs = auditResponse?.data || [];
  const total = auditResponse?.meta?.total || 0;

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Audit Trail
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Compliance review and historical record of sensitive actions performed across the platform.
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>System Audit Logs</CardTitle>
              <CardDescription>
                Total records: {isLoading ? "Loading..." : String(total)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Timestamp</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Entity</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-4 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        {formatDate(log.performedAt)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="font-mono text-xs font-normal">
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-foreground">{log.entityType}</div>
                        <div className="text-xs text-muted-foreground font-mono">{log.entityId}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <History className="size-4 text-muted-foreground" />
                          <span className="font-mono text-xs">{log.performedBy}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
