"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "../../components/status-badge";
import { useContracts } from "../../hooks/useContracts";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";
import type { User } from "@/types";

export function ArtisanContractsWorkspace({
  user,
}: {
  user: User;
}) {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const contractsQuery = useContracts({ page, limit: ITEMS_PER_PAGE });

  const contractsResponse = contractsQuery.data;
  const contracts = contractsResponse?.data ?? [];
  const totalContractsCount = contractsResponse?.pagination?.total ?? 0;
  const totalPages = contractsResponse?.pagination?.totalPages ?? 1;

  const activeEscrow = contracts.filter(
    (c) => c.status === "ACTIVE" || c.status === "FUNDED" || c.status === "IN_PROGRESS"
  ).length;

  const pendingPayout = contracts.filter(
    (c) =>
      c.status === "ACTIVE" &&
      c.clientConfirmedCompletion &&
      c.artisanConfirmedCompletion &&
      !c.escrowReleased
  ).length;

  return (
    <main className="space-y-6">
      {/* Overview stats header */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-border/80 bg-card">
          <CardContent className="space-y-1 py-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total projects</p>
            <p className="text-2xl font-black text-foreground">{totalContractsCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card">
          <CardContent className="space-y-1 py-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Active escrow</p>
            <p className="text-2xl font-black text-foreground">{activeEscrow}</p>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card">
          <CardContent className="space-y-1 py-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Pending payouts</p>
            <p className="text-2xl font-black text-amber-500">{pendingPayout}</p>
          </CardContent>
        </Card>
      </div>

      {/* Contracts queue table list */}
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle>Artisan Projects</CardTitle>
          <CardDescription>Escrow-secured project agreements and execution milestones.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {contractsQuery.isLoading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : contracts.length > 0 ? (
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
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                              {contract.job?.title ?? contract.jobTitle ?? "Service Agreement"}
                            </p>
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Client: <strong className="text-foreground font-medium">{contract.client?.name ?? contract.clientName}</strong></span>
                            <span>•</span>
                            <span className="font-bold text-primary">{formatCurrency(contract.amount)}</span>
                          </div>
                        </div>
                        <StatusBadge status={contract.status} />
                      </div>

                      <div className="grid gap-x-6 gap-y-2 text-[10px] text-muted-foreground sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-x-8">
                        {contract.fundedAt && (
                          <div className="flex flex-col">
                            <span className="uppercase font-semibold text-muted-foreground/70 tracking-wider">Funded</span>
                            <span>{formatDate(contract.fundedAt)}</span>
                          </div>
                        )}
                        {contract.startedAt && (
                          <div className="flex flex-col">
                            <span className="uppercase font-semibold text-muted-foreground/70 tracking-wider">Started</span>
                            <span>{formatDate(contract.startedAt)}</span>
                          </div>
                        )}
                        {contract.completedAt && (
                          <div className="flex flex-col">
                            <span className="uppercase font-semibold text-muted-foreground/70 tracking-wider">Completed</span>
                            <span>{formatDate(contract.completedAt)}</span>
                          </div>
                        )}
                      </div>

                      {(contract.status === "ACTIVE" || contract.status === "IN_PROGRESS") && (
                        <div className="flex gap-4 text-xs">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className={`size-1.5 rounded-full ${contract.clientConfirmedCompletion ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                            Client confirmed: {contract.clientConfirmedCompletion ? "Yes" : "No"}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className={`size-1.5 rounded-full ${contract.artisanConfirmedCompletion ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                            Artisan confirmed: {contract.artisanConfirmedCompletion ? "Yes" : "No"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end shrink-0">
                      <Button asChild size="sm" variant="ghost" className="w-full sm:w-auto text-xs">
                        <Link href={`/contracts/${contract.id}`}>
                          View details
                          <ArrowRight className="size-3.5 ml-1" />
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
                <FileText className="size-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">No projects yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Submit a proposal for an open job description to secure contract draft offers.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
export default ArtisanContractsWorkspace;
