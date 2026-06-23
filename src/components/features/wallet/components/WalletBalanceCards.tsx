import { Card, CardContent } from "@/components/ui/card";
import { FinancialAmount } from "@/components/ui/financial-amount";
import { CreditCard, ShieldCheck, Wallet } from "lucide-react";

interface WalletBalanceCardsProps {
  balance: {
    balance: number;
    frozen: number;
    available: number;
  };
}

export function WalletBalanceCards({ balance }: WalletBalanceCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
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
    </section>
  );
}

export function BalanceCardsSkeleton() {
  const SkeletonCard = () => (
    <Card size="sm">
      <CardContent className="space-y-2 py-3 animate-pulse">
        <div className="h-3 bg-muted rounded w-24" />
        <div className="h-8 bg-muted rounded w-32" />
      </CardContent>
    </Card>
  );

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </section>
  );
}
