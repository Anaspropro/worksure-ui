"use client";

import { useAdminOverview, useAdminContractStats } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users, Briefcase, ShieldAlert, CreditCard, Wallet, AlertCircle } from "lucide-react";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export function GlobalDashboard() {
  const { data: overview, isLoading: isOverviewLoading } = useAdminOverview();
  const { data: contractStats, isLoading: isContractLoading } = useAdminContractStats();

  if (isOverviewLoading || isContractLoading) {
    return <DashboardLoadingState />;
  }

  if (!overview || !contractStats) {
    return <div>Failed to load dashboard data.</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Operations Center</h1>
          <p className="text-muted-foreground mt-1">Platform overview and real-time metrics.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totals.users.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.totals.pendingArtisansCount} pending artisans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totals.activeJobs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.totals.flaggedJobs > 0 ? (
                <span className="text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {overview.totals.flaggedJobs} flagged
                </span>
              ) : (
                "0 flagged jobs"
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totals.openDisputes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires admin resolution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(overview.totals.platformFees)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total gross revenue
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">Financial Operations</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total System Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totals.totalSystemValue || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total funds in platform wallets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Locked in Escrow</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totals.lockedInEscrow || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {contractStats.activeContractCount} active contracts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Ready for Payout</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totals.pendingPayoutsCount?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Contracts awaiting processing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
