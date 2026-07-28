"use client";

import { useClientFinances } from "../hooks/useClientFinances";
import { ClientBalanceCards } from "./ClientBalanceCards";
import { FundAccountCard } from "./FundAccountCard";
import { ActivityTimeline } from "../../shared/components/ActivityTimeline";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyDeposit } from "../hooks/useClientFinances";
import { toast } from "sonner";

export function ClientFinanceWorkspace() {
  const { balance, transactions, isLoading, isError, refetch } = useClientFinances();
  const verifyDepositMutation = useVerifyDeposit();
  const searchParams = useSearchParams();

  useEffect(() => {
    const trxref = searchParams?.get("trxref");
    if (trxref && !verifyDepositMutation.isPending && !verifyDepositMutation.isSuccess) {
      const toastId = toast.loading("Verifying payment...");
      verifyDepositMutation.mutate(
        { reference: trxref },
        {
          onSuccess: () => {
            toast.success("Payment verified successfully. Funds added to your wallet.", { id: toastId });
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          },
          onError: (err: any) => {
            toast.error(err?.message || err?.error?.message || "Failed to verify payment.", { id: toastId });
          },
        }
      );
    }
  }, [searchParams, verifyDepositMutation]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-destructive/20 bg-destructive/5">
        <p className="text-destructive font-medium">Failed to load your financial data.</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 text-sm font-medium bg-background border rounded-md hover:bg-accent"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finances & Escrow</h1>
        <p className="text-muted-foreground mt-1">
          Manage your balance, fund your account, and track escrowed payments.
        </p>
      </div>

      <ClientBalanceCards balance={balance} />

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 order-last md:order-first">
          <FundAccountCard />
        </div>
        
        <div className="md:col-span-8">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-lg font-semibold tracking-tight">Activity Timeline</h2>
              <p className="text-sm text-muted-foreground">Recent deposits and escrow locks.</p>
            </div>
            <div className="p-6">
              <ActivityTimeline transactions={transactions} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
