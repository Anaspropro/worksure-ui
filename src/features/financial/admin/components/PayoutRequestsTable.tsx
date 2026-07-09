import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FinancialAmount } from "@/components/ui/financial-amount";
import { formatDate } from "@/lib/formatters";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminPayoutRequests, useProcessPayout } from "../hooks/useAdminFinances";

export function PayoutRequestsTable() {
  const { data, isLoading } = useAdminPayoutRequests();
  const processPayoutMutation = useProcessPayout();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const transactions = data?.data || [];
  const pendingPayouts = transactions.filter((t) => t.status === "PENDING");
  const completedPayouts = transactions.filter((t) => t.status === "COMPLETED");

  const handleProcessPayout = (transactionId: string) => {
    setProcessingId(transactionId);
    const toastId = toast.loading("Processing payout via Paystack...");
    processPayoutMutation.mutate(transactionId, {
      onSuccess: () => {
        toast.success("Payout processed successfully", { id: toastId });
        setProcessingId(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to process payout", { id: toastId });
        setProcessingId(null);
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Pending Payouts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Pending Requests ({pendingPayouts.length})</h2>
        {isLoading ? (
          <div className="flex items-center justify-center p-8 border rounded-lg bg-card/50">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : pendingPayouts.length === 0 ? (
          <Card className="border-dashed bg-card/30">
            <CardContent className="py-12 text-center text-muted-foreground">
              No pending payout requests at this time.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingPayouts.map((tx) => {
              const meta = tx.metadata as { bankCode?: string; accountNumber?: string; bankName?: string } | null;
              return (
                <Card key={tx.id} className="overflow-hidden border-border bg-card shadow-sm transition-all hover:border-primary/20">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg">
                            <FinancialAmount amount={tx.amount} />
                          </span>
                          <StatusBadge status={tx.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Requested on {formatDate(tx.createdAt)}
                        </p>
                        {meta?.bankCode && meta?.accountNumber && (
                          <div className="text-xs font-mono bg-muted p-2 rounded-md inline-block text-muted-foreground border border-border/50">
                            <span className="font-semibold text-foreground mr-1">{meta.bankName || 'Bank'}:</span> 
                            {meta.bankCode} • Acct: {meta.accountNumber}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => handleProcessPayout(tx.id)}
                        disabled={processingId === tx.id || processPayoutMutation.status === "pending"}
                        className="w-full sm:w-auto shadow-sm h-11 px-6"
                      >
                        {processingId === tx.id ? (
                          <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-4 mr-2" />
                            Approve & Pay
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Payouts Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-medium tracking-tight">Recent Completed Payouts</h2>
        {completedPayouts.length === 0 && !isLoading ? (
          <p className="text-muted-foreground text-sm">No completed payouts recently.</p>
        ) : (
          <div className="grid gap-3">
            {completedPayouts.slice(0, 10).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border bg-surface/30">
                <div>
                  <p className="font-medium text-foreground">
                    <FinancialAmount amount={tx.amount} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Processed {tx.completedAt ? formatDate(tx.completedAt) : formatDate(tx.createdAt)}
                  </p>
                </div>
                <StatusBadge status={tx.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
