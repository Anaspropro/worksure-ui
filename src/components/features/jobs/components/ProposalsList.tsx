"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import type { User } from "@/types";
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
  user: User;
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
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : proposals.length ? (
            <ul className="divide-y divide-border/50">
              {proposals.map((proposal) => (
                <li
                  key={proposal.id}
                  className="group relative flex flex-col gap-4 p-5 sm:p-6 bg-card hover:bg-muted/30 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {proposal.job.title}
                        </p>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <p className="text-sm font-medium text-primary/80">
                        {isClient
                          ? `From ${proposal.artisan.name}`
                          : `For ${proposal.client.name}`}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {proposal.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <span className="text-xl font-bold text-foreground">
                        {formatCurrency(proposal.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Submitted {formatDate(proposal.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {isClient && proposal.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
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
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
                        className="shadow-sm"
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
                        className="bg-background"
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
                </li>
              ))}
              {totalProposalsPages > 1 && (
                <li className="flex items-center justify-between p-4 bg-muted/10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background"
                    onClick={() => setProposalsPage((p) => Math.max(1, p - 1))}
                    disabled={proposalsPage === 1}
                  >
                    <ChevronLeft className="size-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Page {proposalsPage} of {totalProposalsPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background"
                    onClick={() => setProposalsPage((p) => Math.min(totalProposalsPages, p + 1))}
                    disabled={proposalsPage === totalProposalsPages}
                  >
                    Next <ChevronRight className="size-4 ml-1" />
                  </Button>
                </li>
              )}
            </ul>
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
