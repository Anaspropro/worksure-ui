"use client";

import { useState } from "react";
import { History, X, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminAuditLogs } from "@/hooks/useAdmin";
import { formatDate } from "@/lib/formatters";
import type { AuditLog } from "@/types";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAuditWorkspace() {
  const [page, setPage] = useState(1);
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);
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
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Details</th>
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
                      <td className="px-4 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedAudit(log)}
                        >
                          View Details
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={logs.length < 20}>Next</Button>
          </div>
        </CardContent>
      </Card>

      {selectedAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold">Audit Details</h2>
                <p className="text-sm text-muted-foreground mt-1">ID: {selectedAudit?.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedAudit(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Action</span>
                  <div>
                    <Badge variant="outline" className="font-mono text-xs font-normal">
                      {selectedAudit?.action}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Timestamp</span>
                  <div className="font-medium">{selectedAudit?.performedAt ? formatDate(selectedAudit.performedAt) : null}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Entity Type</span>
                  <div className="font-medium">{selectedAudit?.entityType}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Entity ID</span>
                  <div className="font-mono text-sm break-all">{selectedAudit?.entityId}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-xs text-muted-foreground">Performed By</span>
                  <div className="font-mono text-sm flex items-center gap-2">
                    <History className="size-4 text-muted-foreground" />
                    {selectedAudit?.performedBy}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Metadata</h3>
                <div className="bg-muted rounded-md p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                    {selectedAudit?.metadata 
                      ? JSON.stringify(selectedAudit.metadata, null, 2) 
                      : "No metadata available for this action."}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedAudit(null)}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
