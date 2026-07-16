"use client";

import { useState } from "react";
import { useAdminTransactions, useAdminContractStats } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export function FinancialOperations() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [filterType, setFilterType] = useState<string>("");
  
  const { data: stats, isLoading: isStatsLoading } = useAdminContractStats();
  const { data: transactionsData, isLoading: isTransactionsLoading } = useAdminTransactions({
    cursor,
    limit: 20,
    ...(filterType ? { type: filterType } : {})
  });

  if (isStatsLoading || isTransactionsLoading) {
    return <DashboardLoadingState />;
  }

  const transactions = transactionsData?.data || [];
  const meta = transactionsData?.meta;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Operations</h1>
        <p className="text-muted-foreground mt-1">Monitor ledgers, escrow, and platform revenue.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalVolume || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Escrow Holding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.escrowVolume || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Payout Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats?.payoutVolume || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Refund Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(stats?.refundVolume || 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Transactions</CardTitle>
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border rounded-md text-sm"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCursor(undefined);
              }}
            >
              <option value="">All Types</option>
              <option value="FUNDING">Funding</option>
              <option value="PAYOUT">Payout</option>
              <option value="PLATFORM_FEE">Platform Fee</option>
              <option value="REFUND">Refund</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No transactions found.</TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[150px]">
                        {tx.reference || tx.id}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.type.replace(/_/g, ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            tx.status === "COMPLETED" ? "default" : 
                            tx.status === "FAILED" ? "destructive" : 
                            "secondary"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={
                          tx.type === "PAYOUT" || tx.type === "REFUND" ? "text-destructive" : 
                          tx.type === "FUNDING" ? "text-green-600" : ""
                        }>
                          {tx.type === "PAYOUT" || tx.type === "REFUND" ? "-" : "+"}
                          {formatCurrency(tx.amount)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              disabled={!meta?.nextCursor}
              onClick={() => setCursor(meta?.nextCursor)}
            >
              Next Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
