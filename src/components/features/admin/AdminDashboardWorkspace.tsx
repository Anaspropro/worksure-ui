"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  Users, 
  ShieldAlert, 
  Scale, 
  Flag, 
  ChevronRight, 
  Activity, 
  Wallet, 
  FileText,
  AlertTriangle
} from "lucide-react";
import { useAdminReports } from "@/hooks/useAdmin";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

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

  return (
    <motion.main 
      className="space-y-6 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero Section ── */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-border bg-card shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          
          <CardHeader className="relative z-10 pb-8 pt-10 px-8">
            <CardTitle className="text-3xl font-bold tracking-tight mb-2">
              Operations Center
            </CardTitle>
            <CardDescription className="max-w-2xl text-base text-muted-foreground leading-relaxed">
              Monitor platform health, resolve disputes, and verify artisans from a single, unified operational dashboard. Keep the marketplace running smoothly.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* ── Quick Stats Grid ── */}
      <motion.section variants={containerVariants} className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/60 hover:bg-card/60 transition-colors shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="size-5 text-primary" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
              <p className="text-3xl font-bold text-foreground">
                {usersCount}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/60 hover:bg-card/60 transition-colors shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <ShieldAlert className="size-5 text-warning" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending KYC</p>
              <p className="text-3xl font-bold text-foreground">
                {pendingArtisansCount}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/60 hover:bg-card/60 transition-colors shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-danger/10 rounded-lg">
                  <Scale className="size-5 text-danger" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Open Disputes</p>
              <p className="text-3xl font-bold text-foreground">
                {openDisputesCount}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/60 hover:bg-card/60 transition-colors shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Flag className="size-5 text-destructive" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Flagged Jobs</p>
              <p className="text-3xl font-bold text-foreground">
                {report?.totals.flaggedJobs ?? 0}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* ── Main Content Grid ── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Moderation Priorities */}
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

        {/* Platform Snapshot */}
        <motion.div variants={itemVariants} className="flex flex-col">
          <Card className="border-border/60 bg-card shadow-sm flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                Platform Snapshot
              </CardTitle>
              <CardDescription>
                High-level metrics and financial health of the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {report ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border/50 bg-background/50 p-4 hover:bg-background/80 transition-colors">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Users className="size-4" />
                      <span className="text-sm font-medium">Total Users</span>
                    </div>
                    <p className="text-2xl font-semibold">{report.totals.users}</p>
                  </div>
                  
                  <div className="rounded-xl border border-border/50 bg-background/50 p-4 hover:bg-background/80 transition-colors">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <FileText className="size-4" />
                      <span className="text-sm font-medium">Active Jobs</span>
                    </div>
                    <p className="text-2xl font-semibold">{report.totals.activeJobs}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-background/50 p-4 hover:bg-background/80 transition-colors">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Scale className="size-4" />
                      <span className="text-sm font-medium">Open Disputes</span>
                    </div>
                    <p className="text-2xl font-semibold">{report.totals.openDisputes}</p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-primary/5 p-4 hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Wallet className="size-4" />
                      <span className="text-sm font-medium">Platform Fees</span>
                    </div>
                    <p className="text-2xl font-semibold text-primary">
                      NGN {report.totals.platformFees.toLocaleString()}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-xl border border-border/50 bg-gradient-to-r from-success/10 to-success/5 p-4 hover:from-success/15 hover:to-success/10 transition-colors">
                    <div className="flex items-center gap-2 text-success mb-2">
                      <Activity className="size-4" />
                      <span className="text-sm font-medium">Total System Value (Wallet + Escrow)</span>
                    </div>
                    <p className="text-2xl font-semibold text-success">
                      NGN {(report.totals.totalSystemValue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-muted-foreground">
                  <Activity className="size-8 mb-2 opacity-20" />
                  <p className="text-sm">No report data available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.main>
  );
}
