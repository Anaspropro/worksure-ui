"use client";

import AppShell from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/hooks/useAuth";
import {
  useDeleteNotification,
  useMyNotifications,
  useNotificationStats,
} from "@/hooks/useNotifications";
import { formatDate } from "@/lib/formatters";

export default function NotificationsWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const notificationsQuery = useMyNotifications();
  const notificationStatsQuery = useNotificationStats();
  const deleteNotificationMutation = useDeleteNotification();

  if (!user) {
    return null;
  }

  const notifications = notificationsQuery.data ?? [];
  const stats = notificationStatsQuery.data;

  return (
    <main className="space-y-6">
      <Card className="border-border/80 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Notifications</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            Track proposal, contract, dispute, and review events without losing the audit trail of what changed.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-semibold text-foreground">{stats?.total ?? 0}</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">Unread</p>
            <p className="text-3xl font-semibold text-foreground">{stats?.unread ?? 0}</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">Archived</p>
            <p className="text-3xl font-semibold text-foreground">{stats?.archived ?? 0}</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-border/80 bg-white">
        <CardHeader>
          <CardTitle>Event feed</CardTitle>
          <CardDescription>Important state changes appear here with priority and timestamp context.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.length ? (
            notifications.map((notification) => (
              <div key={notification.id} className="rounded-lg border border-border bg-background/75 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  <StatusBadge status={notification.priority} />
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{notification.type}</span>
                  <span>{formatDate(notification.createdAt)}</span>
                  <span>{notification.isRead ? "Read" : "Unread"}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {notification.actionUrl ? (
                    <Button asChild size="sm" variant="outline">
                      <a href={notification.actionUrl}>Open related page</a>
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNotificationMutation.mutate(notification.id)}
                    disabled={deleteNotificationMutation.status === "pending"}
                  >
                    Archive
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-surface-muted/50 p-6 text-sm text-muted-foreground">
              No notifications yet. Proposal and contract activity will begin appearing here as events happen.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
