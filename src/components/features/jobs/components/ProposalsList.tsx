"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useProposals,
  useAcceptProposal,
  useRejectProposal,
  useWithdrawProposal,
} from "@/hooks/useProposals";
import { useCreateContract } from "@/hooks/useContracts";
import { formatCurrency, formatDate } from "@/lib/formatters";

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

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Send;
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

export function ProposalsList({
  user,
  onBrowseJobs,
}: {
  user: any;
  onBrowseJobs: () => void;
}) {
  const router = useRouter();
  const [proposalsPage, setProposalsPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const proposalsQuery = useProposals({
    role: user?.role,
    userId: user?.id,
    limit: ITEMS_PER_PAGE,
    page: proposalsPage,
  });

  const acceptProposalMutation = useAcceptProposal();
  const rejectProposalMutation = useRejectProposal();
  const withdrawProposalMutation = useWithdrawProposal();
  const createContractMutation = useCreateContract();

  const proposalsResponse = proposalsQuery.data;
  const proposals = proposalsResponse?.proposals ?? [];
  const totalProposalsPages = proposalsResponse?.pagination?.totalPages ?? 1;
  const isLoading = proposalsQuery.isLoading;

  const isClient = user?.role === "CLIENT";
  const isArtisan = user?.role === "ARTISAN";

  return (
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
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : proposals.length ? (
          <>
            {proposals.map((proposal) => (
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
                <Button size="sm" variant="outline" onClick={onBrowseJobs}>
                  Browse available jobs
                </Button>
              ) : undefined
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
