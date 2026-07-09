"use client";

import { useUser } from "@/features/auth";
import { useArtisanEarnings } from "../hooks/useArtisanEarnings";
import { ArtisanBalanceCards } from "./ArtisanBalanceCards";
import { WithdrawEarningsCard } from "./WithdrawEarningsCard";
import { ActivityTimeline } from "../../shared/components/ActivityTimeline";

export function ArtisanFinanceWorkspace() {
  const { data: user } = useUser();
  const { balance, transactions, isLoading, isError, refetch } = useArtisanEarnings();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-destructive/20 bg-destructive/5">
        <p className="text-destructive font-medium">Failed to load your earnings data.</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Earnings & Payouts</h1>
        <p className="text-muted-foreground mt-1">
          Track your cleared earnings, pending escrow, and request withdrawals to your bank.
        </p>
      </div>

      <ArtisanBalanceCards balance={balance} />

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 order-last md:order-first">
          <WithdrawEarningsCard user={user || {}} />
        </div>
        
        <div className="md:col-span-8">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-lg font-semibold tracking-tight">Financial Activity</h2>
              <p className="text-sm text-muted-foreground">Your recent earnings and payouts.</p>
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
