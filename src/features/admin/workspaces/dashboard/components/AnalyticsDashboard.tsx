"use client";

import { useAdminReport } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { BarChart, Activity, ShieldAlert, Award, Star } from "lucide-react";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export function AnalyticsDashboard() {
  const { data: jobsReport, isLoading: isJobsLoading } = useAdminReport<{ totals: { jobsCreated: number, inProgress: number, completed: number } }>("jobs_per_month");
  const { data: disputesReport, isLoading: isDisputesLoading } = useAdminReport<{ totals: { active: number, resolved: number } }>("active_disputes");
  const { data: artisansReport, isLoading: isArtisansLoading } = useAdminReport<{ data: Array<{ artisanId: string, name: string, verified: boolean, completedJobs: number, earnings: number }> }>("top_artisans");

  if (isJobsLoading || isDisputesLoading || isArtisansLoading) {
    return <DashboardLoadingState />;
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">Platform performance and insights.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Jobs Overview</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobsReport?.totals.jobsCreated || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex justify-between">
              <span>{jobsReport?.totals.inProgress || 0} in progress</span>
              <span className="text-green-600">{jobsReport?.totals.completed || 0} completed</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Dispute Resolution</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disputesReport?.totals.resolved || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-destructive">{disputesReport?.totals.active || 0} currently active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Top Artisans</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artisansReport?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Top earners on the platform
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Artisans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artisan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Completed Jobs</TableHead>
                  <TableHead className="text-right">Total Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!artisansReport?.data || artisansReport.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No data available.</TableCell>
                  </TableRow>
                ) : (
                  artisansReport.data.map((artisan: any, index: any) => (
                    <TableRow key={artisan.artisanId}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {index < 3 && <Star className={`size-4 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"}`} />}
                        {artisan.name}
                      </TableCell>
                      <TableCell>
                        {artisan.verified ? (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-700">Verified</span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">Unverified</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{artisan.completedJobs}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(artisan.earnings)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
