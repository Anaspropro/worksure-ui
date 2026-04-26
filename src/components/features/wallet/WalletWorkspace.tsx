"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppShell from "@/components/app-shell/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/hooks/useAuth";
import {
  useAddFunds,
  useCreateWallet,
  usePaystackInit,
  usePaystackVerify,
  useWalletBalance,
  useWalletSummary,
  useWalletTransactions,
  useWithdrawFunds,
} from "@/hooks/useWallet";
import { formatDate } from "@/lib/formatters";
import { FinancialAmount } from "@/components/ui/financial-amount";

export default function WalletWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const canLoadProtectedData = Boolean(user);
  const balanceQuery = useWalletBalance({ enabled: canLoadProtectedData });
  const summaryQuery = useWalletSummary({ enabled: canLoadProtectedData });
  const transactionsQuery = useWalletTransactions({ enabled: canLoadProtectedData });
  const createWalletMutation = useCreateWallet();
  const addFundsMutation = useAddFunds();
  const withdrawFundsMutation = useWithdrawFunds();
  const paystackInitMutation = usePaystackInit();
  const paystackVerifyMutation = usePaystackVerify();
  const [amountInput, setAmountInput] = useState("");
  const [paystackAmountInput, setPaystackAmountInput] = useState("");
  const paystackProcessedRef = useRef(false);
  const [paystackStatusMessage, setPaystackStatusMessage] = useState<string | null>(null);
  const amount = Number(amountInput || 0);
  const paystackAmount = Number(paystackAmountInput || 0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    const status = searchParams.get("status");

    if (reference && !paystackProcessedRef.current && (!status || status === "success")) {
      paystackProcessedRef.current = true;
      paystackVerifyMutation.mutate(
        { reference },
        {
          onSuccess: () => {
            toast.success("Paystack deposit verified and wallet updated.");
            setPaystackStatusMessage("Paystack deposit verified and wallet updated.");
            window.history.replaceState({}, "", window.location.pathname);
            void balanceQuery.refetch();
            void summaryQuery.refetch();
            void transactionsQuery.refetch();
          },
          onError: (error: Error) => {
            toast.error(error.message || "Paystack verification failed");
            setPaystackStatusMessage(error.message || "Paystack verification failed");
          },
        },
      );
    }
  }, [balanceQuery, paystackVerifyMutation, summaryQuery, transactionsQuery]);

  if (!user) {
    return null;
  }

  const balance = balanceQuery.data;
  const summary = summaryQuery.data;
  const transactions = transactionsQuery.data?.transactions ?? [];
  const virtualAccount = balance?.virtualAccount ?? summary?.wallet.virtualAccount;

  const handleCreateWallet = () => {
    const toastId = toast.loading("Setting up your wallet...");
    createWalletMutation.mutate(undefined, {
      onSuccess: (result) => {
        toast.success(
          result.created ? "Wallet created successfully." : "Wallet already exists.",
          { id: toastId },
        );
      },
      onError: (error) => {
        toast.error(error.message || "Unable to create wallet.", { id: toastId });
      },
    });
  };

  const handleAddFunds = () => {
    const toastId = toast.loading("Adding funds...");
    addFundsMutation.mutate(
      {
        amount,
        reference: `wallet-add-${Date.now()}`,
      },
      {
        onSuccess: () => {
          toast.success("Funds added successfully.", { id: toastId });
          setAmountInput("");
        },
        onError: (error) => {
          toast.error(error.message || "Unable to add funds.", { id: toastId });
        },
      },
    );
  };

  const handleWithdrawFunds = () => {
    const toastId = toast.loading("Processing withdrawal...");
    withdrawFundsMutation.mutate(
      {
        amount,
        reference: `wallet-withdraw-${Date.now()}`,
      },
      {
        onSuccess: () => {
          toast.success("Withdrawal completed.", { id: toastId });
          setAmountInput("");
        },
        onError: (error) => {
          toast.error(error.message || "Unable to withdraw funds.", { id: toastId });
        },
      },
    );
  };

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
              <p className="text-3xl font-semibold text-amount-primary">
                <FinancialAmount amount={balance?.balance ?? 0} size="3xl" />
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Frozen in escrow</p>
              <p className="text-3xl font-semibold text-neutral-amount">
                <FinancialAmount amount={balance?.frozen ?? 0} size="3xl" type="neutral" />
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-2">
              <p className="text-sm text-muted-foreground">Available to use</p>
              <p className="text-3xl font-semibold text-positive-balance">
                <FinancialAmount amount={balance?.available ?? 0} size="3xl" type="positive" />
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>Wallet actions</CardTitle>
              <CardDescription>
                Use explicit funding or withdrawal actions with a visible amount.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                onClick={handleCreateWallet}
                disabled={createWalletMutation.status === "pending" || balance?.exists}
              >
                {balance?.exists ? "Wallet already created" : "Create wallet"}
              </Button>
              {virtualAccount ? (
                <div className="rounded-lg border border-border bg-surface-muted/60 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Paystack virtual account</p>
                  <p className="mt-1">
                    {virtualAccount.accountNumber
                      ? `${virtualAccount.bankName ?? "Bank"} - ${virtualAccount.accountNumber}`
                      : "Provisioning in progress"}
                  </p>
                  <p>{virtualAccount.accountName ?? user.name}</p>
                </div>
              ) : null}
              <Input
                type="number"
                placeholder="Amount"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={amount <= 0 || addFundsMutation.status === "pending"}
                  onClick={handleAddFunds}
                >
                  Add funds
                </Button>
                <Button
                  variant="outline"
                  disabled={amount <= 0 || withdrawFundsMutation.status === "pending"}
                  onClick={handleWithdrawFunds}
                >
                  Withdraw
                </Button>
              </div>

              <div className="mt-4 rounded-lg border border-border bg-surface-muted/60 p-4">
                <label className="block text-sm text-muted-foreground" htmlFor="paystackAmount">
                  Paystack top-up amount
                </label>
                <input
                  id="paystackAmount"
                  type="number"
                  min={1}
                  value={paystackAmountInput}
                  onChange={(event) => setPaystackAmountInput(event.target.value)}
                  className="mt-1 w-full rounded-md border p-2"
                />
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    disabled={paystackAmount <= 0 || paystackInitMutation.status === 'pending'}
                    onClick={async () => {
                      if (!user?.email) return;
                      const toastId = toast.loading("Redirecting to Paystack...");
                      try {
                        const result = await paystackInitMutation.mutateAsync({
                          amount: paystackAmount,
                          email: user.email,
                          callbackUrl: `${window.location.origin}/wallet`,
                        });

                        toast.success("Redirecting to Paystack checkout.", { id: toastId });
                        setPaystackAmountInput("");
                        window.location.href = result.authorizationUrl;
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Unable to initialize Paystack.", {
                          id: toastId,
                        });
                      }
                    }}
                  >
                    Deposit with Paystack
                  </Button>
                </div>

                {paystackStatusMessage && (
                  <p className="mt-2 text-sm text-foreground">{paystackStatusMessage}</p>
                )}
              </div>

              <div className="rounded-lg border border-border bg-surface-muted/60 p-4 text-sm text-muted-foreground">
                Recent transactions: {summary?.recentTransactions.length ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-secondary-light/20">
            <CardHeader>
              <CardTitle>Wallet summary</CardTitle>
              <CardDescription>These numbers help you understand whether money is liquid or tied to a live contract.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {(summary?.transactionSummary ?? []).length ? (
                summary?.transactionSummary?.map((entry, index) => (
                  <div key={`${entry.type}-${entry.status}-${index}`} className="rounded-lg border border-border bg-white/80 p-4">
                    <p className="font-medium text-foreground">
                      {entry.type} - {entry.status}
                    </p>
                    <p className="mt-1">Count: {entry._count?.id ?? 0}</p>
                    <p>Amount: <span className="text-amount-primary"><FinancialAmount amount={entry._sum?.amount ?? 0} size="sm" /></span></p>
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
                <div key={transaction.id} className="rounded-lg border border-border bg-background/75 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">Reference: {transaction.reference ?? "N/A"}</p>
                    </div>
                    <StatusBadge status={transaction.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="text-amount-primary">
                      <FinancialAmount amount={transaction.amount} size="sm" />
                    </span>
                    <span>{formatDate(transaction.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-surface-muted/50 p-6 text-sm text-muted-foreground">
                No wallet activity yet. Funding, withdrawals, and contract-linked transactions will show up here.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
