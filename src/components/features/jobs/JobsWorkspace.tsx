"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, FilePlus2 } from "lucide-react";
import AppShell from "@/components/app-shell/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/hooks/useAuth";
import { useCreateContract } from "@/hooks/useContracts";
import { useCreateJob, useRoleScopedJobs } from "@/hooks/useJobs";
import {
  useAcceptProposal,
  useCreateProposal,
  useProposals,
  useRejectProposal,
  useWithdrawProposal,
} from "@/hooks/useProposals";
import { formatCurrency, formatDate } from "@/lib/formatters";

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 p-6 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 leading-6">{description}</p>
    </div>
  );
}

export default function JobsWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const jobsQuery = useRoleScopedJobs({ role: user?.role, userId: user?.id });
  const proposalsQuery = useProposals({ role: user?.role, userId: user?.id });
  const createJobMutation = useCreateJob();
  const createProposalMutation = useCreateProposal();
  const acceptProposalMutation = useAcceptProposal();
  const rejectProposalMutation = useRejectProposal();
  const withdrawProposalMutation = useWithdrawProposal();
  const createContractMutation = useCreateContract();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(0);
  const [category, setCategory] = useState("general");
  const [proposalJobId, setProposalJobId] = useState("");
  const [proposalAmount, setProposalAmount] = useState(0);
  const [proposalMessage, setProposalMessage] = useState("");

  const pendingProposals = useMemo(
    () => proposalsQuery.data?.filter((proposal) => proposal.status === "PENDING") ?? [],
    [proposalsQuery.data],
  );

  if (!user) {
    return null;
  }

  const jobs = jobsQuery.data ?? [];
  const proposals = proposalsQuery.data ?? [];

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <Card className="border-border/80 bg-white/95">
          <CardHeader className="gap-3 md:flex md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-3xl tracking-tight">
                {user.role === "CLIENT" ? "Client Jobs Workspace" : "Open Jobs and Proposals"}
              </CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7">
                {user.role === "CLIENT"
                  ? "Create jobs, review incoming proposals, and turn accepted work into escrow-backed contracts."
                  : "Browse open opportunities, send proposals, and keep your pipeline moving toward funded work."}
              </CardDescription>
            </div>
            {user.role === "CLIENT" ? (
              <Button asChild>
                <Link href="/jobs/create">
                  <FilePlus2 className="size-4" />
                  New job
                </Link>
              </Button>
            ) : null}
          </CardHeader>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Visible jobs</p>
              <p className="text-3xl font-semibold text-foreground">{jobs.length}</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">
                {user.role === "CLIENT" ? "Pending proposals" : "Submitted proposals"}
              </p>
              <p className="text-3xl font-semibold text-foreground">
                {user.role === "CLIENT" ? pendingProposals.length : proposals.length}
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
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

        {user.role === "CLIENT" ? (
          <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
            <Card className="border-border/80 bg-white">
              <CardHeader>
                <CardTitle>Quick job intake</CardTitle>
                <CardDescription>Capture a concise brief and publish it directly to the marketplace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Job title" value={title} onChange={(event) => setTitle(event.target.value)} />
                <Textarea
                  placeholder="Describe the scope, deliverables, and timing."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    type="number"
                    placeholder="Budget"
                    value={budget}
                    onChange={(event) => setBudget(Number(event.target.value))}
                  />
                  <Input
                    placeholder="Category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  />
                </div>
                <Button
                  disabled={!title.trim() || !description.trim() || budget <= 0 || createJobMutation.status === "pending"}
                  onClick={() =>
                    createJobMutation.mutate({
                      title,
                      description,
                      budget,
                      category,
                    })
                  }
                >
                  Publish job
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_100%)]">
              <CardHeader>
                <CardTitle>Client workflow guardrails</CardTitle>
                <CardDescription>Keep money decisions obvious and attached to a visible job state.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>Review proposals inside the context of the original job brief.</p>
                <p>Accept only when scope and amount are clear enough to contract.</p>
                <p>Move from proposal to contract so escrow and completion history stay auditable.</p>
              </CardContent>
            </Card>
          </section>
        ) : (
          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-border/80 bg-white">
              <CardHeader>
                <CardTitle>Submit a proposal</CardTitle>
                <CardDescription>Pick an open job and send a clear price with a short delivery note.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <select
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={proposalJobId}
                  onChange={(event) => setProposalJobId(event.target.value)}
                >
                  <option value="">Select an open job</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} ({formatCurrency(job.budget)})
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Proposed amount"
                  value={proposalAmount}
                  onChange={(event) => setProposalAmount(Number(event.target.value))}
                />
                <Textarea
                  placeholder="How will you handle this work?"
                  value={proposalMessage}
                  onChange={(event) => setProposalMessage(event.target.value)}
                />
                <Button
                  disabled={!proposalJobId || !proposalMessage.trim() || proposalAmount <= 0 || createProposalMutation.status === "pending"}
                  onClick={() =>
                    createProposalMutation.mutate({
                      jobId: proposalJobId,
                      amount: proposalAmount,
                      message: proposalMessage,
                    })
                  }
                >
                  Send proposal
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)]">
              <CardHeader>
                <CardTitle>How artisans win good work</CardTitle>
                <CardDescription>Proposal quality matters as much as price in trust-based hiring.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>Lead with a delivery plan, not only an amount.</p>
                <p>Prioritize jobs with realistic budgets so funded contracts happen faster.</p>
                <p>Track accepted proposals closely because they become your escrow pipeline.</p>
              </CardContent>
            </Card>
          </section>
        )}

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>{user.role === "CLIENT" ? "Your jobs" : "Open marketplace jobs"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobs.length ? (
                jobs.map((job) => (
                  <div key={job.id} className="rounded-2xl border border-border bg-background/70 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{formatCurrency(job.budget)}</span>
                      <span>{job.category ?? "General"}</span>
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title={user.role === "CLIENT" ? "No jobs posted yet" : "No open jobs yet"}
                  description={
                    user.role === "CLIENT"
                      ? "Start with your first job brief so artisans can send proposals."
                      : "Check back soon or broaden your category focus when more work is posted."
                  }
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>{user.role === "CLIENT" ? "Proposal inbox" : "Your proposals"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {proposals.length ? (
                proposals.map((proposal) => (
                  <div key={proposal.id} className="rounded-2xl border border-border bg-background/70 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{proposal.job.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.role === "CLIENT" ? `From ${proposal.artisan.name}` : `For ${proposal.client.name}`}
                        </p>
                      </div>
                      <StatusBadge status={proposal.status} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{proposal.message}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{formatCurrency(proposal.amount)}</span>
                      <span>{formatDate(proposal.createdAt)}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {user.role === "CLIENT" && proposal.status === "PENDING" ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => acceptProposalMutation.mutate(proposal.id)}
                            disabled={acceptProposalMutation.status === "pending"}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectProposalMutation.mutate(proposal.id)}
                            disabled={rejectProposalMutation.status === "pending"}
                          >
                            Reject
                          </Button>
                        </>
                      ) : null}
                      {user.role === "CLIENT" && proposal.status === "ACCEPTED" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => createContractMutation.mutate(proposal.id)}
                          disabled={createContractMutation.status === "pending"}
                        >
                          Create contract
                        </Button>
                      ) : null}
                      {user.role === "ARTISAN" && proposal.status === "PENDING" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => withdrawProposalMutation.mutate(proposal.id)}
                          disabled={withdrawProposalMutation.status === "pending"}
                        >
                          Withdraw
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No proposals yet"
                  description={
                    user.role === "CLIENT"
                      ? "Incoming bids for your jobs will appear here."
                      : "Your sent proposals will start showing up here once you apply to jobs."
                  }
                />
              )}
            </CardContent>
          </Card>
        </section>

        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle>Next step</CardTitle>
            <CardDescription>Move accepted work into an escrow-backed contract detail page.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <BriefcaseBusiness className="size-4 text-primary" />
              <span>Accepted proposals should become contracts before any money changes hands.</span>
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
    </AppShell>
  );
}
