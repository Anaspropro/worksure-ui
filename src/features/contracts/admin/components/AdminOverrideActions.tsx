"use client";

import { useState } from "react";
import type { Contract } from "@/types";
import { useReleaseEscrow, useRefundContract } from "../../hooks/useContracts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Zap, ShieldAlert, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function AdminOverrideActions({
  contract,
  onRefetch,
}: {
  contract: Contract;
  onRefetch?: () => void;
}) {
  const releaseMutation = useReleaseEscrow();
  const refundMutation = useRefundContract();

  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  const handleForceRelease = () => {
    setConfirmAction({
      title: "Force Release Escrow Payout",
      description: "Force immediate escrow release payout to the artisan, bypassing standard user confirmations? This is highly destructive and irreversible.",
      onConfirm: () => {
        const toastId = toast.loading("Invoking manual payout release...");
        releaseMutation.mutate(contract.id, {
          onSuccess: () => {
            toast.success("Funds manually released!", { id: toastId });
            onRefetch?.();
          },
          onError: (err: any) => {
            toast.error(err.message || "Manual release failed.", { id: toastId });
          },
        });
      },
    });
  };

  const handleForceRefund = () => {
    setConfirmAction({
      title: "Force Escrow Refund",
      description: "Force immediate escrow refund back to the client, cancelling the contract terms? This is highly destructive and irreversible.",
      onConfirm: () => {
        const toastId = toast.loading("Invoking manual refund release...");
        refundMutation.mutate(
          {
            contractId: contract.id,
            reason: "Admin force refund override",
          },
          {
            onSuccess: () => {
              toast.success("Funds manually refunded!", { id: toastId });
              onRefetch?.();
            },
            onError: (err: any) => {
              toast.error(err.message || "Manual refund failed.", { id: toastId });
            },
          }
        );
      },
    });
  };

  const isBusy = releaseMutation.status === "pending" || refundMutation.status === "pending";

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Zap className="size-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">Administrative Override Console</CardTitle>
              <CardDescription className="text-xs">
                Perform manual overrides on escrow locks in case of verified payment gateway errors.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-4">
            <h4 className="text-xs font-bold text-rose-500 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert className="size-4 shrink-0" />
              Destructive Operations
            </h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              These actions override standard double-signature confirmations. Manual releases execute immediate settlements to artisan payout targets. Manual refunds return locked balances to client user portfolios.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleForceRelease}
              disabled={isBusy || contract.escrowReleased}
              className="text-xs flex items-center gap-1.5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
            >
              <CheckCircle className="size-4 shrink-0" />
              Force Release Payout
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleForceRefund}
              disabled={isBusy || contract.escrowReleased || contract.status === "REFUNDED"}
              className="text-xs flex items-center gap-1.5 border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
            >
              <Trash2 className="size-4 shrink-0" />
              Force Escrow Refund
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-bold text-foreground">{confirmAction.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{confirmAction.description}</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmAction(null)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  confirmAction.onConfirm();
                  setConfirmAction(null);
                }}
              >
                Confirm Destructive Action
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminOverrideActions;
