"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useUser } from "@/hooks/useAuth";
import {
  useWalletDepositInit,
  useWalletDepositVerify,
  useWalletPayoutRequest,
  useCreateWallet,
  useWalletBalance,
  useWalletSummary,
  useWalletTransactions,
  useBanks,
} from "@/hooks/useWallet";
import { formatDate } from "@/lib/formatters";
import { FinancialAmount } from "@/components/ui/financial-amount";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  HelpCircle,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

/* ─── Loading Skeleton ─── */
function BalanceSkeleton() {
  return (
    <Card size="sm">
      <CardContent className="space-y-2 py-3 animate-pulse">
        <div className="h-3 bg-muted rounded w-24" />
        <div className="h-8 bg-muted rounded w-32" />
      </CardContent>
    </Card>
  );
}

function TransactionSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-background/75 p-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-40" />
        </div>
        <div className="h-6 w-20 bg-muted rounded-full" />
      </div>
    </div>
  );
}

export default function WalletWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const canLoadProtectedData = Boolean(user);
  const balanceQuery = useWalletBalance({ enabled: canLoadProtectedData });
  const summaryQuery = useWalletSummary({ enabled: canLoadProtectedData });
  const transactionsQuery = useWalletTransactions({ enabled: canLoadProtectedData });
  const createWalletMutation = useCreateWallet();
  const depositInitMutation = useWalletDepositInit();
  const depositVerifyMutation = useWalletDepositVerify();
  const payoutRequestMutation = useWalletPayoutRequest();
  const [amountInput, setAmountInput] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw" | null>(null);
  const banksQuery = useBanks({ enabled: activeAction === "withdraw" });
  const banksList = banksQuery.data ?? [];
  const paystackProcessedRef = useRef(false);
  const walletAutoCreatedRef = useRef(false);
  const amount = Number(amountInput || 0);

  // Auto-create wallet on first visit
  useEffect(() => {
    if (!canLoadProtectedData || walletAutoCreatedRef.current) return;
    if (balanceQuery.isLoading) return;

    // If balance query failed (wallet doesn't exist), auto-create
    if (balanceQuery.isError || (balanceQuery.data && !balanceQuery.data.exists)) {
      walletAutoCreatedRef.current = true;
      createWalletMutation.mutate(undefined, {
        onSuccess: () => {
          void balanceQuery.refetch();
          void summaryQuery.refetch();
        },
      });
    } else if (balanceQuery.data?.exists) {
      walletAutoCreatedRef.current = true;
    }
  }, [canLoadProtectedData, balanceQuery.isLoading, balanceQuery.isError, balanceQuery.data, createWalletMutation, summaryQuery]);

  // Handle Paystack redirect verification
  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    const status = searchParams.get("status");

    if (reference && !paystackProcessedRef.current && (!status || status === "success")) {
      paystackProcessedRef.current = true;
      depositVerifyMutation.mutate(
        { reference },
        {
          onSuccess: () => {
            toast.success("Payment verified and wallet updated.");
            window.history.replaceState({}, "", window.location.pathname);
            void balanceQuery.refetch();
            void summaryQuery.refetch();
            void transactionsQuery.refetch();
          },
          onError: (error: Error) => {
            toast.error(error.message || "Payment verification failed.");
          },
        },
      );
    }
  }, [balanceQuery, depositVerifyMutation, summaryQuery, transactionsQuery]);

  if (!user) return null;

  const balance = balanceQuery.data;
  const transactions = transactionsQuery.data?.transactions ?? [];
  const isWalletLoading = balanceQuery.isLoading || createWalletMutation.status === "pending";
  const isClient = user.role === "CLIENT";

  const handleAddFunds = () => {
    const toastId = toast.loading("Initializing payment...");
    depositInitMutation.mutate(
      { amount, callbackUrl: window.location.href },
      {
        onSuccess: (data) => {
          toast.dismiss(toastId);
          if (data.authorizationUrl) {
            window.location.href = data.authorizationUrl;
          }
        },
        onError: (error) => {
          toast.error(error.message || "Unable to initialize deposit.", { id: toastId });
        },
      },
    );
  };

  const handleWithdrawFunds = () => {
    if (!bankCode || !accountNumber) {
      toast.error("Please enter your bank code and account number.");
      return;
    }
    const toastId = toast.loading("Submitting payout request...");
    payoutRequestMutation.mutate(
      { amount, bankCode, accountNumber },
      {
        onSuccess: () => {
          toast.success("Payout request submitted for approval.", { id: toastId });
          setAmountInput("");
          setBankCode("");
          setAccountNumber("");
          setActiveAction(null);
        },
        onError: (error) => {
          toast.error(error.message || "Unable to submit payout request.", { id: toastId });
        },
      },
    );
  };

  return (
    <main className="space-y-6">
      {/* ─── Page Header ─── */}
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Wallet</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            Your wallet holds funds used for escrow payments. When you hire an artisan, money
            moves from your wallet into secure escrow until the job is complete.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ─── First-time User Onboarding ─── */}
      {!isWalletLoading && transactions.length === 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-5">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="size-5 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Welcome to your wallet!</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isClient
                    ? "Your wallet is where you'll fund escrow contracts. Add funds first, then when you accept and contract an artisan, the agreed amount is locked in secure escrow until you approve the work."
                    : "Your wallet receives payments when clients release escrow after you complete a job. You can withdraw earnings to your bank account at any time."}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {isClient ? (
                    <>
                      <Button size="sm" onClick={() => setActiveAction("deposit")}>
                        <ArrowDownToLine className="size-3.5" />
                        Add funds to get started
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/jobs">Browse or post jobs</Link>
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/jobs">Find work to start earning</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Balance Cards ─── */}
      <section className="grid gap-4 md:grid-cols-3">
        {isWalletLoading ? (
          <>
            <BalanceSkeleton />
            <BalanceSkeleton />
            <BalanceSkeleton />
          </>
        ) : (
          <>
            <Card size="sm">
              <CardContent className="space-y-1 py-2">
                <div className="flex items-center gap-1.5">
                  <Wallet className="size-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Total balance</p>
                </div>
                <p className="text-3xl font-semibold text-amount-primary">
                  <FinancialAmount amount={balance?.balance ?? 0} size="3xl" />
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardContent className="space-y-1 py-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Locked in escrow</p>
                </div>
                <p className="text-3xl font-semibold text-neutral-amount">
                  <FinancialAmount amount={balance?.frozen ?? 0} size="3xl" type="neutral" />
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardContent className="space-y-1 py-2">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="size-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Available to use</p>
                </div>
                <p className="text-3xl font-semibold text-positive-balance">
                  <FinancialAmount amount={balance?.available ?? 0} size="3xl" type="positive" />
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </section>

      {/* ─── Quick Actions ─── */}
      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="border-border/80 bg-card">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>
              Add funds to your wallet or withdraw to your bank account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant={activeAction === "deposit" ? "default" : "outline"}
                onClick={() => {
                  setActiveAction(activeAction === "deposit" ? null : "deposit");
                  setAmountInput("");
                }}
                className="flex-1"
              >
                <ArrowDownToLine className="size-4" />
                Add funds
              </Button>
              <Button
                variant={activeAction === "withdraw" ? "default" : "outline"}
                onClick={() => {
                  setActiveAction(activeAction === "withdraw" ? null : "withdraw");
                  setAmountInput("");
                  setBankCode(user.payoutBankCode || "");
                  setAccountNumber(user.payoutAccountNumber || "");
                }}
                className="flex-1"
              >
                <ArrowUpFromLine className="size-4" />
                Request Payout
              </Button>
            </div>

            {/* Action form */}
            {activeAction && (
              <div className="rounded-lg border border-border bg-surface-muted/30 p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">
                  {activeAction === "deposit" ? "Add funds to wallet" : "Request payout to bank account"}
                </p>
                
                {activeAction === "withdraw" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Select value={bankCode} onValueChange={setBankCode} disabled={banksQuery.isLoading}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={banksQuery.isLoading ? "Loading banks..." : "Select your bank"} />
                        </SelectTrigger>
                        <SelectContent>
                          {banksList.filter(b => b && b.code).map((bank) => (
                            <SelectItem key={bank.code.toString()} value={bank.code.toString()}>
                              {bank.name || "Unknown Bank"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="text"
                      placeholder="Account Number (10 digits)"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </>
                )}

                <Input
                  type="number"
                  placeholder="Enter amount (₦)"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  min={1}
                />

                <div className="flex gap-2">
                  <Button
                    disabled={
                      amount <= 0 ||
                      (activeAction === "deposit"
                        ? depositInitMutation.status === "pending"
                        : payoutRequestMutation.status === "pending")
                    }
                    onClick={activeAction === "deposit" ? handleAddFunds : handleWithdrawFunds}
                    className="flex-1"
                  >
                    {(activeAction === "deposit"
                      ? depositInitMutation.status
                      : payoutRequestMutation.status) === "pending" ? (
                      <><Loader2 className="size-4 animate-spin" /> Processing...</>
                    ) : activeAction === "deposit" ? (
                      "Proceed to Payment"
                    ) : (
                      "Submit Payout Request"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setActiveAction(null);
                      setAmountInput("");
                      setBankCode("");
                      setAccountNumber("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Explainer Card */}
        <Card className="border-border/80 bg-primary/5">
          <CardHeader>
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Info className="size-5 text-primary" />
            </div>
            <CardTitle>How your wallet works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <div className="flex gap-3">
              <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
              <p><strong className="text-foreground">Add funds</strong> — Deposit money into your wallet balance.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
              <p><strong className="text-foreground">Escrow locks</strong> — When you create a contract, the agreed amount is locked in escrow from your balance.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
              <p><strong className="text-foreground">Release or refund</strong> — Approve the work to release payment, or request a refund if needed.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Transaction History ─── */}
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
          <CardDescription>Every balance change is recorded here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {transactionsQuery.isLoading ? (
            <>
              <TransactionSkeleton />
              <TransactionSkeleton />
              <TransactionSkeleton />
            </>
          ) : transactions.length ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="rounded-lg border border-border bg-background/75 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.reference ? `Ref: ${transaction.reference}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={transaction.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="text-amount-primary font-medium">
                    <FinancialAmount amount={transaction.amount} size="sm" />
                  </span>
                  <span>{formatDate(transaction.createdAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/30 p-10 text-center">
              <div className="size-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                <CreditCard className="size-6 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">No transactions yet</p>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-sm leading-relaxed">
                Deposits, withdrawals, and escrow movements will appear here once you start using your wallet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
