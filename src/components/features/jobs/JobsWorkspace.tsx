"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  Loader2,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/hooks/useAuth";
import { useCreateContract } from "@/hooks/useContracts";
import { useCreateJob, useJobs } from "@/hooks/useJobs";
import {
  useAcceptProposal,
  useCreateProposal,
  useProposals,
  useRejectProposal,
  useWithdrawProposal,
} from "@/hooks/useProposals";
import { formatCurrency, formatDate } from "@/lib/formatters";

/* ─── Loading Skeleton ─── */
function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-background/70 p-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-full" />
        </div>
        <div className="h-6 w-16 bg-muted rounded-full" />
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-3 bg-muted rounded w-20" />
        <div className="h-3 bg-muted rounded w-16" />
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/30 p-10 text-center">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="size-6 text-primary" />
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ─── Tab Button ─── */
function TabButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`ml-1.5 text-xs ${
            active ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          ({count})
        </span>
      )}
    </button>
  );
}

export default function JobsWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const router = useRouter();
  const canLoadProtectedData = Boolean(user);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"jobs" | "proposals">("jobs");
  const deferredSearch = useDeferredValue(search);

  const [jobsPage, setJobsPage] = useState(1);
  const [proposalsPage, setProposalsPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Reset pagination when searching or changing tabs
  useMemo(() => {
    setJobsPage(1);
    setProposalsPage(1);
  }, [deferredSearch, activeTab]);

  const jobsQuery = useJobs(
    {
      clientId: user?.role === "CLIENT" ? user.id : undefined,
      status: user?.role === "ARTISAN" ? "OPEN" : undefined,
      search: deferredSearch.trim() || undefined,
      limit: 50,
    },
    { enabled: canLoadProtectedData },
  );

  const proposalsQuery = useProposals(
    { role: user?.role, userId: user?.id },
    { enabled: canLoadProtectedData },
  );

  const acceptProposalMutation = useAcceptProposal();
  const rejectProposalMutation = useRejectProposal();
  const withdrawProposalMutation = useWithdrawProposal();
  const createContractMutation = useCreateContract();
  const createProposalMutation = useCreateProposal();

  const [proposalJobId, setProposalJobId] = useState("");
  const [proposalAmountInput, setProposalAmountInput] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const proposalAmount = Number(proposalAmountInput || 0);

  const jobs = useMemo(() => jobsQuery.data ?? [], [jobsQuery.data]);
  const proposals = useMemo(() => proposalsQuery.data ?? [], [proposalsQuery.data]);

  const pendingProposals = useMemo(
    () => proposals.filter((p) => p.status === "PENDING"),
    [proposals],
  );

  const paginatedJobs = useMemo(() => {
    const startIndex = (jobsPage - 1) * ITEMS_PER_PAGE;
    return jobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [jobs, jobsPage]);

  const totalJobsPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);

  const paginatedProposals = useMemo(() => {
    const startIndex = (proposalsPage - 1) * ITEMS_PER_PAGE;
    return proposals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [proposals, proposalsPage]);

  const totalProposalsPages = Math.ceil(proposals.length / ITEMS_PER_PAGE);

  if (!user) return null;

  const isLoading = jobsQuery.isLoading;
  const isClient = user.role === "CLIENT";
  const isArtisan = user.role === "ARTISAN";

  const handleCreateProposal = () => {
    const toastId = toast.loading("Submitting proposal...");
    createProposalMutation.mutate(
      {
        jobId: proposalJobId,
        amount: proposalAmount,
        message: proposalMessage.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Proposal submitted! The client will review it shortly.", { id: toastId });
          setProposalJobId("");
          setProposalAmountInput("");
          setProposalMessage("");
          setActiveTab("proposals");
        },
        onError: (error) => {
          toast.error(error.message || "Unable to submit proposal.", { id: toastId });
        },
      },
    );
  };

  return (
    <main className="space-y-6">
      {/* ─── Page Header ─── */}
      <Card className="border-border/80 bg-card/95">
        <CardHeader className="gap-3 md:flex md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-3xl tracking-tight">
              {isClient ? "Your Jobs" : "Find Work"}
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              {isClient
                ? "Manage your posted jobs and review proposals from artisans. Accept a proposal to start the escrow-backed contract process."
                : "Browse available jobs and submit proposals. Once accepted, you'll move into a secure escrow-backed contract."}
            </CardDescription>
          </div>
          {isClient && (
            <Button asChild className="shrink-0">
              <Link href="/jobs/create">
                <FilePlus2 className="size-4" />
                Post a new job
              </Link>
            </Button>
          )}
        </CardHeader>
      </Card>

      {/* ─── Stats Row ─── */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card size="sm">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">
              {isClient ? "Jobs posted" : "Available jobs"}
            </p>
            <p className="text-3xl font-semibold text-foreground">{jobs.length}</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">
              {isClient ? "Pending proposals" : "Your proposals"}
            </p>
            <p className="text-3xl font-semibold text-foreground">
              {isClient ? pendingProposals.length : proposals.length}
            </p>
          </CardContent>
        </Card>
        <Card size="sm" className="col-span-2 md:col-span-1">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">Average budget</p>
            <p className="text-3xl font-semibold text-foreground">
              {formatCurrency(
                jobs.length
                  ? jobs.reduce((sum, job) => sum + Number(job.budget ?? 0), 0) / jobs.length
                  : 0,
              )}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ─── Tabs + Search ─── */}
      <Card className="border-border/80 bg-card">
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
              <TabButton
                active={activeTab === "jobs"}
                label={isClient ? "My Jobs" : "Available Jobs"}
                count={jobs.length}
                onClick={() => setActiveTab("jobs")}
              />
              <TabButton
                active={activeTab === "proposals"}
                label={isClient ? "Proposals" : "My Proposals"}
                count={proposals.length}
                onClick={() => setActiveTab("proposals")}
              />
            </div>
            {activeTab === "jobs" && (
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─── Jobs Tab ─── */}
      {activeTab === "jobs" && (
        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/80 bg-card">
            <CardHeader>
              <CardTitle>
                {isClient ? "Your posted jobs" : "Open jobs in the marketplace"}
              </CardTitle>
              <CardDescription>
                {isClient
                  ? "Jobs you've published. Artisans will submit proposals to these."
                  : "Select a job to submit your proposal with a price and delivery plan."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : jobs.length ? (
                <>
                  {paginatedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-lg border border-border bg-background/70 p-4 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{job.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                        <StatusBadge status={job.status} />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {formatCurrency(job.budget)}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          {job.category ?? "General"}
                        </span>
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                      {isArtisan && user.artisanVerified && job.status === "OPEN" && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setProposalJobId(job.id);
                              setActiveTab("proposals");
                            }}
                          >
                            <Send className="size-3.5 mr-1.5" />
                            Apply to this job
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {totalJobsPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setJobsPage((p) => Math.max(1, p - 1))}
                        disabled={jobsPage === 1}
                      >
                        <ChevronLeft className="size-4 mr-1" /> Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {jobsPage} of {totalJobsPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setJobsPage((p) => Math.min(totalJobsPages, p + 1))}
                        disabled={jobsPage === totalJobsPages}
                      >
                        Next <ChevronRight className="size-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  icon={BriefcaseBusiness}
                  title={isClient ? "No jobs posted yet" : "No open jobs available"}
                  description={
                    isClient
                      ? "Post your first job to start receiving proposals from verified artisans."
                      : "Check back soon — new jobs are posted regularly."
                  }
                  action={
                    isClient ? (
                      <Button asChild size="sm">
                        <Link href="/jobs/create">
                          <FilePlus2 className="size-4" />
                          Post your first job
                        </Link>
                      </Button>
                    ) : undefined
                  }
                />
              )}
            </CardContent>
          </Card>

          {/* Guidance panel */}
          <Card className="border-border/80 bg-primary/5">
            <CardHeader>
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Sparkles className="size-5 text-primary" />
              </div>
              <CardTitle>
                {isClient ? "What happens next?" : "How to get hired"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              {isClient ? (
                <>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                    <p>Artisans will see your job and submit proposals with their price and plan.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                    <p>Review proposals in the "Proposals" tab, then accept the best one.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                    <p>Create a contract from the accepted proposal. Funds go into secure escrow.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                    <p>Browse open jobs and click "Apply" on the ones that match your skills.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                    <p>Submit a clear proposal with a realistic price and delivery timeline.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                    <p>If accepted, the client funds escrow and you start working with payment guaranteed.</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ─── Proposals Tab ─── */}
      {activeTab === "proposals" && (
        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Proposal Form for Artisans */}
          {isArtisan && (
            <Card className="border-border/80 bg-card xl:order-2">
              <CardHeader>
                <CardTitle>Submit a proposal</CardTitle>
                <CardDescription>
                  Pick a job and send your price with a delivery plan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {!user.artisanVerified ? (
                  <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
                    <p className="font-medium">Verification required</p>
                    <p className="mt-1">
                      Complete your KYC verification before submitting proposals.{" "}
                      <Link href="/kyc/status" className="underline font-medium">
                        Go to verification →
                      </Link>
                    </p>
                  </div>
                ) : (
                  <>
                    <select
                      className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      value={proposalJobId}
                      onChange={(e) => setProposalJobId(e.target.value)}
                    >
                      <option value="">Select a job to apply to</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} ({formatCurrency(job.budget)})
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      placeholder="Your proposed price (₦)"
                      value={proposalAmountInput}
                      onChange={(e) => setProposalAmountInput(e.target.value)}
                    />
                    <Textarea
                      placeholder="Describe how you'll handle this work, your timeline, and relevant experience..."
                      value={proposalMessage}
                      onChange={(e) => setProposalMessage(e.target.value)}
                      rows={4}
                    />
                    <Button
                      disabled={
                        !proposalJobId ||
                        !proposalMessage.trim() ||
                        proposalAmount <= 0 ||
                        createProposalMutation.status === "pending"
                      }
                      onClick={handleCreateProposal}
                      className="w-full"
                    >
                      {createProposalMutation.status === "pending" ? (
                        <><Loader2 className="size-4 animate-spin" /> Submitting...</>
                      ) : (
                        <><Send className="size-4" /> Submit proposal</>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Proposal List */}
          <Card className={`border-border/80 bg-card ${isClient ? "xl:col-span-2" : ""}`}>
            <CardHeader>
              <CardTitle>
                {isClient ? "Proposals from artisans" : "Your submitted proposals"}
              </CardTitle>
              <CardDescription>
                {isClient
                  ? "Review, accept, or reject proposals. Accepted proposals can be turned into escrow-backed contracts."
                  : "Track the status of your proposals. Accepted proposals will become contracts."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {proposalsQuery.isLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : proposals.length ? (
                <>
                  {paginatedProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="rounded-lg border border-border bg-background/70 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">
                            {proposal.job.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {isClient
                              ? `From ${proposal.artisan.name}`
                              : `For ${proposal.client.name}`}
                          </p>
                        </div>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {proposal.message}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {formatCurrency(proposal.amount)}
                        </span>
                        <span>{formatDate(proposal.createdAt)}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {isClient && proposal.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                acceptProposalMutation.mutate(proposal.id, {
                                  onSuccess: () => toast.success("Proposal accepted!"),
                                  onError: (e) => toast.error(e.message || "Unable to accept."),
                                })
                              }
                              disabled={acceptProposalMutation.status === "pending"}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                rejectProposalMutation.mutate(proposal.id, {
                                  onSuccess: () => toast.success("Proposal rejected."),
                                  onError: (e) => toast.error(e.message || "Unable to reject."),
                                })
                              }
                              disabled={rejectProposalMutation.status === "pending"}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {isClient && proposal.status === "ACCEPTED" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              createContractMutation.mutate(proposal.id, {
                                onSuccess: () => {
                                  toast.success("Contract created! Go to Contracts to fund escrow.");
                                  router.push("/contracts");
                                },
                                onError: (e) => toast.error(e.message || "Unable to create contract."),
                              })
                            }
                            disabled={createContractMutation.status === "pending"}
                          >
                            Create contract →
                          </Button>
                        )}
                        {isArtisan && proposal.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              withdrawProposalMutation.mutate(proposal.id, {
                                onSuccess: () => toast.success("Proposal withdrawn."),
                                onError: (e) => toast.error(e.message || "Unable to withdraw."),
                              })
                            }
                            disabled={withdrawProposalMutation.status === "pending"}
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {totalProposalsPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProposalsPage((p) => Math.max(1, p - 1))}
                        disabled={proposalsPage === 1}
                      >
                        <ChevronLeft className="size-4 mr-1" /> Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {proposalsPage} of {totalProposalsPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProposalsPage((p) => Math.min(totalProposalsPages, p + 1))}
                        disabled={proposalsPage === totalProposalsPages}
                      >
                        Next <ChevronRight className="size-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  icon={Send}
                  title="No proposals yet"
                  description={
                    isClient
                      ? "Once artisans apply to your jobs, their proposals will appear here."
                      : "Browse the available jobs tab and apply to get started."
                  }
                  action={
                    isArtisan ? (
                      <Button size="sm" variant="outline" onClick={() => setActiveTab("jobs")}>
                        Browse available jobs
                      </Button>
                    ) : undefined
                  }
                />
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ─── Next Step CTA ─── */}
      <Card className="border-border/80 bg-card">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <BriefcaseBusiness className="size-4 text-primary" />
            <span>
              {isClient
                ? "Accepted proposals become escrow-backed contracts. Manage them in Contracts."
                : "Once your proposal is accepted, the client creates a contract and funds escrow."}
            </span>
          </div>
          <Button asChild variant="outline">
            <Link href="/contracts">
              Go to contracts
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
