"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAdminTransactions, useAdminProcessPayout } from "@/hooks/useAdmin";
import { FinancialAmount } from "@/components/ui/financial-amount";
import { formatDate } from "@/lib/formatters";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function PayoutRequestsPage() {
  const { data, isLoading } = useAdminTransactions("PAYOUT");
  const processPayoutMutation = useAdminProcessPayout();
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
    <main className="space-y-6">
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Payout Requests</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            Manage and process pending artisan withdrawal requests. Once processed, funds are transferred to their bank account via Paystack.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Requests ({pendingPayouts.length})</h2>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : pendingPayouts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending payout requests at this time.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingPayouts.map((tx) => (
              <Card key={tx.id} className="overflow-hidden border-border/80">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          <FinancialAmount amount={tx.amount} />
                        </span>
                        <StatusBadge status={tx.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Requested on {formatDate(tx.createdAt)}
                      </p>
                      {(tx.metadata as any)?.bankCode && (tx.metadata as any)?.accountNumber && (
                        <p className="text-xs font-mono bg-muted/50 p-1.5 rounded inline-block mt-2">
                          Bank: {(tx.metadata as any).bankCode} • Acct: {(tx.metadata as any).accountNumber}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleProcessPayout(tx.id)}
                      disabled={processingId === tx.id || processPayoutMutation.status === "pending"}
                      className="w-full sm:w-auto"
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
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-8 border-t">
        <h2 className="text-xl font-semibold">Recent Completed Payouts</h2>
        {completedPayouts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No completed payouts recently.</p>
        ) : (
          <div className="grid gap-3">
            {completedPayouts.slice(0, 10).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border bg-surface/50">
                <div>
                  <p className="font-medium">
                    <FinancialAmount amount={tx.amount} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Processed {tx.completedAt ? formatDate(tx.completedAt) : formatDate(tx.createdAt)}
                  </p>
                </div>
                <StatusBadge status={tx.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
