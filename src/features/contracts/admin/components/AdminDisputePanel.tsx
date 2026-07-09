"use client";

import { useState } from "react";
import type { Contract } from "@/types";
import { useResolveDispute } from "../hooks/useAdminContracts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { ShieldAlert, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function AdminDisputePanel({
  contract,
}: {
  contract: Contract;
}) {
  const [decision, setDecision] = useState("");
  const [notes, setNotes] = useState("");
  const resolveDisputeMutation = useResolveDispute();

  const isDisputed = contract.status === "DISPUTED";

  const handleResolve = (actionType: "RELEASE_TO_ARTISAN" | "REFUND_TO_CLIENT" | "SPLIT_50_50") => {
    if (!notes.trim()) {
      toast.error("Please provide investigation audit notes before resolving.");
      return;
    }

    const disputeId = contract.id; // Scoped to contract for mapping simplicity
    const toastId = toast.loading("Processing system dispute override...");

    resolveDisputeMutation.mutate(
      {
        disputeId,
        decision: actionType,
        notes,
        contractId: contract.id,
      },
      {
        onSuccess: () => {
          toast.success("Dispute resolved successfully!", { id: toastId });
          setNotes("");
        },
        onError: (err: any) => {
          toast.error(err.message || "Override failed.", { id: toastId });
        },
      }
    );
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <ShieldAlert className="size-5 text-rose-500" />
          </div>
          <div>
            <CardTitle className="text-base">Operational Dispute Center</CardTitle>
            <CardDescription className="text-xs">
              Resolve conflicting party expectations and perform escrow settlements.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isDisputed ? (
          <>
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                Investigator Action Required
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Both parties have locked escrow funds due to a registered milestone dispute. Inspect files, timelines, and chat transcripts to arbitrate.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Audit Investigation Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detail rationale for arbitration decision..."
                className="bg-card text-xs min-h-[100px]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => handleResolve("RELEASE_TO_ARTISAN")}
                disabled={resolveDisputeMutation.status === "pending"}
                className="text-xs flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="size-4 shrink-0" />
                Release to Artisan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve("REFUND_TO_CLIENT")}
                disabled={resolveDisputeMutation.status === "pending"}
                className="text-xs flex items-center gap-1.5 border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
              >
                <Trash2 className="size-4 shrink-0" />
                Refund Client
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve("SPLIT_50_50")}
                disabled={resolveDisputeMutation.status === "pending"}
                className="text-xs"
              >
                Split Escrow 50/50
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/10 rounded-xl border border-dashed border-border/80">
            <p className="text-sm font-medium text-foreground">No active dispute logged</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              This contract is running cleanly. Only contracts in DISPUTED state require operational dispute center attention.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default AdminDisputePanel;
