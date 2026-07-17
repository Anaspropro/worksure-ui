"use client";

import { useState } from "react";
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
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { DisputeForm } from "@/features/disputes/components/DisputeForm";
import {
  useContract,
  useConfirmCompletion,
} from "../../hooks/useContracts";
import type { User } from "@/types";

export function ArtisanContractDetail({
  contractId,
  user,
}: {
  contractId: string;
  user: User;
}) {
  const contractQuery = useContract(contractId);
  const confirmCompletionMutation = useConfirmCompletion();

  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "deliverables" | "escrow" | "messages" | "activity">("overview");
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isDisputeFormOpen, setIsDisputeFormOpen] = useState(false);
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
    if (action === "ARTISAN_SUBMIT") {
      setConfirmAction({
        title: "Confirm completion & Submit work",
        description: "Submit completion confirmation to the client? This triggers payment verification audits and requests escrow release approval.",
        onConfirm: () => {
          confirmCompletionMutation.mutate({
            contractId: contract.id,
            isClient: false,
          }, {
            onSuccess: () => {
              toast.success("Project completion submitted to client!");
            }
          });
        }
      });
    } else if (action === "LEAVE_REVIEW") {
      setIsReviewFormOpen(true);
    }
  };

  const isBusy = confirmCompletionMutation.status === "pending";

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
            Back to projects
          </Link>
        </Button>
      </div>

      {/* Reusable premium ContractHeader */}
      <ContractHeader 
        contract={contract} 
        role="ARTISAN" 
        onRaiseDispute={() => setIsDisputeFormOpen(true)}
      />

      {/* Prominent Next Required Action */}
      <NextRequiredAction
        contract={contract}
        role="ARTISAN"
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
              <ParticipantCard contract={contract} role="ARTISAN" />
            </div>

            <div className="space-y-6">
              {/* Overview Actions Box */}
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Project Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {contract.status === "COMPLETED" && (
                    <Button 
                      variant="outline" 
                      className="w-full text-xs"
                      onClick={() => setIsReviewFormOpen(true)}
                    >
                      <Star className="size-4 mr-2" />
                      Submit Review
                    </Button>
                  )}
                  <p className="text-[10px] text-center text-muted-foreground leading-normal mt-2">
                    Submit final files and complete confirmation to initiate client payout approvals.
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
            role="ARTISAN"
            conversationId={contract.proposal?.id ?? contractId}
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
                Confirm Submission
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewForm
        contractId={contract.id}
        targetId={contract.clientId}
        open={isReviewFormOpen}
        onOpenChange={setIsReviewFormOpen}
      />

      {/* Dispute Modal */}
      <DisputeForm
        contractId={contract.id}
        open={isDisputeFormOpen}
        onOpenChange={setIsDisputeFormOpen}
      />
    </div>
  );
}
export default ArtisanContractDetail;
