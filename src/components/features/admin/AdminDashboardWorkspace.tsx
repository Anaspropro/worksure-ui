"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ChevronRight, AlertTriangle, Users, Wallet, Lock, Activity } from "lucide-react";
import { useAdminReports } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/formatters";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import AdminMonitoringWorkspace from "./AdminMonitoringWorkspace";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

export default function AdminDashboardWorkspace() {
  const reportsQuery = useAdminReports("overview");
  const report = reportsQuery.data;

  const usersCount = report?.totals.users ?? 0;
  const pendingArtisansCount = report?.totals.pendingArtisansCount ?? 0;
  const openDisputesCount = report?.totals.openDisputes ?? 0;
  const pendingPayoutsCount = report?.totals.pendingPayoutsCount ?? 0;
  
  const totalSystemValue = report?.totals.totalSystemValue ?? 0;
  const lockedInEscrow = report?.totals.lockedInEscrow ?? 0;
  const platformFees = report?.totals.platformFees ?? 0;

  return (
    <motion.main 
      className="space-y-6 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero Section ── */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-border bg-card shadow-lg">
          <CardHeader className="relative z-10 px-6">
            <CardTitle className="text-3xl font-bold tracking-tight mb-2">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="max-w-2xl text-base text-muted-foreground leading-relaxed">
              Monitor platform health, resolve disputes, and verify artisans from a single, unified operational dashboard. Keep the marketplace running smoothly.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* ── Platform Snapshot Cards ── */}
      <motion.div 
        variants={itemVariants} 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered platform users
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value in System
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSystemValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined wallets and escrow
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Locked in Escrow
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
              <Lock className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(lockedInEscrow)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active contracts funding
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Platform Fees Generated
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(platformFees)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All-time revenue collected
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Main Content Grid ── */}
      <motion.div variants={itemVariants} className="flex flex-col h-full">
        <Card className="border-border/60 bg-card shadow-sm flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="size-5 text-warning" />
              Action Required
            </CardTitle>
            <CardDescription>
              Tasks that require immediate admin intervention.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="divide-y divide-border/40 flex-1">
              <div className="p-5 flex items-start justify-between group hover:bg-muted/10 transition-colors">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    Identity Verification
                    {pendingArtisansCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger/10 text-[11px] font-bold text-danger">
                        {pendingArtisansCount}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-[280px]">
                    Artisans are waiting for their KYC documents to be verified before they can accept jobs.
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href="/admin/users">
                    Review <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="p-5 flex items-start justify-between group hover:bg-muted/10 transition-colors">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    Dispute Resolution
                    {openDisputesCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger/10 text-[11px] font-bold text-danger">
                        {openDisputesCount}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-[280px]">
                    Contracts in dispute require arbitration. Escrow funds are locked until resolved.
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href="/admin/disputes">
                    Resolve <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>

              <div className="p-5 flex items-start justify-between group hover:bg-muted/10 transition-colors">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    Payout Processing
                    {pendingPayoutsCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger/10 text-[11px] font-bold text-danger">
                        {pendingPayoutsCount}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-[280px]">
                    Completed contracts are awaiting manual or automated payout to artisans.
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href="/admin/payouts">
                    Process <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>  

      <AdminMonitoringWorkspace />
    </motion.main>
  );
}
