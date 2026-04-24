"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import type { User, Contract, Job, Proposal } from "@/types";
import { useJobs, useCreateJob } from "@/hooks/useJobs";
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
import ClientWorkspaceSection from "@/components/dashboard/workspace/ClientWorkspaceSection";
import ArtisanWorkspaceSection from "@/components/dashboard/workspace/ArtisanWorkspaceSection";
import AdminWorkspaceSection from "@/components/dashboard/workspace/AdminWorkspaceSection";

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
      <Card className="border-border bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {sub && (
              <p className="text-xs text-primary font-medium cursor-pointer hover:underline">{sub}</p>
            )}
          </div>
          <div className={`rounded-xl ${iconBg} p-3 flex-shrink-0`}>
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
          {isClient ? `with ${contract.proposal.artisan.name}` : `via ${contract.proposal.client.name}`}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-foreground">{formatAmount(contract.amount)}</p>
        {contract.status === "DRAFT" && isClient && (
          <Button size="sm" className="mt-1.5 h-7 text-xs" onClick={onFund} disabled={isBusy}>
            Fund
          </Button>
        )}
        {contract.status === "ACTIVE" && isClient && !contract.clientConfirmedCompletion && (
          <Button size="sm" variant="outline" className="mt-1.5 h-7 text-xs" onClick={() => onConfirm(true)} disabled={isBusy}>
            Confirm
          </Button>
        )}
        {contract.status === "ACTIVE" && !isClient && !contract.artisanConfirmedCompletion && (
          <Button size="sm" variant="outline" className="mt-1.5 h-7 text-xs" onClick={() => onConfirm(false)} disabled={isBusy}>
            Submit work
          </Button>
        )}
        {contract.status === "ACTIVE" && contract.clientConfirmedCompletion && contract.artisanConfirmedCompletion && !contract.escrowReleased && isClient && (
          <Button size="sm" className="mt-1.5 h-7 text-xs bg-success hover:bg-success/90" onClick={onRelease} disabled={isBusy}>
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
    <motion.div variants={fadeUp} className="flex items-start gap-3">
      <div className={`size-8 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`size-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
      <p className="text-xs text-muted-foreground flex-shrink-0">{time}</p>
    </motion.div>
  );
}

/* ── Job row ────────────────────────────────────────────────── */
function JobRow({ job, onBrowse }: { job: Job; onBrowse?: () => void }) {
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
  const [jobTitle, setJobTitle] = useState("");
  const [jobBudgetInput, setJobBudgetInput] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [proposalJobId, setProposalJobId] = useState("");
  const [proposalAmountInput, setProposalAmountInput] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [contractSearch, setContractSearch] = useState("");

  const jobBudget = Number(jobBudgetInput || 0);
  const proposalAmount = Number(proposalAmountInput || 0);

  const { data: jobs } = useJobs();
  const { data: proposals } = useProposals({ userId: user.id, role: roleView });
  const { data: contracts } = useContracts();

  const createJobMutation = useCreateJob();
  const createProposalMutation = useCreateProposal();
  const acceptProposalMutation = useAcceptProposal();
  const createContractMutation = useCreateContract();
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();
  const refundContractMutation = useRefundContract();

  const isBusy =
    createJobMutation.status === "pending" ||
    createProposalMutation.status === "pending" ||
    acceptProposalMutation.status === "pending" ||
    createContractMutation.status === "pending" ||
    fundContractMutation.status === "pending" ||
    confirmCompletionMutation.status === "pending" ||
    releaseEscrowMutation.status === "pending" ||
    refundContractMutation.status === "pending";

  const visibleJobs = roleView === "CLIENT"
    ? (jobs?.filter((j) => j.client?.id === user.id) ?? [])
    : (jobs ?? []);

  const activeContracts = contracts?.filter((c) => c.status === "ACTIVE" || c.status === "IN_PROGRESS" || c.status === "FUNDED") ?? [];
  const pendingPayments = contracts?.filter((c) => c.status === "DRAFT" || c.status === "PENDING_PAYMENT") ?? [];
  const completedContracts = contracts?.filter((c) => c.status === "COMPLETED" || c.status === "PAID_OUT") ?? [];
  const escrowReadyContracts = contracts?.filter(
    (c) => c.status === "ACTIVE" && c.clientConfirmedCompletion && c.artisanConfirmedCompletion && !c.escrowReleased,
  ) ?? [];

  const totalSpent = completedContracts.reduce((sum, c) => sum + c.amount, 0);

  const filteredContracts = (contracts ?? []).filter((c) =>
    contractSearch === "" || c.job.title.toLowerCase().includes(contractSearch.toLowerCase()),
  );

  const handleCreateJob = () => {
    const toastId = toast.loading("Publishing job...");
    createJobMutation.mutate(
      { title: jobTitle.trim(), description: jobDescription.trim(), budget: jobBudget, category: "general" },
      {
        onSuccess: () => {
          toast.success("Job published.", { id: toastId });
          setJobTitle(""); setJobDescription(""); setJobBudgetInput("");
        },
        onError: (e) => toast.error(e.message || "Unable to publish.", { id: toastId }),
      },
    );
  };

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
        className="flex flex-wrap items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {firstName} 👋</p>
        </div>
        <div className="flex items-center gap-3">
          {roleView === "CLIENT" && (
            <Button asChild size="sm" className="gap-1.5 shadow-sm shadow-primary/15">
              <Link href="/jobs/create">
                <Plus className="size-4" /> Post a Job
              </Link>
            </Button>
          )}
          {roleView === "ARTISAN" && (
            <Button asChild variant="outline" size="sm">
              <Link href="/jobs">
                <Search className="size-4 mr-1.5" /> Browse Jobs
              </Link>
            </Button>
          )}
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
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
      {roleView === "CLIENT" && (
        <ClientWorkspaceSection
          jobTitle={jobTitle}
          jobDescription={jobDescription}
          jobBudgetInput={jobBudgetInput}
          setJobTitle={setJobTitle}
          setJobDescription={setJobDescription}
          setJobBudgetInput={setJobBudgetInput}
          onCreateJob={handleCreateJob}
          isBusy={isBusy}
        />
      )}
      {roleView === "ARTISAN" && (
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
      )}
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
                filteredContracts.slice(0, 5).map((contract) => (
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
              {visibleJobs.slice(0, 4).map((job) => (
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
            </CardHeader>
            <CardContent className="space-y-2">
              {proposals.slice(0, 4).map((proposal) => (
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
