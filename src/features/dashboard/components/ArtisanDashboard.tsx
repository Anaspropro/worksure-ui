"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Search, FileText, Clock, Wallet, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, AlertCircle, Award } from "lucide-react";
import type { User } from "@/types";
import { useJobs } from "@/features/jobs/api/useJobs";
import { useProposals } from "@/features/jobs/api/useProposals";
import { useContracts, useConfirmCompletion } from "@/features/contracts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { ContractRow } from "@/features/contracts/components/ContractRow";
import { ActivityItem } from "@/features/dashboard/components/ActivityItem";
import { JobRow } from "@/features/jobs/components/JobRow";
import { formatCurrency } from "@/lib/formatters";

export default function ArtisanDashboard({ user }: { user: User }) {
  const [contractSearch, setContractSearch] = useState("");

  const { data: jobsResponse } = useJobs();
  const { data: proposalsResponse } = useProposals({ userId: user.id, role: "ARTISAN" });
  const { data: contractsResponse } = useContracts();

  const jobs = Array.isArray(jobsResponse?.jobs) ? jobsResponse.jobs : [];
  const contracts = (Array.isArray(contractsResponse?.data) ? contractsResponse.data : []).filter((c) => c.artisanId === user.id);
  
  const contractedJobIds = new Set(contracts.map((c) => c.job.id));
  const proposals = (Array.isArray(proposalsResponse?.proposals) ? proposalsResponse.proposals : []).filter(
    (p) => !contractedJobIds.has(p.job.id)
  );

  const confirmCompletionMutation = useConfirmCompletion();

  const isBusy = confirmCompletionMutation.status === "pending";

  const activeContracts = contracts.filter((c) => c.status === "ACTIVE" || c.status === "IN_PROGRESS" || c.status === "FUNDED");
  const pendingPayments = contracts.filter((c) => c.status === "DRAFT" || c.status === "PENDING_PAYMENT");
  const completedContracts = contracts.filter((c) => c.status === "COMPLETED" || c.status === "PAID_OUT");
  const escrowReadyContracts = contracts.filter(
    (c) => c.status === "ACTIVE" && c.clientConfirmedCompletion && c.artisanConfirmedCompletion && !c.escrowReleased,
  );

  const totalEarnings = completedContracts.reduce((sum, c) => sum + c.amount, 0);

  const filteredContracts = contracts.filter((c) =>
    contractSearch === "" || c.job.title.toLowerCase().includes(contractSearch.toLowerCase()),
  );

  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[var(--brand-hero-via)] px-6 py-2 text-white shadow-[0_30px_80px_-55px_rgba(15,23,42,0.75)]">
        <div className="relative flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4 text-secondary-foreground">
          <div className="min-w-0 pr-4">
            <h1 className="text-3xl font-bold truncate text-white">Artisan Dashboard</h1>
            <p className="mt-0.5 text-lg truncate text-white/90">Welcome back, {firstName} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-primary text-white shadow-lg"
            >
              <Link href="/jobs">
                <Search className="size-4 mr-1.5" /> Browse Jobs
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Onboarding Checklist */}
      {(!contracts || contracts.length === 0) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Getting Started</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Complete these steps to start earning on WorkSure.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/kyc/status" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <span className="flex-shrink-0 size-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">1</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Get verified</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Complete KYC to unlock proposal submission.</p>
                </div>
              </Link>
              <Link href="/jobs" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <span className="flex-shrink-0 size-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">2</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Browse jobs</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Find work that matches your skills.</p>
                </div>
              </Link>
              <Link href="/jobs" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <span className="flex-shrink-0 size-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">3</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Submit proposals</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Send your price and delivery plan.</p>
                </div>
              </Link>
              <Link href="/contracts" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <span className="flex-shrink-0 size-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">4</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Get paid</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Escrow guarantees payment on completion.</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Contracts"
          value={activeContracts.length}
          sub="View all"
          icon={FileText}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          label="Pending Earnings"
          value={pendingPayments.length}
          sub="View all"
          icon={Clock}
          iconBg="bg-warning/10"
          iconColor="text-warning"
        />
        <StatCard
          label="Total Earnings"
          value={formatCurrency(totalEarnings)}
          sub="View all"
          icon={Wallet}
          iconBg="bg-violet-500/10"
          iconColor="text-violet-500"
        />
        <StatCard
          label="Completed Jobs"
          value={completedContracts.length}
          sub="View all"
          icon={CheckCircle2}
          iconBg="bg-success/10"
          iconColor="text-success"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Active Contracts */}
        <Card className="border-border bg-card h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Active Contracts</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-primary h-8 px-2 gap-1">
              <Link href="/contracts">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                value={contractSearch}
                onChange={(e) => setContractSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/40 border-border"
              />
            </div>

            {filteredContracts.length > 0 ? (
              filteredContracts.slice(0, 2).map((contract) => (
                <ContractRow
                  key={contract.id}
                  contract={contract}
                  user={user}
                  isBusy={isBusy}
                  onFund={() => {}}
                  onConfirm={(isClient) =>
                    confirmCompletionMutation.mutate(
                      { contractId: contract.id, isClient },
                      {
                        onSuccess: () => toast.success("Work submitted."),
                        onError: (e) => toast.error(e.message || "Unable to submit work."),
                      },
                    )
                  }
                  onRelease={() => {}}
                />
              ))
            ) : (
              <div className="flex flex-col items-center py-12 text-center text-muted-foreground gap-3">
                <FileText className="size-10 opacity-25" />
                <p className="text-sm">No contracts yet.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/jobs">Browse jobs to find work</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Sidebar: Recent Activity + CTA */}
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contracts && contracts.length > 0 ? (
                <>
                  {contracts.slice(0, 4).map((c, i) => {
                    const items = [
                      { icon: ShieldCheck, iconColor: "text-success", iconBg: "bg-success/10", title: `Contract active`, sub: c.job.title, time: "recently" },
                      { icon: Wallet, iconColor: "text-primary", iconBg: "bg-primary/10", title: `Earnings secured`, sub: formatCurrency(c.amount), time: "recently" },
                      { icon: TrendingUp, iconColor: "text-violet-500", iconBg: "bg-violet-500/10", title: `Work ongoing`, sub: c.job.title, time: "recently" },
                      { icon: CheckCircle2, iconColor: "text-success", iconBg: "bg-success/10", title: `Job completed`, sub: c.job.title, time: "recently" },
                    ];
                    const item = items[i % items.length];
                    return <ActivityItem key={c.id} {...item} />;
                  })}
                </>
              ) : (
                <div className="flex flex-col items-center py-8 text-center text-muted-foreground gap-2">
                  <Clock className="size-8 opacity-25" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-3">
            <Card className="border-border bg-blue-500/5 hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                    <Award className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Trust Signals</h3>
                    <p className="text-xs text-muted-foreground mt-1">Verify your identity to increase trust and win more jobs.</p>
                    <Button asChild size="sm" className="mt-3 h-8 text-xs shadow-sm shadow-blue-500/15 bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href="/kyc/status">{user.artisanVerified ? "View Verification" : "Get Verified"}</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-success/5 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="size-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Escrow Protection</h3>
                    <p className="text-xs text-muted-foreground mt-1">Funds are secured in escrow before you start working, guaranteeing payment on project completion.</p>
                    {escrowReadyContracts.length > 0 && (
                      <Badge variant="warning" className="mt-2">
                        {escrowReadyContracts.length} ready for release
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Available Jobs list */}
      {jobs.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Open Jobs</CardTitle>
              <Badge variant="secondary" className="rounded-full">{jobs.length}</Badge>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary h-8 px-2 gap-1">
              <Link href="/jobs">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {jobs.slice(0, 2).map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Submitted Proposals */}
      {proposals && proposals.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Your Active Proposals</CardTitle>
              <Badge variant="secondary" className="rounded-full">{proposals.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {proposals.slice(0, 2).map((proposal) => (
              <div
                key={proposal.id}
                className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-all"
              >
                <div className="size-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="size-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{proposal.job.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{proposal.message.slice(0, 80)}…</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1.5">
                  <p className="text-sm font-bold">{formatCurrency(proposal.amount)}</p>
                  <StatusBadge status={proposal.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
