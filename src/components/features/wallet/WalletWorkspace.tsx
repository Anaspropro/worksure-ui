"use client";

import { Suspense } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Wallet } from "lucide-react";
import { useUser } from "@/hooks/useAuth";
import { useWalletTransactions, useWalletBalance, useWalletSummary } from "@/hooks/useWallet";

import { useWalletInitialization } from "./hooks/useWalletInitialization";
import { usePaystackVerification } from "./hooks/usePaystackVerification";
import { WalletBalanceCards, BalanceCardsSkeleton } from "./components/WalletBalanceCards";
import { WalletQuickActions } from "./components/WalletQuickActions";
import { WalletTransactionHistory } from "./components/WalletTransactionHistory";
import { WalletOnboarding } from "./components/WalletOnboarding";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function WalletWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const canLoadProtectedData = Boolean(user);
  
  // Custom hooks for initialization and URL verification
  const { balanceQuery, summaryQuery, isInitializing } = useWalletInitialization(canLoadProtectedData);
  const transactionsQuery = useWalletTransactions({ enabled: canLoadProtectedData });
  
  if (!user) return null;

  const balance = balanceQuery.data;
  const transactions = transactionsQuery.data?.transactions ?? [];
  const isClient = user.role === "CLIENT";

  return (
    <motion.main 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ─── Suspend verification hook reading URL params ─── */}
      <Suspense fallback={null}>
        <VerificationHandler 
          balanceQuery={balanceQuery} 
          summaryQuery={summaryQuery} 
          transactionsQuery={transactionsQuery} 
        />
      </Suspense>

      {/* ─── Page Header ─── */}
      <motion.div variants={itemVariants}>
        <Card className="border-border bg-card shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Wallet className="size-40" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl tracking-tight text-foreground">Wallet</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Your wallet holds funds used for escrow payments. When you hire an artisan, money
              moves from your wallet into secure escrow until the job is complete.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* ─── First-time User Onboarding ─── */}
      {!isInitializing && transactions.length === 0 && (
        <motion.div variants={itemVariants}>
          <WalletOnboarding 
            isClient={isClient} 
            onDeposit={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }} 
          />
        </motion.div>
      )}

      {/* ─── Balance Cards ─── */}
      <motion.div variants={itemVariants}>
        {isInitializing ? (
          <BalanceCardsSkeleton />
        ) : (
          <WalletBalanceCards balance={balance!} />
        )}
      </motion.div>

      {/* ─── Quick Actions & Explainer ─── */}
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <motion.div variants={itemVariants} className="h-full">
          <WalletQuickActions user={user} />
        </motion.div>

        {/* Explainer Card */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-border/50 bg-primary/5 shadow-sm h-full relative overflow-hidden transition-all hover:border-primary/20">
            <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none" />
            <CardHeader className="relative z-10">
              <div className="size-10 rounded-xl bg-background/50 border border-primary/20 flex items-center justify-center mb-2 shadow-sm">
                <Info className="size-5 text-primary" />
              </div>
              <CardTitle>How your wallet works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground relative z-10">
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                <p><strong className="text-foreground">Add funds</strong> — Deposit money into your wallet balance.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                <p><strong className="text-foreground">Escrow locks</strong> — When you create a contract, the agreed amount is locked in escrow from your balance.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                <p><strong className="text-foreground">Release or refund</strong> — Approve the work to release payment, or request a refund if needed.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* ─── Transaction History ─── */}
      <motion.div variants={itemVariants}>
        <WalletTransactionHistory 
          transactions={transactions} 
          isLoading={transactionsQuery.isLoading} 
        />
      </motion.div>
    </motion.main>
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
