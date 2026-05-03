"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  ChevronRight, 
  Filter, 
  Search, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { useAdminContracts, useAdminContractStats } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContractStatus } from "@/types";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function AdminContractsWorkspace() {
  const [statusFilter] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats, isLoading: statsLoading } = useAdminContractStats();
  const { data: contracts, isLoading: contractsLoading } = useAdminContracts(statusFilter);

  const filteredContracts = contracts?.data.filter(c => 
    c.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.artisanName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* ── Stats Overview ────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">₦ {(stats?.totalVolume || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cumulative contract value
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Escrow</CardTitle>
              <Wallet className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">₦{(stats?.escrowVolume || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Funds held by platform
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.activeContractCount || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contracts currently in progress
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">₦{(stats?.averageValue || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per contract average
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Status Distribution ────────────────────────────────────── */}
      {!statsLoading && stats && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="grid gap-4 md:grid-cols-2"
        >
           <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Status breakdown</CardTitle>
              <CardDescription>Distribution of contracts by lifecycle state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
                      <span className="font-medium">{status.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Financial settlement</CardTitle>
              <CardDescription>Comparison of payouts and refunds</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center h-full pb-8">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-success">
                    <ArrowUpRight className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Payouts</span>
                  </div>
                  <div className="text-xl font-bold">₦{stats.payoutVolume.toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                   <div className="flex items-center justify-center gap-1 text-danger">
                    <ArrowDownRight className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Refunds</span>
                  </div>
                  <div className="text-xl font-bold">₦{stats.refundVolume.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Contract List ─────────────────────────────────────────── */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>System Contracts</CardTitle>
              <CardDescription>View and manage all live contracts on the platform</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contracts..."
                  className="pl-9 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Job / Project</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Parties</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contractsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-4 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                ) : filteredContracts?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground italic">
                      No contracts found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredContracts?.map((contract) => (
                    <tr key={contract.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                        {contract.id.split('-')[0].toUpperCase()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-foreground">{contract.jobTitle}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">{contract.currency} ESCROW</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs">
                          <span className="text-muted-foreground font-medium">C:</span> {contract.clientName}
                        </div>
                        <div className="text-xs mt-1">
                          <span className="text-muted-foreground font-medium">A:</span> {contract.artisanName}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-foreground">
                        ₦{contract.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className={`capitalize ${getStatusBg(contract.status)}`}>
                          {contract.status.toLowerCase().replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View details
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "FUNDED": return "bg-blue-500";
    case "ACTIVE":
    case "IN_PROGRESS": return "bg-success";
    case "DISPUTED": return "bg-danger";
    case "COMPLETED":
    case "PAID_OUT": return "bg-primary";
    case "CANCELLED": return "bg-muted-foreground";
    default: return "bg-muted";
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case "FUNDED": return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
    case "ACTIVE":
    case "IN_PROGRESS": return "bg-success-50 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-400";
    case "DISPUTED": return "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-900/30 dark:text-danger-400";
    case "COMPLETED":
    case "PAID_OUT": return "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400";
    case "CANCELLED": return "bg-muted text-muted-foreground border-border";
    default: return "bg-muted/50 text-muted-foreground";
  }
}
