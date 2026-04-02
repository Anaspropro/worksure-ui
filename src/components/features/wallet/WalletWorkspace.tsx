"use client";

import { useState } from "react";
import AppShell from "@/components/app-shell/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/hooks/useAuth";
import {
  useAddFunds,
  useCreateWallet,
  useWalletBalance,
  useWalletSummary,
  useWalletTransactions,
  useWithdrawFunds,
} from "@/hooks/useWallet";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function WalletWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const balanceQuery = useWalletBalance();
  const summaryQuery = useWalletSummary();
  const transactionsQuery = useWalletTransactions();
  const createWalletMutation = useCreateWallet();
  const addFundsMutation = useAddFunds();
  const withdrawFundsMutation = useWithdrawFunds();
  const [amount, setAmount] = useState(0);

  if (!user) {
    return null;
  }

  const balance = balanceQuery.data;
  const summary = summaryQuery.data;
  const transactions = transactionsQuery.data?.transactions ?? [];

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Wallet and Payments</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Keep your balance, frozen escrow, and transaction history visible before taking payment actions.
            </CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Total balance</p>
              <p className="text-3xl font-semibold text-foreground">{formatCurrency(balance?.balance)}</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Frozen in escrow</p>
              <p className="text-3xl font-semibold text-foreground">{formatCurrency(balance?.frozen)}</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Available to use</p>
              <p className="text-3xl font-semibold text-foreground">{formatCurrency(balance?.available)}</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>Wallet actions</CardTitle>
              <CardDescription>Use explicit funding or withdrawal actions with a visible amount.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                onClick={() => createWalletMutation.mutate()}
                disabled={createWalletMutation.status === "pending"}
              >
                Create wallet
              </Button>
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={amount <= 0 || addFundsMutation.status === "pending"}
                  onClick={() =>
                    addFundsMutation.mutate({
                      amount,
                      reference: `wallet-add-${Date.now()}`,
                    })
                  }
                >
                  Add funds
                </Button>
                <Button
                  variant="outline"
                  disabled={amount <= 0 || withdrawFundsMutation.status === "pending"}
                  onClick={() =>
                    withdrawFundsMutation.mutate({
                      amount,
                      reference: `wallet-withdraw-${Date.now()}`,
                    })
                  }
                >
                  Withdraw
                </Button>
              </div>
              <div className="rounded-2xl border border-border bg-surface-muted/60 p-4 text-sm text-muted-foreground">
                Recent transactions: {summary?.recentTransactions.length ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)]">
            <CardHeader>
              <CardTitle>Wallet summary</CardTitle>
              <CardDescription>These numbers help you understand whether money is liquid or tied to a live contract.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {(summary?.transactionSummary ?? []).length ? (
                summary?.transactionSummary?.map((entry, index) => (
                  <div key={`${entry.type}-${entry.status}-${index}`} className="rounded-2xl border border-border bg-white/80 p-4">
                    <p className="font-medium text-foreground">
                      {entry.type} - {entry.status}
                    </p>
                    <p className="mt-1">Count: {entry._count?.id ?? 0}</p>
                    <p>Amount: {formatCurrency(entry._sum?.amount ?? 0)}</p>
                  </div>
                ))
              ) : (
                <p>No transaction summary is available yet.</p>
              )}
            </CardContent>
          </Card>
        </section>

        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle>Transaction history</CardTitle>
            <CardDescription>Every balance change is recorded here with its processing state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.length ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="rounded-2xl border border-border bg-background/75 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">Reference: {transaction.reference ?? "N/A"}</p>
                    </div>
                    <StatusBadge status={transaction.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span>{formatCurrency(transaction.amount)}</span>
                    <span>{formatDate(transaction.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 p-6 text-sm text-muted-foreground">
                No wallet activity yet. Funding, withdrawals, and contract-linked transactions will show up here.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
