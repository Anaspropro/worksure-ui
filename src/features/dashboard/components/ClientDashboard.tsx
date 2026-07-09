"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Plus, Search, FileText, Clock, Wallet, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";
import type { User } from "@/types";
import { useJobs } from "@/hooks/useJobs";
import { useProposals, useAcceptProposal } from "@/hooks/useProposals";
import { useContracts, useCreateContract, useFundContract, useConfirmCompletion, useReleaseEscrow } from "@/hooks/useContracts";
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

export default function ClientDashboard({ user }: { user: User }) {
  const [contractSearch, setContractSearch] = useState("");

  const { data: jobsResponse } = useJobs();
  const { data: proposalsResponse } = useProposals({ userId: user.id, role: "CLIENT" });
  const { data: contractsResponse } = useContracts();

  const jobs = (jobsResponse?.jobs ?? []).filter((j) => j.client?.id === user.id);
  const contracts = (contractsResponse?.data ?? []).filter((c) => c.clientId === user.id);
  
  const contractedJobIds = new Set(contracts.map((c) => c.job.id));
  const proposals = (proposalsResponse?.proposals ?? []).filter(
    (p) => !contractedJobIds.has(p.job.id)
  );

  const acceptProposalMutation = useAcceptProposal();
  const createContractMutation = useCreateContract();
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();

  const isBusy =
    acceptProposalMutation.status === "pending" ||
    createContractMutation.status === "pending" ||
    fundContractMutation.status === "pending" ||
    confirmCompletionMutation.status === "pending" ||
    releaseEscrowMutation.status === "pending";

  const activeContracts = contracts.filter((c) => c.status === "ACTIVE" || c.status === "IN_PROGRESS" || c.status === "FUNDED");
  const pendingPayments = contracts.filter((c) => c.status === "DRAFT" || c.status === "PENDING_PAYMENT");
  const completedContracts = contracts.filter((c) => c.status === "COMPLETED" || c.status === "PAID_OUT");
  const escrowReadyContracts = contracts.filter(
    (c) => c.status === "ACTIVE" && c.clientConfirmedCompletion && c.artisanConfirmedCompletion && !c.escrowReleased,
  );

  const totalSpent = completedContracts.reduce((sum, c) => sum + c.amount, 0);

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
            <h1 className="text-3xl font-bold truncate text-white">Client Dashboard</h1>
            <p className="mt-0.5 text-lg truncate text-white/90">Welcome back, {firstName} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-black/20 font-semibold"
            >
              <Link href="/jobs/create">
                <Plus className="size-4" /> Post a Job
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
                  Follow these steps to hire your first artisan with escrow protection.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/wallet" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <span className="flex-shrink-0 size-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">1</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Set up wallet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Add funds to your wallet for escrow payments.</p>
                </div>
              </Link>
              <Link href="/jobs/create" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <span className="flex-shrink-0 size-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">2</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Post a job</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Describe the work you need done and set a budget.</p>
                </div>
              </Link>
              <Link href="/jobs" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <span className="flex-shrink-0 size-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">3</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Review proposals</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Artisans will apply with their price and plan.</p>
                </div>
              </Link>
              <Link href="/contracts" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <span className="flex-shrink-0 size-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">4</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Create contract</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Accept a proposal and fund secure escrow.</p>
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
          label="Pending Payments"
          value={pendingPayments.length}
          sub="View all"
          icon={Clock}
          iconBg="bg-warning/10"
          iconColor="text-warning"
        />
        <StatCard
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          sub="View all"
          icon={Wallet}
          iconBg="bg-violet-500/10"
          iconColor="text-violet-500"
        />
        <StatCard
          label="Completed"
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
                  onFund={() =>
                    fundContractMutation.mutate(
                      { contractId: contract.id, email: user.email, callbackUrl: window.location.href },
                      {
                        onSuccess: () => toast.success("Contract funded."),
                        onError: (e) => toast.error(e.message || "Unable to fund."),
                      },
                    )
                  }
                  onConfirm={(isClient) =>
                    confirmCompletionMutation.mutate(
                      { contractId: contract.id, isClient },
                      {
                        onSuccess: () => toast.success("Confirmed."),
                        onError: (e) => toast.error(e.message || "Unable to confirm."),
                      },
                    )
                  }
                  onRelease={() =>
                    releaseEscrowMutation.mutate(contract.id, {
                      onSuccess: () => toast.success("Escrow released."),
                      onError: (e) => toast.error(e.message || "Unable to release."),
                    })
                  }
                />
              ))
            ) : (
              <div className="flex flex-col items-center py-12 text-center text-muted-foreground gap-3">
                <FileText className="size-10 opacity-25" />
                <p className="text-sm">No contracts yet.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/jobs/create">Post a job to get started</Link>
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
                      { icon: ShieldCheck, iconColor: "text-success", iconBg: "bg-success/10", title: `Contract created`, sub: c.job.title, time: "recently" },
                      { icon: Wallet, iconColor: "text-primary", iconBg: "bg-primary/10", title: `Escrow funded`, sub: formatCurrency(c.amount), time: "recently" },
                      { icon: TrendingUp, iconColor: "text-violet-500", iconBg: "bg-violet-500/10", title: `Work in progress`, sub: c.job.title, time: "recently" },
                      { icon: CheckCircle2, iconColor: "text-success", iconBg: "bg-success/10", title: `Completed`, sub: c.job.title, time: "recently" },
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
            <Card className="border-border bg-primary/5 hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Search className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Find Talent</h3>
                    <p className="text-xs text-muted-foreground mt-1">Post a job and get proposals from verified artisans.</p>
                    <Button asChild size="sm" className="mt-3 h-8 text-xs shadow-sm shadow-primary/15">
                      <Link href="/jobs/create">Post a New Job</Link>
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
                    <p className="text-xs text-muted-foreground mt-1">Your payments are in escrow. Funds are only released when both parties confirm completion.</p>
                    {escrowReadyContracts.length > 0 && (
                      <Badge variant="warning" className="mt-2">
                        {escrowReadyContracts.length} ready to release
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Client's Own Jobs Grid */}
      {jobs.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Your Jobs</CardTitle>
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

      {/* Proposals list */}
      {proposals && proposals.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Proposals Received</CardTitle>
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
                  {proposal.status === "PENDING" && (
                    <div className="flex gap-1.5 justify-end mt-1.5">
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() =>
                          acceptProposalMutation.mutate(proposal.id, {
                            onSuccess: () => toast.success("Proposal accepted."),
                            onError: (e) => toast.error(e.message),
                          })
                        }
                        disabled={isBusy}
                      >
                        Accept
                      </Button>
                    </div>
                  )}
                  {proposal.status === "ACCEPTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs mt-1.5"
                      onClick={() =>
                        createContractMutation.mutate(proposal.id, {
                          onSuccess: () => toast.success("Contract created."),
                          onError: (e) => toast.error(e.message),
                        })
                      }
                      disabled={isBusy}
                    >
                      Create contract
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
