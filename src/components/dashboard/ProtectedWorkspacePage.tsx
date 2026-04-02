"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell/AppShell";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { useUser } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProtectedWorkspacePage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const router = useRouter();
  const userQuery = useUser();
  const user = userQuery.data;

  useEffect(() => {
    if (userQuery.isLoading) return;

    if (!user) {
      router.replace("/auth/login");
    }
  }, [router, user, userQuery.isLoading]);

  if (userQuery.isLoading || !user) {
    return <DashboardLoadingState />;
  }

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <Card className="border border-border bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">{title}</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              {description}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border border-dashed border-border bg-white/80 shadow-sm">
          <CardContent className="px-6 py-8 text-sm leading-7 text-text-secondary">
            This page now has a routed place in the app shell. The next implementation slice can
            connect it to the backend and move it beyond placeholder status.
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
