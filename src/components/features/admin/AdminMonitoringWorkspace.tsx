"use client";

import { useState } from "react";
import { Activity, Server, Database, MemoryStick, AlertTriangle } from "lucide-react";
import { useAdminSystemHealth, useAdminSystemLogs } from "@/hooks/useAdmin";
import { formatDate } from "@/lib/formatters";
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

export default function AdminMonitoringWorkspace() {
  const [page, setPage] = useState(1);
  const { data: healthData, isLoading: healthLoading } = useAdminSystemHealth({ refetchInterval: 10000 });
  const { data: logsResponse, isLoading: logsLoading } = useAdminSystemLogs(page, 20);

  const logs = logsResponse?.data || [];
  const total = logsResponse?.meta?.total || 0;

  const getLevelBadge = (level: string) => {
    switch (level.toUpperCase()) {
      case "ERROR":
      case "CRITICAL":
      case "FATAL":
        return <Badge variant="destructive">{level}</Badge>;
      case "WARN":
      case "WARNING":
        return <Badge variant="secondary" className="bg-warning-50 text-warning-700 border-warning-200">{level}</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const formatUptime = (seconds?: number) => {
    if (seconds === undefined) return "N/A";
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || parts.length === 0) parts.push(`${m}m`);
    return parts.join(' ');
  };

  const formatBytes = (bytes?: number) => {
    if (bytes === undefined) return "N/A";
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          System Monitoring
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Real-time engineering dashboard tracking platform health, memory usage, and caught application errors.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {healthLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold">{formatUptime((healthData as any)?.metrics?.uptime)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: <span className="text-success font-medium">{healthData?.status || 'Unknown'}</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage (RSS)</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {healthLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold">{formatBytes((healthData as any)?.metrics?.memory?.rss)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Heap Used: {formatBytes((healthData as any)?.metrics?.memory?.heapUsed)}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {healthLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold capitalize text-success">
                  {(healthData as any)?.services?.database?.status || 'Unknown'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Connection active
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-destructive" />
                Error Logs
              </CardTitle>
              <CardDescription>
                Recent system errors and critical events. Total records: {logsLoading ? "Loading..." : String(total)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-48">Timestamp</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Level</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-48">Context</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logsLoading ? (
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
                      No system logs found. Looks like smooth sailing!
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap align-top">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        {getLevelBadge(log.level)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <Badge variant="outline" className="font-mono text-xs font-normal">
                          {log.context}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium text-foreground">{log.message}</div>
                        {log.trace && (
                          <div className="mt-2 text-xs text-muted-foreground font-mono bg-muted p-2 rounded-md overflow-x-auto whitespace-pre-wrap max-h-32 overflow-y-auto">
                            {log.trace}
                          </div>
                        )}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground font-mono">
                            {JSON.stringify(log.metadata)}
                          </div>
                        )}
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
    </div>
  );
}
