"use client";

import AppShell from "@/components/app-shell/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminUsers, useBanUser, useUnbanUser, useVerifyArtisan } from "@/hooks/useAdmin";
import { useUser } from "@/hooks/useAuth";
import { formatDate } from "@/lib/formatters";

export default function AdminUsersWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const usersQuery = useAdminUsers();
  const verifyArtisanMutation = useVerifyArtisan();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();

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
                    {entry.role === "ARTISAN" && !entry.artisanVerified ? (
                      <Button
                        size="sm"
                        onClick={() => verifyArtisanMutation.mutate(entry.id)}
                        disabled={verifyArtisanMutation.status === "pending"}
                      >
                        Verify artisan
                      </Button>
                    ) : null}
                    {entry.status === "ACTIVE" && entry.role !== "ADMIN" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => banUserMutation.mutate(entry.id)}
                        disabled={banUserMutation.status === "pending"}
                      >
                        Ban user
                      </Button>
                    ) : null}
                    {entry.status === "BANNED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => unbanUserMutation.mutate(entry.id)}
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
      </main>
    </AppShell>
  );
}
