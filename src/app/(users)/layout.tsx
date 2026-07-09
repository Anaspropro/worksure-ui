"use client";

import { useUser } from "@/features/auth";
import AppShell from "@/components/app-shell/AppShell";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { ChatSocketProvider } from "@/features/chat/providers/ChatSocketProvider";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userQuery = useUser();
  const user = userQuery.data;

  if (userQuery.isPending || !user) {
    return <DashboardLoadingState />;
  }

  return (
    <ChatSocketProvider>
      <AppShell user={user}>{children}</AppShell>
    </ChatSocketProvider>
  );
}
