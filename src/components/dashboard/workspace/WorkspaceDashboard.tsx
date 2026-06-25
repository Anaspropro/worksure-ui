"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import type { User, Contract, Job } from "@/types";
import { useJobs } from "@/hooks/useJobs";
import { useProposals, useCreateProposal, useAcceptProposal } from "@/hooks/useProposals";
import {
  useContracts,
  useCreateContract,
  useFundContract,
  useConfirmCompletion,
  useReleaseEscrow,
  useRefundContract,
} from "@/hooks/useContracts";
import { motion } from "framer-motion";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  Wallet,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/components/dashboard/workspace/format";
import dynamic from "next/dynamic";

const AdminWorkspaceSection = dynamic(() => import("@/components/dashboard/workspace/AdminWorkspaceSection"), { ssr: false });

/* ── Shared animation helpers ───────────────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ── Stat card ──────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
  index,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
    >
      <Card className="group relative overflow-hidden border-border bg-gradient-to-br from-card to-muted/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="relative p-5 flex items-start justify-between gap-4 z-10">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {sub && (
              <p className="text-xs text-primary/80 font-medium cursor-pointer hover:text-primary transition-colors flex items-center gap-1">
                {sub} <ChevronRight className="size-3" />
              </p>
            )}
          </div>
          <div className={`rounded-2xl ${iconBg} p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ring-1 ring-black/5 dark:ring-white/5`}>
            <Icon className={`size-5 ${iconColor}`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Contract row ───────────────────────────────────────────── */
function ContractRow({ contract, user, onFund, onConfirm, onRelease, isBusy }: {
  contract: Contract;
  user: User;
  onFund: () => void;
  onConfirm: (isClient: boolean) => void;
  onRelease: () => void;
  isBusy: boolean;
}) {
  const isClient = user.id === contract.clientId;

  return (
    <motion.div
      variants={fadeUp}
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/30 hover:bg-primary/3 transition-all cursor-pointer"
    >
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <FileText className="size-5 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm text-foreground truncate">{contract.job.title}</p>
          <StatusBadge status={contract.status} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isClient ? `with ${contract.artisan?.name}` : `via ${contract.client?.name}`}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-foreground">{formatAmount(contract.amount)}</p>
        {contract.status === "DRAFT" && isClient && (
          <Button size="sm" className="mt-1.5 h-7 text-xs shadow-sm" onClick={onFund} disabled={isBusy}>
            Fund
          </Button>
        )}
        {contract.status === "ACTIVE" && isClient && !contract.clientConfirmedCompletion && (
          <Button size="sm" variant="outline" className="mt-1.5 h-7 text-xs bg-background" onClick={() => onConfirm(true)} disabled={isBusy}>
            Confirm
          </Button>
        )}
        {contract.status === "ACTIVE" && !isClient && !contract.artisanConfirmedCompletion && (
          <Button size="sm" variant="outline" className="mt-1.5 h-7 text-xs bg-background" onClick={() => onConfirm(false)} disabled={isBusy}>
            Submit work
          </Button>
        )}
        {contract.status === "ACTIVE" && contract.clientConfirmedCompletion && contract.artisanConfirmedCompletion && !contract.escrowReleased && isClient && (
          <Button size="sm" className="mt-1.5 h-7 text-xs shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onRelease} disabled={isBusy}>
            Release
          </Button>
        )}
      </div>

      <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    </motion.div>
  );
}

