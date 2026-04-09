"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDashed, ShieldAlert, Wallet } from "lucide-react";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useJobs, useCreateJob } from "@/hooks/useJobs";
import {
  useProposals,
  useCreateProposal,
  useAcceptProposal,
} from "@/hooks/useProposals";
import {
  useContracts,
  useCreateContract,
  useFundContract,
  useConfirmCompletion,
  useReleaseEscrow,
  useRefundContract,
} from "@/hooks/useContracts";

const workflowSteps = [
  { label: "Fund escrow", icon: Wallet },
  { label: "Work in progress", icon: CircleDashed },
  { label: "Confirm completion", icon: CheckCircle2 },
  { label: "Release payment", icon: CheckCircle2 },
];

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function WorkSureDashboard({
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
  const jobBudget = Number(jobBudgetInput || 0);
  const proposalAmount = Number(proposalAmountInput || 0);

  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: proposals, isLoading: proposalsLoading } = useProposals({
    userId: user.id,
    role: roleView,
  });
  const { data: contracts, isLoading: contractsLoading } = useContracts();

  const createJobMutation = useCreateJob();
  const createProposalMutation = useCreateProposal();
  const acceptProposalMutation = useAcceptProposal();
  const createContractMutation = useCreateContract();
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();
  const refundContractMutation = useRefundContract();

  const isBusy =
    jobsLoading ||
    proposalsLoading ||
    contractsLoading ||
    createJobMutation.status === "pending" ||
    createProposalMutation.status === "pending" ||
    acceptProposalMutation.status === "pending" ||
    createContractMutation.status === "pending" ||
    fundContractMutation.status === "pending" ||
    confirmCompletionMutation.status === "pending" ||
    releaseEscrowMutation.status === "pending" ||
    refundContractMutation.status === "pending";

  const screenCopy = useMemo(() => {
    if (roleView === "CLIENT") {
      return {
        title: "Client workspace",
        description:
          "Create jobs, review proposals, fund escrow, and release payment with clear status visibility at each step.",
        emphasis: "Escrow protection",
      };
    }

    if (roleView === "ARTISAN") {
      return {
        title: "Artisan workspace",
        description:
          "Track open jobs, submit proposals, and manage funded contracts with confidence about payout progress.",
        emphasis: "Funded work flow",
      };
    }

    return {
      title: "Admin workspace",
      description:
        "Monitor live marketplace activity and maintain trust across contracts, users, verification, and disputes.",
      emphasis: "Trust oversight",
    };
  }, [roleView]);

  const visibleJobs =
    roleView === "CLIENT"
      ? jobs?.filter((job) => job.client?.id === user.id) ?? []
      : jobs ?? [];

  const activeContracts = contracts?.filter((contract) => contract.status === "ACTIVE") ?? [];
  const escrowReadyContracts =
    contracts?.filter(
      (contract) =>
        contract.status === "ACTIVE" &&
        contract.clientConfirmedCompletion &&
        contract.artisanConfirmedCompletion &&
        !contract.escrowReleased,
    ) ?? [];

  return (
    <main className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/90 bg-white">
          <CardHeader className="space-y-4">
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
              {roleView.toLowerCase()} dashboard
            </Badge>
            <div className="space-y-2">
              <CardTitle className="text-3xl tracking-tight">{screenCopy.title}</CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7">
                {screenCopy.description}
              </CardDescription>
            </div>
            <div className="grid gap-3 rounded-2xl bg-surface-muted/70 p-4 md:grid-cols-4">
              {workflowSteps.map(({ label, icon: Icon }, index) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-border">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft">
                    <Icon className={`size-4 ${index === workflowSteps.length - 1 ? "text-success" : "text-primary-dark"}`} />
                  </div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <Card className="border-border/90 bg-white">
            <CardContent className="px-5 py-5">
              <p className="text-sm text-text-secondary">Open jobs</p>
              <p className="mt-2 text-3xl font-semibold text-secondary">{jobs?.length ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/90 bg-white">
            <CardContent className="px-5 py-5">
              <p className="text-sm text-text-secondary">{screenCopy.emphasis}</p>
              <p className="mt-2 text-3xl font-semibold text-primary-dark">
                {roleView === "ADMIN" ? activeContracts.length : contracts?.length ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/90 bg-white">
            <CardContent className="px-5 py-5">
              <p className="text-sm text-text-secondary">Ready to release</p>
              <p className="mt-2 text-3xl font-semibold text-success">{escrowReadyContracts.length}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {roleView === "CLIENT" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/90 bg-white">
            <CardHeader>
              <CardTitle>Post a job</CardTitle>
              <CardDescription>
                Create new work opportunities for artisans in the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Job title"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
              />
              <Textarea
                placeholder="Describe the work"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
              />
              <Input
                type="number"
                placeholder="Budget"
                value={jobBudgetInput}
                onChange={(event) => setJobBudgetInput(event.target.value)}
              />
              <Button
                onClick={() =>
                  createJobMutation.mutate({
                    title: jobTitle,
                    description: jobDescription,
                    budget: jobBudget,
                    category: "general",
                  })
                }
                disabled={isBusy || !jobTitle || jobBudget <= 0}
              >
                Create job
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)]">
            <CardHeader>
              <CardTitle>Client payment rules</CardTitle>
              <CardDescription>
                Keep money-related actions obvious and deliberate in every contract.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-text-secondary">
              <p>Fund escrow only after reviewing the proposal and contract amount.</p>
              <p>Confirm completion only when the delivered work matches the agreement.</p>
              <p>Release or refund from the contract card so status always stays visible.</p>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {roleView === "ARTISAN" ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/90 bg-white">
            <CardHeader>
              <CardTitle>Submit a proposal</CardTitle>
              <CardDescription>
                Respond to an open job with your amount and delivery approach.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                className="h-11 w-full rounded-xl border border-border bg-input px-3.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={proposalJobId}
                onChange={(event) => setProposalJobId(event.target.value)}
              >
                <option value="">Select a job</option>
                {jobs?.map((job) => (
                  <option value={job.id} key={job.id}>
                    {job.title} ({formatAmount(job.budget)})
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Proposal amount"
                value={proposalAmountInput}
                onChange={(event) => setProposalAmountInput(event.target.value)}
              />
              <Textarea
                placeholder="Proposal message"
                value={proposalMessage}
                onChange={(event) => setProposalMessage(event.target.value)}
              />
              <Button
                onClick={() =>
                  createProposalMutation.mutate({
                    jobId: proposalJobId,
                    amount: proposalAmount,
                    message: proposalMessage,
                  })
                }
                disabled={isBusy || !proposalJobId || proposalAmount <= 0 || !proposalMessage.trim()}
              >
                Submit proposal
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_100%)]">
            <CardHeader>
              <CardTitle>Artisan trust signals</CardTitle>
              <CardDescription>
                Use funded contracts and visible status changes to reduce uncertainty about payout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-text-secondary">
              <p>Bid on active work with a clear scope and amount.</p>
              <p>Track accepted proposals as contracts with visible escrow status.</p>
              <p>Confirm delivery once the funded work is complete.</p>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {roleView === "ADMIN" ? (
        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="border-border/90 bg-white lg:col-span-2">
            <CardHeader>
              <CardTitle>Platform activity snapshot</CardTitle>
              <CardDescription>
                Admin-specific moderation, KYC, and dispute tools still need dedicated screens, but
                the design language already makes trust states visible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-text-secondary">
              <p>Jobs, proposals, and contracts here reflect the live contract path in the marketplace.</p>
              <p>Dedicated review flows can reuse the same status colors for verification and disputes.</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-[linear-gradient(180deg,#fef2f2_0%,#ffffff_100%)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="size-5 text-danger" />
                Admin focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-text-secondary">
              <p>Trust and safety review</p>
              <p>KYC verification queue</p>
              <p>Dispute response workflow</p>
            </CardContent>
          </Card>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="border-border/90 bg-white">
          <CardHeader>
            <CardTitle>{roleView === "CLIENT" ? "Your jobs" : "Open jobs"}</CardTitle>
          </CardHeader>
            <CardContent className="space-y-3">
              {visibleJobs.length ? (
                <div className="space-y-3">
                  {visibleJobs.map((job) => (
                    <div key={job.id} className="rounded-2xl border border-border bg-surface p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-foreground">{job.title}</p>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">{job.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="secondary">Budget</Badge>
                        <span className="text-sm font-medium text-secondary">{formatAmount(job.budget)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">No jobs to show yet.</p>
              )}
            </CardContent>
        </Card>

        <Card className="border-border/90 bg-white">
          <CardHeader>
            <CardTitle>Proposals</CardTitle>
            <CardDescription>
              {roleView === "CLIENT"
                ? "Incoming proposals for your jobs."
                : roleView === "ARTISAN"
                  ? "The proposals you have submitted."
                  : "Proposal activity across the current workspace."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposals?.length ? (
              <div className="space-y-3">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="rounded-2xl border border-border bg-surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-foreground">{proposal.job.title}</p>
                      <StatusBadge status={proposal.status} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-secondary">
                      {formatAmount(proposal.amount)}
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">{proposal.message}</p>

                    {roleView === "CLIENT" && proposal.status === "PENDING" ? (
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => acceptProposalMutation.mutate(proposal.id)}
                          disabled={isBusy}
                        >
                          Accept
                        </Button>
                      </div>
                    ) : null}

                    {roleView === "CLIENT" && proposal.status === "ACCEPTED" ? (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          onClick={() => createContractMutation.mutate(proposal.id)}
                          disabled={isBusy}
                        >
                          Create contract
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">No proposals yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/90 bg-white">
          <CardHeader>
            <CardTitle>Contracts</CardTitle>
            <CardDescription>Current contract status and escrow actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {contracts?.length ? (
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <div key={contract.id} className="rounded-2xl border border-border bg-surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-foreground">{contract.job.title}</p>
                      <StatusBadge
                        status={
                          contract.escrowReleased ? "COMPLETED" : contract.status
                        }
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-secondary">
                      {formatAmount(contract.amount)}
                    </p>
                    <p className="mt-2 text-xs text-text-secondary">
                      Client confirm: {String(contract.clientConfirmedCompletion)} / Artisan confirm:{" "}
                      {String(contract.artisanConfirmedCompletion)}
                    </p>

                    {contract.status === "DRAFT" && user.id === contract.clientId ? (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          onClick={() =>
                            fundContractMutation.mutate({
                              contractId: contract.id,
                              amount: contract.amount,
                            })
                          }
                          disabled={isBusy}
                        >
                          Fund contract
                        </Button>
                      </div>
                    ) : null}

                    {contract.status === "ACTIVE" && user.id === contract.clientId ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            confirmCompletionMutation.mutate({
                              contractId: contract.id,
                              isClient: true,
                            })
                          }
                          disabled={isBusy}
                        >
                          Confirm completion
                        </Button>
                      </div>
                    ) : null}

                    {contract.status === "ACTIVE" && user.id === contract.artisanId ? (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            confirmCompletionMutation.mutate({
                              contractId: contract.id,
                              isClient: false,
                            })
                          }
                          disabled={isBusy}
                        >
                          Confirm delivery
                        </Button>
                      </div>
                    ) : null}

                    {contract.status === "ACTIVE" &&
                    contract.clientConfirmedCompletion &&
                    contract.artisanConfirmedCompletion &&
                    !contract.escrowReleased &&
                    user.id === contract.clientId ? (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          onClick={() => releaseEscrowMutation.mutate(contract.id)}
                          disabled={isBusy}
                        >
                          Release escrow
                        </Button>
                      </div>
                    ) : null}

                    {contract.status === "ACTIVE" &&
                    !contract.escrowReleased &&
                    user.id === contract.clientId ? (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            refundContractMutation.mutate({
                              contractId: contract.id,
                              reason: "Client requested refund",
                            })
                          }
                          disabled={isBusy}
                        >
                          Refund
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">No contracts yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
