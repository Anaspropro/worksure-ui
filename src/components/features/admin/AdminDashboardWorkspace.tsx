"use client";

import Link from "next/link";
import { useAdminDisputes, useAdminReports, useAdminUsers } from "@/hooks/useAdmin";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

export default function AdminDashboardWorkspace() {
  const usersQuery = useAdminUsers();
  const disputesQuery = useAdminDisputes();
  const reportsQuery = useAdminReports("overview");

  const users = usersQuery.data?.data ?? [];
  const disputes = disputesQuery.data?.data ?? [];
  const report = reportsQuery.data;

  return (
    <main className="space-y-6">
        <Card className="border-border/80 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_55%,#eff6ff_100%)]">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">
              Admin Operations Dashboard
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Watch platform health, verification pressure, and dispute load
              from one operational surface.
            </CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card size="sm">
            <CardContent className="space-y-1 py-2 md:flex md:items-center md:justify-between">
              <p className="text-sm md:text-base text-muted-foreground">Users:</p>
              <p className="text-xl md:text-3xl font-semibold text-foreground">
                {users.length}
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2 md:flex md:items-center md:justify-between">
              <p className="text-sm md:text-base text-muted-foreground">
                Pending artisan checks:
              </p>
              <p className="text-xl md:text-3xl font-semibold text-foreground">
                {
                  users.filter(
                    (entry) =>
                      entry.role === "ARTISAN" && !entry.artisanVerified,
                  ).length
                }
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2 md:flex md:items-center md:justify-between">
              <p className="text-sm md:text-base text-muted-foreground">Open disputes:</p>
              <p className="text-xl md:text-3xl font-semibold text-foreground">
                {disputes.filter((entry) => entry.status !== "RESOLVED").length}
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2 md:flex md:items-center md:justify-between">
              <p className="text-sm md:text-base text-muted-foreground">Flagged jobs:</p>
              <p className="text-xl md:text-3xl font-semibold text-foreground">
                {report?.totals.flaggedJobs ?? 0}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>Moderation priorities</CardTitle>
              <CardDescription>
                These queues are the operational work that keeps marketplace
                trust intact.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 space-y-3">
              <div className="rounded-lg border border-border bg-background/75 p-4">
                <p className="font-semibold text-foreground">
                  Users requiring verification review
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {
                    users.filter(
                      (entry) =>
                        entry.role === "ARTISAN" && !entry.artisanVerified,
                    ).length
                  }{" "}
                  artisans are waiting for verification.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background/75 p-4">
                <p className="font-semibold text-foreground">Open disputes</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {
                    disputes.filter((entry) => entry.status !== "RESOLVED")
                      .length
                  }{" "}
                  disputes still need a final decision.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/admin/users">Open users</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/disputes">Open disputes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>Platform snapshot</CardTitle>
              <CardDescription>
                High-level platform metrics are summarized here without exposing
                raw report payloads.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 grid-cols-2 md:grid-cols-4 text-sm text-muted-foreground">
              {report ? (
                <>
                  <div className="rounded-lg border border-border bg-surface-muted/60 p-3 md:flex md:items-center md:justify-between">
                    <p className="font-medium text-foreground">Users</p>
                    <p className="mt-1">{report.totals.users}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface-muted/60 p-3 md:flex md:items-center md:justify-between">
                    <p className="font-medium text-foreground">Active jobs</p>
                    <p className="mt-1">{report.totals.activeJobs}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface-muted/60 p-3 md:flex md:items-center md:justify-between">
                    <p className="font-medium text-foreground">Open disputes</p>
                    <p className="mt-1">{report.totals.openDisputes}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface-muted/60 p-3 md:flex md:items-center md:justify-between">
                    <p className="font-medium text-foreground">Platform fees</p>
                    <p className="mt-1">
                      NGN {report.totals.platformFees.toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <p>No admin report payload is available yet.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
  );
}
