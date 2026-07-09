"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/features/auth";
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
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const contractsQuery = useContracts({ page, limit: ITEMS_PER_PAGE }, { enabled: Boolean(user) });
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();
  const refundContractMutation = useRefundContract();

  if (!user) {
    return null;
  }

  const contractsResponse = contractsQuery.data;
  const contracts = contractsResponse?.data ?? [];
  const totalContractsCount = contractsResponse?.pagination?.total ?? 0;
  const totalPages = contractsResponse?.pagination?.totalPages ?? 1;

  const readyToRelease = contracts.filter(
    (contract) =>
      contract.status === "ACTIVE" &&
      contract.clientConfirmedCompletion &&
      contract.artisanConfirmedCompletion &&
      !contract.escrowReleased,
  );

  return (
    <main className="space-y-6">
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Contracts and Escrow</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            Follow each agreement from draft through funding, completion confirmation, release, or refund.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card size="sm">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">Total contracts</p>
            <p className="text-3xl font-semibold text-foreground">{totalContractsCount}</p>
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
        <Card size="sm" className="col-span-1 sm:col-span-2 md:col-span-1">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">Ready to release</p>
            <p className="text-3xl font-semibold text-foreground">{readyToRelease.length}</p>
          </CardContent>
        </Card>
      </section>

      {user.role === "CLIENT" && (
        <Card className="border-border bg-primary/5">
          <CardHeader>
            <CardTitle>Client payment rules</CardTitle>
            <CardDescription>
              Keep money-related actions obvious and deliberate in every contract.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Fund escrow only after reviewing the proposal and contract amount.</p>
            <p>Confirm completion only when the delivered work matches the agreement.</p>
            <p>Release or refund from the contract card so status always stays visible.</p>
          </CardContent>
        </Card>
      )}


      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle>Contract queue</CardTitle>
          <CardDescription>Every payment action stays attached to a visible contract state.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {contracts.length ? (
            <>
              <ul className="divide-y divide-border/50">
                {contracts.map((contract) => (
                  <li
                    key={contract.id}
                    className="group relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between sm:justify-start sm:gap-4">
                        <div className="space-y-1">
                          <Link href={`/contracts/${contract.id}`} className="block">
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {contract.job.title}
                            </p>
                          </Link>
                          <p className="text-sm font-medium text-primary">
                            {formatCurrency(contract.amount)}
                          </p>
                        </div>
                        <StatusBadge status={contract.status} />
                      </div>

                      <div className="grid gap-x-6 gap-y-2 text-xs text-muted-foreground sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-x-8">
                        {contract.fundedAt && (
                          <div className="flex flex-col">
                            <span className="uppercase text-[10px] font-semibold text-muted-foreground/70 tracking-wider">Funded</span>
                            <span>{formatDate(contract.fundedAt)}</span>
                          </div>
                        )}
                        {contract.startedAt && (
                          <div className="flex flex-col">
                            <span className="uppercase text-[10px] font-semibold text-muted-foreground/70 tracking-wider">Started</span>
                            <span>{formatDate(contract.startedAt)}</span>
                          </div>
                        )}
                        {contract.completedAt && (
                          <div className="flex flex-col">
                            <span className="uppercase text-[10px] font-semibold text-muted-foreground/70 tracking-wider">Completed</span>
                            <span>{formatDate(contract.completedAt)}</span>
                          </div>
                        )}
                        {contract.escrowReleasedAt && (
                          <div className="flex flex-col">
                            <span className="uppercase text-[10px] font-semibold text-muted-foreground/70 tracking-wider">Released</span>
                            <span>{formatDate(contract.escrowReleasedAt)}</span>
                          </div>
                        )}
                      </div>

                      {(contract.status === "ACTIVE" || contract.status === "COMPLETED") && (
                        <div className="flex gap-4 text-xs">
                          <span className="flex items-center gap-1.5">
                            <span className={`size-1.5 rounded-full ${contract.clientConfirmedCompletion ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                            Client: {contract.clientConfirmedCompletion ? "Confirmed" : "Pending"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className={`size-1.5 rounded-full ${contract.artisanConfirmedCompletion ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                            Artisan: {contract.artisanConfirmedCompletion ? "Confirmed" : "Pending"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                      {contract.status === "DRAFT" && user.id === contract.clientId ? (
                        <Button
                          size="sm"
                          className="w-full sm:w-auto shadow-sm"
                          onClick={() =>
                            fundContractMutation.mutate({
                              contractId: contract.id,
                              email: user.email,
                              callbackUrl: window.location.href,
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
                          className="w-full sm:w-auto bg-background hover:bg-muted"
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
                          className="w-full sm:w-auto bg-background hover:bg-muted"
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
                          className="w-full sm:w-auto shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => releaseEscrowMutation.mutate(contract.id)}
                          disabled={releaseEscrowMutation.status === "pending"}
                        >
                          Release payment
                        </Button>
                      ) : null}
                      {contract.status === "ACTIVE" && !contract.escrowReleased && user.id === contract.clientId ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            refundContractMutation.mutate({
                              contractId: contract.id,
                              reason: "Client requested refund",
                            })
                          }
                          disabled={refundContractMutation.status === "pending"}
                        >
                          Refund
                        </Button>
                      ) : null}
                      <Button asChild size="sm" variant="ghost" className="w-full sm:w-auto">
                        <Link href={`/contracts/${contract.id}`}>
                          View details
                          <ArrowRight className="size-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="size-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/5">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/20">
                <svg className="size-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">No contracts yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Accepted proposals will appear here once a contract is created. Ready to start working?
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
