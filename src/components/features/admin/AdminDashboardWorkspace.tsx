"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ChevronRight, AlertTriangle} from "lucide-react";
import { useAdminReports } from "@/hooks/useAdmin";
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

      {/* <div>
        <Card></Card>
      </div> */}

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
