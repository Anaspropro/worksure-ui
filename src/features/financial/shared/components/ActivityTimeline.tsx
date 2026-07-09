import * as React from "react";
import { format } from "date-fns";
import { FinancialAmount } from "@/components/ui/financial-amount";
import { StatusBadge } from "@/components/ui/status-badge";
import { WalletTransaction } from "@/types";
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Clock, 
  AlertTriangle,
  Wallet,
  CheckCircle2
} from "lucide-react";

interface ActivityTimelineProps {
  transactions: WalletTransaction[];
  isLoading?: boolean;
}

export function ActivityTimeline({ transactions, isLoading }: ActivityTimelineProps) {
  if (isLoading) {
    return <ActivityTimelineSkeleton />;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border rounded-lg border-dashed">
        <Wallet className="size-10 mb-2 opacity-20" />
        <p>No financial activity yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <ActivityTimelineItem key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}

function ActivityTimelineItem({ transaction }: { transaction: WalletTransaction }) {
  const isDeposit = transaction.type === "DEPOSIT";
  const isWithdrawal = transaction.type === "WITHDRAWAL";
  const isEscrow = transaction.type === "ESCROW_LOCK" || transaction.type === "ESCROW_RELEASE";
  
  const status = transaction.status.toUpperCase();
  const isPending = status === "PENDING";
  const isFailed = status === "FAILED";
  const isCompleted = status === "COMPLETED";

  // Determine icon and color ring
  let Icon = Wallet;
  let ringColor = "bg-secondary text-secondary-foreground";

  if (isDeposit) {
    Icon = ArrowDownToLine;
    ringColor = "bg-primary/10 text-primary";
  } else if (isWithdrawal) {
    Icon = ArrowUpFromLine;
    ringColor = "bg-amber-500/10 text-amber-500";
  } else if (isEscrow) {
    Icon = CheckCircle2;
    ringColor = "bg-blue-500/10 text-blue-500";
  }

  if (isPending) {
    Icon = Clock;
    ringColor = "bg-amber-500/10 text-amber-500";
  } else if (isFailed) {
    Icon = AlertTriangle;
    ringColor = "bg-destructive/10 text-destructive";
  }

  // Determine amount styling
  let amountType: "primary" | "positive" | "negative" | "neutral" = "primary";
  let showSign = false;

  if (isFailed) {
    amountType = "neutral";
  } else if (isDeposit || (isEscrow && transaction.amount > 0)) {
    amountType = "positive";
    showSign = true;
  } else if (isWithdrawal || (isEscrow && transaction.amount < 0)) {
    amountType = "negative";
    showSign = true;
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
      <div className={`p-2 rounded-full mt-0.5 ${ringColor}`}>
        <Icon className="size-5" />
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium leading-none capitalize">
            {transaction.type.toLowerCase().replace(/_/g, " ")}
          </p>
          <FinancialAmount 
            amount={transaction.amount} 
            type={amountType} 
            showSign={showSign} 
            size="sm"
          />
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>{format(new Date(transaction.createdAt), "MMM d, yyyy • h:mm a")}</p>
          <StatusBadge status={status} className="text-[10px] h-5 px-1.5" />
        </div>
        
        {transaction.reference && (
          <p className="text-xs text-muted-foreground/60 font-mono mt-2">
            Ref: {transaction.reference}
          </p>
        )}
      </div>
    </div>
  );
}

function ActivityTimelineSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border bg-card animate-pulse">
          <div className="p-2 rounded-full mt-0.5 bg-muted size-9" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
