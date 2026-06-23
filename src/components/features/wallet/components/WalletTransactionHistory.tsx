import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { FinancialAmount } from "@/components/ui/financial-amount";
import { CreditCard } from "lucide-react";
import { formatDate } from "@/lib/formatters";

interface Transaction {
  id: string;
  type: string;
  reference?: string | null;
  status: string;
  amount: number;
  createdAt: string;
}

interface WalletTransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
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

export function WalletTransactionHistory({ transactions, isLoading }: WalletTransactionHistoryProps) {
  return (
    <Card className="border-border/80 bg-card">
      <CardHeader>
        <CardTitle>Transaction history</CardTitle>
        <CardDescription>Every balance change is recorded here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
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
  );
}
