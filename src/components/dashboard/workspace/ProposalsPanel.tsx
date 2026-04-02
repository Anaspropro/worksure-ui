import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Proposal } from "@/types";

export default function ProposalsPanel({
  roleView,
  proposals,
  isBusy,
  onAccept,
  onCreateContract,
  formatAmount,
}: {
  roleView: string;
  proposals: Proposal[] | undefined;
  isBusy: boolean;
  onAccept: (proposalId: string) => void;
  onCreateContract: (proposalId: string) => void;
  formatAmount: (value: number) => string;
}) {
  return (
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
          proposals.map((proposal) => (
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
                  <Button size="sm" onClick={() => onAccept(proposal.id)} disabled={isBusy}>
                    Accept
                  </Button>
                </div>
              ) : null}

              {roleView === "CLIENT" && proposal.status === "ACCEPTED" ? (
                <div className="mt-3">
                  <Button size="sm" onClick={() => onCreateContract(proposal.id)} disabled={isBusy}>
                    Create contract
                  </Button>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-sm text-text-secondary">No proposals yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
