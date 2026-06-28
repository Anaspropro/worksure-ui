import { Card, CardContent } from "@/components/ui/card";
import { FinancialAmount } from "@/components/ui/financial-amount";
import { CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface WalletBalanceCardsProps {
  balance: {
    balance: number;
    frozen: number;
    available: number;
  };
}

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

export function WalletBalanceCards({ balance }: WalletBalanceCardsProps) {
  return (
    <motion.section 
      className="grid gap-4 md:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Card size="sm" className="border-border bg-card shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Wallet className="size-16" />
          </div>
          <CardContent className="space-y-1 py-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Wallet className="size-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total balance</p>
            </div>
            <p className="text-4xl font-bold tracking-tight text-foreground pt-2">
              <FinancialAmount amount={balance?.balance ?? 0} size="3xl" />
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card size="sm" className="border-border bg-card shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-amber-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-amber-500">
            <ShieldCheck className="size-16" />
          </div>
          <CardContent className="space-y-1 py-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-500/10">
                <ShieldCheck className="size-4 text-amber-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Locked in escrow</p>
            </div>
            <p className="text-4xl font-bold tracking-tight text-amber-500 pt-2">
              <FinancialAmount amount={balance?.frozen ?? 0} size="3xl" type="neutral" />
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card size="sm" className="border-border bg-card shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-emerald-500/20">
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-emerald-500">
            <CreditCard className="size-16" />
          </div>
          <CardContent className="space-y-1 py-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-500/10">
                <CreditCard className="size-4 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available to use</p>
            </div>
            <p className="text-4xl font-bold tracking-tight text-emerald-500 pt-2">
              <FinancialAmount amount={balance?.available ?? 0} size="3xl" type="positive" />
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}

function SkeletonCard() {
  return (
    <Card size="sm" className="border-border bg-card shadow-sm">
      <CardContent className="space-y-3 py-4 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-muted" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
        <div className="h-10 bg-muted rounded w-32 mt-2" />
      </CardContent>
    </Card>
  );
}

export function BalanceCardsSkeleton() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </section>
  );
}
