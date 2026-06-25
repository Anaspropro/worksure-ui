"use client";

import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useUser } from "@/hooks/useAuth";
import { useWalletTransactions, useWalletBalance, useWalletSummary } from "@/hooks/useWallet";

import { useWalletInitialization } from "./hooks/useWalletInitialization";
import { usePaystackVerification } from "./hooks/usePaystackVerification";
import { WalletBalanceCards, BalanceCardsSkeleton } from "./components/WalletBalanceCards";
import { WalletQuickActions } from "./components/WalletQuickActions";
import { WalletTransactionHistory } from "./components/WalletTransactionHistory";
import { WalletOnboarding } from "./components/WalletOnboarding";

export default function WalletWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const canLoadProtectedData = Boolean(user);
  
  // Custom hooks for initialization and URL verification
  const { balanceQuery, summaryQuery, isInitializing } = useWalletInitialization(canLoadProtectedData);
  const transactionsQuery = useWalletTransactions({ enabled: canLoadProtectedData });
  
  // The verification hook is wrapped in a component that requires Suspense since it uses useSearchParams
  
  if (!user) return null;

  const balance = balanceQuery.data;
  const transactions = transactionsQuery.data?.transactions ?? [];
  const isClient = user.role === "CLIENT";

  return (
    <main className="space-y-6">
      {/* ─── Suspend verification hook reading URL params ─── */}
      <Suspense fallback={null}>
        <VerificationHandler 
          balanceQuery={balanceQuery} 
          summaryQuery={summaryQuery} 
          transactionsQuery={transactionsQuery} 
        />
      </Suspense>

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
      {!isInitializing && transactions.length === 0 && (
        <WalletOnboarding 
          isClient={isClient} 
          onDeposit={() => {
            // Can be handled via ref or state context if we wanted to auto-open deposit.
            // For now, it just asks them to use the quick actions below.
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }} 
        />
      )}

      {/* ─── Balance Cards ─── */}
      {isInitializing ? (
        <BalanceCardsSkeleton />
      ) : (
        <WalletBalanceCards balance={balance!} />
      )}

      {/* ─── Quick Actions & Explainer ─── */}
      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <WalletQuickActions user={user} />

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
      <WalletTransactionHistory 
        transactions={transactions} 
        isLoading={transactionsQuery.isLoading} 
      />
    </main>
  );
}

// Wrapping useSearchParams in a component to satisfy Next.js client component rules
function VerificationHandler({ balanceQuery, summaryQuery, transactionsQuery }: {
  balanceQuery: ReturnType<typeof useWalletBalance>;
  summaryQuery: ReturnType<typeof useWalletSummary>;
  transactionsQuery: ReturnType<typeof useWalletTransactions>;
}) {
  usePaystackVerification(balanceQuery, summaryQuery, transactionsQuery);
  return null;
}
