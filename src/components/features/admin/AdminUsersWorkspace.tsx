"use client";

import { useState } from "react";
import { toast } from "sonner";
import AppShell from "@/components/app-shell/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminUserDetail, useAdminUsers, useBanUser, useUnbanUser, useVerifyArtisan } from "@/hooks/useAdmin";
import { useUser } from "@/hooks/useAuth";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function AdminUsersWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const usersQuery = useAdminUsers({ enabled: Boolean(user) });
  const verifyArtisanMutation = useVerifyArtisan();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const detailQuery = useAdminUserDetail(selectedUserId ?? undefined, { enabled: Boolean(user && selectedUserId) });

  if (!user) {
    return null;
  }

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Admin User Operations</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Review verification readiness, account status, and moderation actions from one queue.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle>User queue</CardTitle>
            <CardDescription>
              Total users: {usersQuery.data?.meta?.total ? String(usersQuery.data.meta.total) : "loading"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {usersQuery.data?.data.length ? (
              usersQuery.data.data.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-border bg-background/75 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{entry.name}</p>
                      <p className="text-sm text-muted-foreground">{entry.email}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{entry.role}</Badge>
                      <Badge variant={entry.status === "BANNED" ? "destructive" : "secondary"}>
                        {entry.status}
                      </Badge>
                      {entry.role === "ARTISAN" ? (
                        <Badge>{entry.artisanVerified ? "verified" : "pending verification"}</Badge>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedUserId((current) => current === entry.id ? null : entry.id)}
                    >
                      {selectedUserId === entry.id ? "Hide review" : "Review profile"}
                    </Button>
                    {entry.role === "ARTISAN" && !entry.artisanVerified ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          verifyArtisanMutation.mutate(entry.id, {
                            onSuccess: () => toast.success("Artisan verified."),
                            onError: (error) => toast.error(error.message || "Unable to verify artisan."),
                          })
                        }
                        disabled={verifyArtisanMutation.status === "pending"}
                      >
                        Verify artisan
                      </Button>
                    ) : null}
                    {entry.status === "ACTIVE" && entry.role !== "ADMIN" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          banUserMutation.mutate(entry.id, {
                            onSuccess: () => toast.success("User banned."),
                            onError: (error) => toast.error(error.message || "Unable to ban user."),
                          })
                        }
                        disabled={banUserMutation.status === "pending"}
                      >
                        Ban user
                      </Button>
                    ) : null}
                    {entry.status === "BANNED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          unbanUserMutation.mutate(entry.id, {
                            onSuccess: () => toast.success("User restored."),
                            onError: (error) => toast.error(error.message || "Unable to restore user."),
                          })
                        }
                        disabled={unbanUserMutation.status === "pending"}
                      >
                        Restore account
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 p-6 text-sm text-muted-foreground">
                No users are available right now.
              </div>
            )}
          </CardContent>
        </Card>

        {selectedUserId ? (
          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>Detailed user review</CardTitle>
              <CardDescription>
                Review identity, wallet state, recent transactions, and marketplace activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {detailQuery.data?.data ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-border bg-background/75 p-4">
                      <p className="text-sm text-muted-foreground">User</p>
                      <p className="mt-1 font-semibold text-foreground">{detailQuery.data.data.name}</p>
                      <p className="text-sm text-muted-foreground">{detailQuery.data.data.email}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/75 p-4">
                      <p className="text-sm text-muted-foreground">Last login</p>
                      <p className="mt-1 font-semibold text-foreground">{formatDate(detailQuery.data.data.lastLoginAt)}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/75 p-4">
                      <p className="text-sm text-muted-foreground">Wallet available</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {detailQuery.data.data.wallet ? formatCurrency(detailQuery.data.data.wallet.available) : "No wallet"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/75 p-4">
                      <p className="text-sm text-muted-foreground">Recent transactions</p>
                      <p className="mt-1 font-semibold text-foreground">{detailQuery.data.data.transactions.length}</p>
                    </div>
                  </div>

                  {detailQuery.data.data.artisanProfile ? (
                    <div className="rounded-2xl border border-border bg-background/75 p-4">
                      <p className="font-semibold text-foreground">Artisan profile</p>
                      <p className="mt-2 text-sm text-muted-foreground">{detailQuery.data.data.artisanProfile.bio || "No bio added yet."}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Skills: {detailQuery.data.data.artisanProfile.skills.join(", ") || "None listed"}
                      </p>
                    </div>
                  ) : null}

                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-background/75 p-4">
                      <p className="font-semibold text-foreground">Transactions</p>
                      <div className="mt-3 space-y-3">
                        {detailQuery.data.data.transactions.length ? detailQuery.data.data.transactions.map((transaction) => (
                          <div key={transaction.id} className="rounded-xl border border-border bg-white p-3 text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">{transaction.type}</p>
                            <p>{formatCurrency(transaction.amount)}</p>
                            <p>{formatDate(transaction.createdAt)}</p>
                          </div>
                        )) : <p className="text-sm text-muted-foreground">No recent transactions.</p>}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/75 p-4">
                      <p className="font-semibold text-foreground">Marketplace activity</p>
                      <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                        <p>Client jobs: {detailQuery.data.data.activity.clientJobs.length}</p>
                        <p>Artisan jobs: {detailQuery.data.data.activity.artisanJobs.length}</p>
                        <p>Client contracts: {detailQuery.data.data.activity.clientContracts.length}</p>
                        <p>Artisan contracts: {detailQuery.data.data.activity.artisanContracts.length}</p>
                        <p>Received reviews: {detailQuery.data.data.activity.receivedReviews.length}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Loading user detail...</p>
              )}
            </CardContent>
          </Card>
        ) : null}
      </main>
    </AppShell>
  );
}
