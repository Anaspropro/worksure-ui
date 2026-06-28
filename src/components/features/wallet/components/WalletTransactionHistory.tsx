import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { FinancialAmount } from "@/components/ui/financial-amount";
import { CreditCard, ArrowDownToLine, ArrowUpFromLine, Lock, Unlock, Banknote } from "lucide-react";
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
    <div className="rounded-xl border border-border/50 bg-background/40 p-4 animate-pulse flex items-center gap-4">
      <div className="size-10 rounded-full bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-3 bg-muted rounded w-32" />
      </div>
      <div className="h-6 w-20 bg-muted rounded-full" />
    </div>
  );
}

function getTransactionIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes('deposit')) return <ArrowDownToLine className="size-5 text-emerald-500" />;
  if (t.includes('withdraw')) return <ArrowUpFromLine className="size-5 text-rose-500" />;
  if (t.includes('escrow')) return <Lock className="size-5 text-amber-500" />;
  if (t.includes('release')) return <Unlock className="size-5 text-blue-500" />;
  return <Banknote className="size-5 text-primary" />;
}

function getTransactionIconBg(type: string) {
  const t = type.toLowerCase();
  if (t.includes('deposit')) return "bg-emerald-500/10 border-emerald-500/20";
  if (t.includes('withdraw')) return "bg-rose-500/10 border-rose-500/20";
  if (t.includes('escrow')) return "bg-amber-500/10 border-amber-500/20";
  if (t.includes('release')) return "bg-blue-500/10 border-blue-500/20";
  return "bg-primary/10 border-primary/20";
}

function getAmountColor(type: string, status: string) {
  if (status.toLowerCase() !== 'success' && status.toLowerCase() !== 'completed') return "text-muted-foreground";
  const t = type.toLowerCase();
  if (t.includes('deposit') || t.includes('release')) return "text-emerald-500";
  if (t.includes('withdraw') || t.includes('escrow')) return "text-foreground";
  return "text-foreground";
}

export function WalletTransactionHistory({ transactions, isLoading }: WalletTransactionHistoryProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Transaction History</CardTitle>
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
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-border/50 bg-background/40 p-4 transition-colors hover:bg-background/60 hover:border-primary/20"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`size-10 rounded-full border flex items-center justify-center shrink-0 ${getTransactionIconBg(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground tracking-tight">{transaction.type}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                      {formatDate(transaction.createdAt)} {transaction.reference ? `• Ref: ${transaction.reference}` : ""}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                  <StatusBadge status={transaction.status} />
                  <span className={`font-medium text-right min-w-[80px] ${getAmountColor(transaction.type, transaction.status)}`}>
                    {transaction.type.toLowerCase().includes('withdraw') || transaction.type.toLowerCase().includes('escrow') ? '-' : '+'}
                    <FinancialAmount amount={transaction.amount} size="sm" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-surface-muted/30 p-12 text-center">
            <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <CreditCard className="size-8 text-muted-foreground/40" />
            </div>
            <p className="text-base font-semibold text-foreground">No transactions yet</p>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Deposits, withdrawals, and escrow movements will appear here once you start using your wallet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
