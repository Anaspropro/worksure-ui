"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, Wallet, MessageSquare, Activity as ActivityIcon, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

import { ContractHeader } from "../../components/ContractHeader";
import { NextRequiredAction, NextActionType } from "../../components/NextRequiredAction";
import { ContractProgress } from "../../components/ContractProgress";
import { ContractTimeline } from "../../components/ContractTimeline";
import { EscrowSummary } from "../../components/EscrowSummary";
import { ParticipantCard } from "../../components/ParticipantCard";
import { ActivityFeed } from "../../components/ActivityFeed";
import { ContractChatPanel } from "../../components/ContractChatPanel";
import { DeliverableList } from "../../deliverables/components/DeliverableList";

import {
  useContract,
  useFundContract,
  useConfirmCompletion,
  useReleaseEscrow,
  useRefundContract,
  useVerifyContractPayment,
} from "../../hooks/useContracts";
import { formatCurrency } from "@/shared/lib/formatters";
import type { User } from "@/types";

export function ClientContractDetail({
  contractId,
  user,
}: {
  contractId: string;
  user: User;
}) {
  const contractQuery = useContract(contractId);
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();
  const refundContractMutation = useRefundContract();
  const verifyPaymentMutation = useVerifyContractPayment();
  const paystackProcessedRef = useRef(false);

  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "deliverables" | "escrow" | "messages" | "activity">("overview");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    const status = searchParams.get("status");

    if (reference && !paystackProcessedRef.current && (!status || status === "success")) {
      paystackProcessedRef.current = true;
      verifyPaymentMutation.mutate(
        { reference, contractId },
        {
          onSuccess: () => {
            toast.success("Payment verified. Escrow funded.");
            window.history.replaceState({}, "", window.location.pathname);
            void contractQuery.refetch();
          },
          onError: (err: any) => {
            toast.error(err.message || "Payment verification failed.");
          },
        }
      );
    }
  }, [verifyPaymentMutation, contractQuery, contractId]);

  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  const contract = contractQuery.data;

  if (contractQuery.isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-24 bg-muted rounded-2xl" />
        <div className="h-10 bg-muted rounded-lg w-1/3" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-48 bg-muted rounded-2xl md:col-span-2" />
          <div className="h-48 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-foreground">Contract not found</h3>
        <Button asChild size="sm" className="mt-4">
          <Link href="/contracts">Back to contracts</Link>
        </Button>
      </div>
    );
  }

  const handleNextAction = (action: NextActionType) => {
    if (action === "FUND_ESCROW") {
      setConfirmAction({
        title: "Fund Contract Escrow",
        description: `Fund this contract for ${formatCurrency(contract.amount)}? The funds will be locked securely in escrow.`,
        onConfirm: () => {
          const toastId = toast.loading("Initializing checkout payment...");
          fundContractMutation.mutate({
            contractId: contract.id,
            email: user.email,
            callbackUrl: window.location.href,
          }, {
            onSuccess: (data) => {
              toast.dismiss(toastId);
              if (data.authorizationUrl) {
                window.location.href = data.authorizationUrl;
              }
            },
            onError: (err: any) => {
              toast.error(err.message || "Failed to initialize payment.", { id: toastId });
            }
          });
        }
      });
    } else if (action === "CLIENT_APPROVE") {
      setConfirmAction({
        title: "Confirm Project Completion",
        description: "Verify and approve project completion? This indicates satisfaction with deliverables.",
        onConfirm: () => {
          confirmCompletionMutation.mutate({
            contractId: contract.id,
            isClient: true,
          }, {
            onSuccess: () => {
              toast.success("Completion confirmed!");
            }
          });
        }
      });
    } else if (action === "RELEASE_PAYMENT") {
      setConfirmAction({
        title: "Release Escrow Payout",
        description: `Authorize payout release of ${formatCurrency(contract.amount)} to the artisan? This is irreversible.`,
        onConfirm: () => {
          releaseEscrowMutation.mutate(contract.id, {
            onSuccess: () => {
              toast.success("Escrow payout authorized!");
            }
          });
        }
      });
    }
  };

  const handleRefund = () => {
    setConfirmAction({
      title: "Request Refund Closeout",
      description: "Request full refund? This cancels active agreement terms and locks dispute logs.",
      onConfirm: () => {
        refundContractMutation.mutate({
          contractId: contract.id,
          reason: "Client requested refund closeout",
        }, {
          onSuccess: () => {
            toast.success("Refund processed.");
          }
        });
      }
    });
  };

  const isBusy =
    fundContractMutation.status === "pending" ||
    confirmCompletionMutation.status === "pending" ||
    releaseEscrowMutation.status === "pending" ||
    refundContractMutation.status === "pending" ||
    verifyPaymentMutation.status === "pending";

  const tabs = [
    { id: "overview", label: "Overview", icon: <FileText className="size-4 shrink-0" /> },
    { id: "timeline", label: "Lifecycle Timeline", icon: <Clock className="size-4 shrink-0" /> },
    { id: "deliverables", label: "Deliverables", icon: <FileText className="size-4 shrink-0" /> },
    { id: "escrow", label: "Escrow Details", icon: <Wallet className="size-4 shrink-0" /> },
    { id: "messages", label: "Messages / Chat", icon: <MessageSquare className="size-4 shrink-0" /> },
    { id: "activity", label: "Activity Log", icon: <ActivityIcon className="size-4 shrink-0" /> },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="h-9">
          <Link href="/contracts">
            <ArrowLeft className="size-4 mr-2" />
            Back to agreements
          </Link>
        </Button>
      </div>

      {/* Reusable premium ContractHeader */}
      <ContractHeader contract={contract} role="CLIENT" />

      {/* Prominent Next Required Action */}
      <NextRequiredAction
        contract={contract}
        role="CLIENT"
        onAction={handleNextAction}
        isBusy={isBusy}
      />

      {/* Contract Stepper Progress */}
      <ContractProgress contract={contract} />

      {/* Interactive Tabs Header */}
      <div className="flex border-b border-border overflow-x-auto gap-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="grid gap-6">
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Project Scope</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {contract.job?.description ?? "No description available."}
                  </p>
                </CardContent>
              </Card>

              {/* Counterparts cards */}
              <ParticipantCard contract={contract} role="CLIENT" />
            </div>

            <div className="space-y-6">
              {/* Overview Actions Box */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {contract.status === "ACTIVE" && !contract.escrowReleased && (
                    <Button
                      variant="outline"
                      onClick={handleRefund}
                      disabled={isBusy}
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                    >
                      Request Refund Closeout
                    </Button>
                  )}
                  {contract.status === "COMPLETED" && (
                    <Button asChild variant="outline" className="w-full text-xs">
                      <Link href="/reviews">
                        <Star className="size-4 mr-2" />
                        Submit Review
                      </Link>
                    </Button>
                  )}
                  <p className="text-[10px] text-center text-muted-foreground mt-2">
                    Action records are securely auditable in our ledger logs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Lifecycle Progress Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ContractTimeline contractId={contract.id} />
            </CardContent>
          </Card>
        )}

        {activeTab === "deliverables" && (
          <DeliverableList
            contractId={contract.id}
            role="CLIENT"
          />
        )}

        {activeTab === "escrow" && (
          <EscrowSummary contract={contract} />
        )}

        {activeTab === "messages" && (
          <ContractChatPanel contract={contract} />
        )}

        {activeTab === "activity" && (
          <ActivityFeed contractId={contract.id} />
        )}
      </div>

      {/* Confirmation modal */}
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
                Confirm Action
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ClientContractDetail;