/* ── Recent activity item ───────────────────────────────────── */
function ActivityItem({ icon: Icon, iconColor, iconBg, title, sub, time }: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  sub: string;
  time: string;
}) {
  return (
    <motion.div variants={fadeUp} className="relative flex items-start gap-4 pb-6 last:pb-0 group">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border group-last:hidden" />
      
      <div className={`relative z-10 size-8 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 ring-4 ring-card`}>
        <Icon className={`size-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0 pt-1.5">
        <div className="flex justify-between items-start gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex-shrink-0 bg-muted/50 px-2 py-0.5 rounded-full">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}

/* ── Job row ────────────────────────────────────────────────── */
function JobRow({ job }: { job: Job }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/30 hover:bg-primary/3 transition-all"
    >
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <BriefcaseBusiness className="size-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">{job.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{job.description}</p>
      </div>
      <div className="text-right flex-shrink-0 space-y-1">
        <p className="text-sm font-bold">{formatAmount(job.budget)}</p>
        <StatusBadge status={job.status} />
      </div>
      <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    </motion.div>
  );
}

/* ── Main WorkspaceDashboard ─────────────────────────────────── */
export default function WorkspaceDashboard({
  roleView,
  user,
}: {
  roleView: User["role"];
  user: User;
}) {
  const [proposalJobId, setProposalJobId] = useState("");
  const [proposalAmountInput, setProposalAmountInput] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [contractSearch, setContractSearch] = useState("");

  const proposalAmount = Number(proposalAmountInput || 0);

  const { data: jobsResponse } = useJobs();
  const { data: proposalsResponse } = useProposals({ userId: user.id, role: roleView });
  const { data: contractsResponse } = useContracts();

  const jobs = jobsResponse?.jobs ?? [];
  const contracts = contractsResponse?.data ?? [];
  
  const contractedJobIds = new Set(contracts.map((c) => c.job.id));
  const proposals = (proposalsResponse?.proposals ?? []).filter(
    (p) => !contractedJobIds.has(p.job.id)
  );

  const createProposalMutation = useCreateProposal();
  const acceptProposalMutation = useAcceptProposal();
  const createContractMutation = useCreateContract();
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();
  const refundContractMutation = useRefundContract();

  const isBusy =
    createProposalMutation.status === "pending" ||
    acceptProposalMutation.status === "pending" ||
    createContractMutation.status === "pending" ||
    fundContractMutation.status === "pending" ||
    confirmCompletionMutation.status === "pending" ||
    releaseEscrowMutation.status === "pending" ||
    refundContractMutation.status === "pending";

  const visibleJobs = roleView === "CLIENT"
    ? jobs.filter((j) => j.client?.id === user.id)
    : jobs;

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

  const handleSubmitProposal = () => {
    const toastId = toast.loading("Submitting proposal...");
    createProposalMutation.mutate(
      { jobId: proposalJobId, amount: proposalAmount, message: proposalMessage.trim() },
      {
        onSuccess: () => {
          toast.success("Proposal submitted.", { id: toastId });
          setProposalJobId(""); setProposalAmountInput(""); setProposalMessage("");
        },
        onError: (e) => toast.error(e.message || "Unable to submit.", { id: toastId }),
      },
    );
  };

  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* ── Header row ── */}
      <motion.div
        className="relative overflow-hidden rounded-xl border border-white/10 bg-[var(--brand-hero-via)] px-6 py-2 text-white shadow-[0_30px_80px_-55px_rgba(15,23,42,0.75)]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >

        <div className="relative flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4 text-secondary-foreground">
          <div className="min-w-0 pr-4">
            <h1 className="text-3xl font-bold truncate text-white">Dashboard</h1>
            <p className="mt-0.5 text-lg truncate text-white/90">Welcome back, {firstName} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            {roleView === "CLIENT" && (
              <Button
                asChild
                size="sm"
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-black/20 font-semibold"
              >
                <Link href="/jobs/create">
                  <Plus className="size-4" /> Post a Job
                </Link>
              </Button>
            )}
            {roleView === "ARTISAN" && (
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
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Getting Started Onboarding ── */}
      {(!contracts || contracts.length === 0) && roleView !== "ADMIN" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Getting Started</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {roleView === "CLIENT"
                      ? "Follow these steps to hire your first artisan with escrow protection."
                      : "Complete these steps to start earning on WorkSure."}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {roleView === "CLIENT" ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Stat cards ── */}
      <motion.div
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          label="Active Contracts"
          value={activeContracts.length}
          sub="View all"
          icon={FileText}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          index={0}
        />
        <StatCard
          label="Pending Payments"
          value={pendingPayments.length}
          sub="View all"
          icon={Clock}
          iconBg="bg-warning/10"
          iconColor="text-warning"
          index={1}
        />
        <StatCard
          label="Total Spent"
          value={formatAmount(totalSpent)}
          sub="View all"
          icon={Wallet}
          iconBg="bg-violet-500/10"
          iconColor="text-violet-500"
          index={2}
        />
        <StatCard
          label="Completed"
          value={completedContracts.length}
          sub="View all"
          icon={CheckCircle2}
          iconBg="bg-success/10"
          iconColor="text-success"
          index={3}
        />
      </motion.div>

      {/* ── Role-specific forms ── */}
      {/* {roleView === "ARTISAN" && (
        <ArtisanWorkspaceSection
          jobs={jobs}
          proposalJobId={proposalJobId}
          proposalAmountInput={proposalAmountInput}
          proposalMessage={proposalMessage}
          setProposalJobId={setProposalJobId}
          setProposalAmountInput={setProposalAmountInput}
          setProposalMessage={setProposalMessage}
          onSubmitProposal={handleSubmitProposal}
          isBusy={isBusy}
          formatAmount={formatAmount}
          artisanVerified={Boolean(user.artisanVerified)}
        />
      )} */}
      {roleView === "ADMIN" && <AdminWorkspaceSection />}

      {/* ── Main content: Contracts + Activity ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Active Contracts */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
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
              {/* Search */}
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
                  {roleView === "CLIENT" && (
                    <Button asChild size="sm" variant="outline">
                      <Link href="/jobs/create">Post a job to get started</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column: Recent activity + CTA */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
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
                        { icon: Wallet, iconColor: "text-primary", iconBg: "bg-primary/10", title: `Escrow funded`, sub: formatAmount(c.amount), time: "recently" },
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
          </motion.div>

          {/* CTA cards */}
          <motion.div
            className="grid gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {roleView === "CLIENT" && (
              <Card className="border-border bg-gradient-to-br from-primary/8 to-primary/3 hover:shadow-md transition-shadow cursor-pointer group">
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
            )}
            {roleView === "ARTISAN" && (
              <Card className="border-border bg-gradient-to-br from-blue-500/8 to-blue-500/3 hover:shadow-md transition-shadow cursor-pointer group">
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
            )}
            <Card className="border-border bg-gradient-to-br from-success/8 to-success/3 hover:shadow-md transition-shadow cursor-pointer">
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
          </motion.div>
        </div>
      </div>

      {/* ── Jobs grid ── */}
      {visibleJobs.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">
                  {roleView === "CLIENT" ? "Your Jobs" : "Open Jobs"}
                </CardTitle>
                <Badge variant="secondary" className="rounded-full">{visibleJobs.length}</Badge>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-primary h-8 px-2 gap-1">
                <Link href="/jobs">
                  View all <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {visibleJobs.slice(0, 2).map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Proposals (artisan/client) ── */}
      {proposals && proposals.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">Proposals</CardTitle>
                <Badge variant="secondary" className="rounded-full">{proposals.length}</Badge>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-primary h-8 px-2 gap-1">
                <Link href="/jobs">
                  View all <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {proposals.slice(0, 2).map((proposal) => (
                <motion.div
                  key={proposal.id}
                  variants={fadeUp}
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
                    <p className="text-sm font-bold">{formatAmount(proposal.amount)}</p>
                    <StatusBadge status={proposal.status} />
                    {roleView === "CLIENT" && proposal.status === "PENDING" && (
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
                    {roleView === "CLIENT" && proposal.status === "ACCEPTED" && (
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
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
