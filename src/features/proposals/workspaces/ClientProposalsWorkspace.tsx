"use client";

import { useProposals, useAcceptProposal } from "@/features/jobs/api/useProposals";
import { useCreateContract } from "@/features/contracts";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/formatters";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { User, Proposal } from "@/types";

export function ClientProposalsWorkspace({ user }: { user: User }) {
  const { data: response, isLoading } = useProposals({ userId: user.id, role: "CLIENT" });
  
  const acceptProposalMutation = useAcceptProposal();
  const createContractMutation = useCreateContract();
  
  const isBusy = acceptProposalMutation.status === "pending" || createContractMutation.status === "pending";

  if (isLoading) {
    return (
      <div className="p-6 h-full bg-background overflow-hidden flex flex-col">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((col) => (
            <Skeleton key={col} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Ensure we have an array and explicitly filter out DRAFT status for clients
  const allProposals = (Array.isArray(response?.proposals) ? response.proposals : []).filter(
    (p: Proposal) => p.status !== "DRAFT"
  );

  return (
    <div className="p-6 h-full bg-background overflow-hidden flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proposals Received</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review and accept proposals for your posted jobs</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-2 pb-4">
        {allProposals.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
            <AlertCircle className="size-10 opacity-20 mb-4" />
            <p>You haven&apos;t received any active proposals yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {allProposals.map((proposal: Proposal) => (
              <Card key={proposal.id} className="group flex flex-col sm:flex-row gap-4 border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all h-full">
                <div className="flex-1 min-w-0 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base text-foreground truncate pr-4" title={proposal.job?.title}>
                      {proposal.job?.title}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold text-primary">{formatCurrency(proposal.amount)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <StatusBadge status={proposal.status} />
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 italic">
                    &quot;{proposal.message}&quot;
                  </p>
                  
                  <div className="flex justify-between items-end mt-auto pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      Received: {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                    
                    <div className="flex gap-2">
                      {proposal.status === "PENDING" || proposal.status === "SUBMITTED" || proposal.status === "VIEWED" ? (
                        <Button
                          size="sm"
                          onClick={() =>
                            acceptProposalMutation.mutate(proposal.id, {
                              onSuccess: () => toast.success("Proposal accepted."),
                              onError: (e) => toast.error(e.message),
                            })
                          }
                          disabled={isBusy}
                        >
                          Accept Proposal
                        </Button>
                      ) : null}
                      
                      {proposal.status === "ACCEPTED" && (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() =>
                            createContractMutation.mutate(proposal.id, {
                              onSuccess: () => toast.success("Contract created."),
                              onError: (e) => toast.error(e.message),
                            })
                          }
                          disabled={isBusy}
                        >
                          Create Contract
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
