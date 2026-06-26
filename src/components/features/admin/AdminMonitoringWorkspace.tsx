"use client";

import { useState } from "react";
import { Server, Database, MemoryStick, AlertTriangle } from "lucide-react";
import { useAdminSystemHealth, useAdminSystemLogs, useClearSystemLogs } from "@/hooks/useAdmin";

interface HealthMetrics {
  metrics?: {
    uptime?: number;
    memory?: {
      rss?: number;
      heapUsed?: number;
    };
  };
  services?: {
    database?: {
      status?: string;
    };
  };
}
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
  const clearLogsMutation = useClearSystemLogs();

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
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {healthLoading ? <Skeleton className="h-8 w-24" /> : (
              <>
                <div className="text-2xl font-bold">{formatUptime((healthData as unknown as HealthMetrics)?.metrics?.uptime)}</div>
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
                <div className="text-2xl font-bold">{formatBytes((healthData as unknown as HealthMetrics)?.metrics?.memory?.rss)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Heap Used: {formatBytes((healthData as unknown as HealthMetrics)?.metrics?.memory?.heapUsed)}
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
                  {(healthData as unknown as HealthMetrics)?.services?.database?.status || 'Unknown'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Connection active
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
