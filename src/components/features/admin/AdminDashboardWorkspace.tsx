"use client";

import Link from "next/link";
import AppShell from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDisputes, useAdminReports, useAdminUsers } from "@/hooks/useAdmin";
import { useUser } from "@/hooks/useAuth";

function metricValue(source: unknown, fallback: number) {
  return typeof source === "number" ? source : fallback;
}

export default function AdminDashboardWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const usersQuery = useAdminUsers();
  const disputesQuery = useAdminDisputes();
  const reportsQuery = useAdminReports();

  if (!user) {
    return null;
  }

  const users = usersQuery.data?.data ?? [];
  const disputes = disputesQuery.data?.data ?? [];
  const report = reportsQuery.data ?? {};

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <Card className="border-border/80 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_55%,#eff6ff_100%)]">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Admin Operations Dashboard</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Watch platform health, verification pressure, and dispute load from one operational surface.
            </CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Users</p>
              <p className="text-3xl font-semibold text-foreground">{users.length}</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Pending artisan checks</p>
              <p className="text-3xl font-semibold text-foreground">
                {users.filter((entry) => entry.role === "ARTISAN" && !entry.artisanVerified).length}
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Open disputes</p>
              <p className="text-3xl font-semibold text-foreground">
                {disputes.filter((entry) => entry.status !== "RESOLVED").length}
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Report volume</p>
              <p className="text-3xl font-semibold text-foreground">
                {metricValue((report as { totalTransactions?: number }).totalTransactions, 0)}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>Moderation priorities</CardTitle>
              <CardDescription>These queues are the operational work that keeps marketplace trust intact.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-border bg-background/75 p-4">
                <p className="font-semibold text-foreground">Users requiring verification review</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {users.filter((entry) => entry.role === "ARTISAN" && !entry.artisanVerified).length} artisans are waiting for verification.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/75 p-4">
                <p className="font-semibold text-foreground">Open disputes</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {disputes.filter((entry) => entry.status !== "RESOLVED").length} disputes still need a final decision.
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
              <CardDescription>Raw report values stay visible instead of buried inside a generic dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {Object.keys(report).length ? (
                Object.entries(report).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-border bg-surface-muted/60 p-3">
                    <p className="font-medium capitalize text-foreground">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                    <p className="mt-1">{typeof value === "object" ? JSON.stringify(value) : String(value)}</p>
                  </div>
                ))
              ) : (
                <p>No admin report payload is available yet.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </AppShell>
  );
}
