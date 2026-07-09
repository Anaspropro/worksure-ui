"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronRight, ChevronLeft, Filter } from "lucide-react";
import { useAdminContracts } from "../hooks/useAdminContracts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/shared/lib/formatters";

export function AdminContractsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const currentCursor = cursors[page - 1];
  const itemsPerPage = 20;

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
      setCursors([undefined]);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: contractsResponse, isLoading: contractsLoading } = useAdminContracts({
    cursor: currentCursor,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
  });

  const contracts = contractsResponse?.data || [];

  const getStatusBg = (status: string) => {
    switch (status) {
      case "FUNDED": return "bg-info/20 text-info border-info/30";
      case "ACTIVE":
      case "IN_PROGRESS": return "bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-900/30 dark:text-warning-400";
      case "DISPUTED": return "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-900/30 dark:text-danger-400";
      case "COMPLETED":
      case "PAID_OUT": return "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400";
      case "CANCELLED": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">System Contracts</CardTitle>
            <CardDescription className="text-xs">View and manage all live contracts on the platform</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                className="pl-9 bg-background h-9 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 size-9">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Job / Project</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Parties</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contractsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground italic">
                    No contracts match your criteria.
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 py-4 font-mono text-[10px] text-muted-foreground">
                      {contract.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-foreground">{contract.jobTitle ?? contract.job?.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">{contract.currency} ESCROW</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <span className="text-muted-foreground font-medium">C:</span> {contract.clientName ?? contract.client?.name}
                      </div>
                      <div className="mt-1">
                        <span className="text-muted-foreground font-medium">A:</span> {contract.artisanName ?? contract.artisan?.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-foreground">
                      {formatCurrency(contract.amount)}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className={`capitalize text-[10px] ${getStatusBg(contract.status)}`}>
                        {contract.status.toLowerCase().replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button asChild variant="ghost" size="sm" className="h-8 text-[11px]">
                        <Link href={`/admin/contracts/${contract.id}`}>
                          View Details
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || contractsLoading}
            className="text-xs"
          >
            <ChevronLeft className="size-4 mr-1" />
            Previous
          </Button>
          <span className="text-xs text-muted-foreground font-medium">Page {page}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (contractsResponse?.meta?.nextCursor && page === cursors.length) {
                setCursors((prev) => [...prev, contractsResponse.meta!.nextCursor as string]);
              }
              setPage((p) => p + 1);
            }}
            disabled={!contractsResponse?.meta?.nextCursor || contractsLoading}
            className="text-xs"
          >
            Next
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default AdminContractsList;
