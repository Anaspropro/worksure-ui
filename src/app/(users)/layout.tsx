"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useAuth";
import AppShell from "@/components/app-shell/AppShell";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userQuery = useUser();
  const user = userQuery.data;
  const router = useRouter();

  useEffect(() => {
    if (!userQuery.isLoading && (!user || user.role === "ADMIN")) {
      // Admins should go to /admin, unauthenticated → login
      router.replace(user?.role === "ADMIN" ? "/admin" : "/auth/login");
    }
  }, [user, userQuery.isLoading, router]);

  if (userQuery.isLoading || !user || user.role === "ADMIN") {
    return <DashboardLoadingState />;
  }

  return <AppShell user={user}>{children}</AppShell>;
}
