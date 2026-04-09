"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppShell from "@/components/app-shell/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/hooks/useAuth";
import {
  useConfirmCompletion,
  useContracts,
  useFundContract,
  useRefundContract,
  useReleaseEscrow,
} from "@/hooks/useContracts";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function ContractsWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const contractsQuery = useContracts(undefined, { enabled: Boolean(user) });
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();
  const refundContractMutation = useRefundContract();

  if (!user) {
    return null;
  }

  const contracts = contractsQuery.data ?? [];
  const readyToRelease = contracts.filter(
    (contract) =>
      contract.status === "ACTIVE" &&
      contract.clientConfirmedCompletion &&
      contract.artisanConfirmedCompletion &&
      !contract.escrowReleased,
  );

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Contracts and Escrow</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Follow each agreement from draft through funding, completion confirmation, release, or refund.
            </CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Total contracts</p>
              <p className="text-3xl font-semibold text-foreground">{contracts.length}</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Active escrow</p>
              <p className="text-3xl font-semibold text-foreground">
                {contracts.filter((contract) => contract.status === "ACTIVE" || contract.status === "FUNDED").length}
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Ready to release</p>
              <p className="text-3xl font-semibold text-foreground">{readyToRelease.length}</p>
            </CardContent>
          </Card>
        </section>

        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle>Contract queue</CardTitle>
            <CardDescription>Every payment action stays attached to a visible contract state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contracts.length ? (
              contracts.map((contract) => (
                <div key={contract.id} className="rounded-2xl border border-border bg-background/75 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{contract.job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(contract.amount)} - created from proposal {contract.proposal.id}
                      </p>
                    </div>
                    <StatusBadge status={contract.status} />
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-4">
                    <p>Funded: {formatDate(contract.fundedAt)}</p>
                    <p>Started: {formatDate(contract.startedAt)}</p>
                    <p>Completed: {formatDate(contract.completedAt)}</p>
                    <p>Released: {formatDate(contract.escrowReleasedAt)}</p>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>Client confirmation: {contract.clientConfirmedCompletion ? "Yes" : "Pending"}</p>
                    <p>Artisan confirmation: {contract.artisanConfirmedCompletion ? "Yes" : "Pending"}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {contract.status === "DRAFT" && user.id === contract.clientId ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          fundContractMutation.mutate({
                            contractId: contract.id,
                            amount: contract.amount,
                          })
                        }
                        disabled={fundContractMutation.status === "pending"}
                      >
                        Fund escrow
                      </Button>
                    ) : null}
                    {contract.status === "ACTIVE" && user.id === contract.clientId ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          confirmCompletionMutation.mutate({
                            contractId: contract.id,
                            isClient: true,
                          })
                        }
                        disabled={confirmCompletionMutation.status === "pending"}
                      >
                        Confirm as client
                      </Button>
                    ) : null}
                    {contract.status === "ACTIVE" && user.id === contract.artisanId ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          confirmCompletionMutation.mutate({
                            contractId: contract.id,
                            isClient: false,
                          })
                        }
                        disabled={confirmCompletionMutation.status === "pending"}
                      >
                        Confirm as artisan
                      </Button>
                    ) : null}
                    {contract.status === "ACTIVE" &&
                    contract.clientConfirmedCompletion &&
                    contract.artisanConfirmedCompletion &&
                    !contract.escrowReleased &&
                    user.id === contract.clientId ? (
                      <Button
                        size="sm"
                        onClick={() => releaseEscrowMutation.mutate(contract.id)}
                        disabled={releaseEscrowMutation.status === "pending"}
                      >
                        Release payment
                      </Button>
                    ) : null}
                    {contract.status === "ACTIVE" && !contract.escrowReleased && user.id === contract.clientId ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          refundContractMutation.mutate({
                            contractId: contract.id,
                            reason: "Client requested refund",
                          })
                        }
                        disabled={refundContractMutation.status === "pending"}
                      >
                        Refund escrow
                      </Button>
                    ) : null}
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/contracts/${contract.id}`}>
                        View details
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 p-6 text-sm text-muted-foreground">
                No contracts yet. Accepted proposals will show up here once a contract is created.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
