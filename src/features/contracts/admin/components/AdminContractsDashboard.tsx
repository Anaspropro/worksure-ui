"use client";

import { useAdminContractStats } from "../hooks/useAdminContracts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Wallet, Activity, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function AdminContractsDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminContractStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FUNDED": return "bg-info";
      case "ACTIVE":
      case "IN_PROGRESS": return "bg-warning";
      case "DISPUTED": return "bg-danger";
      case "COMPLETED":
      case "PAID_OUT": return "bg-primary";
      case "CANCELLED": return "bg-muted-foreground";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Stats Overview ────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">₦ {(stats?.totalVolume || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cumulative contract value
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Escrow</CardTitle>
            <Wallet className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">₦{(stats?.escrowVolume || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Funds held by platform
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.activeContractCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Contracts currently in progress
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">₦{(stats?.averageValue || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per contract average
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Status Distribution & Settlement ─────────────────────── */}
      {!statsLoading && stats && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm">Status Distribution</CardTitle>
              <CardDescription className="text-xs">Distribution of contracts by lifecycle state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.statusDistribution || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
                      <span className="font-medium">{status.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="text-muted-foreground font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Financial Settlement</CardTitle>
              <CardDescription className="text-xs">Comparison of payouts and refunds</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center h-full pb-8">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <ArrowUpRight className="size-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Payouts</span>
                  </div>
                  <div className="text-xl font-bold text-foreground">₦{stats.payoutVolume.toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <ArrowDownRight className="size-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Refunds</span>
                  </div>
                  <div className="text-xl font-bold text-foreground">₦{stats.refundVolume.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
export default AdminContractsDashboard;
