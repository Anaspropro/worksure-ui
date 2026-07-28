"use client";

import { useState } from "react";
import { Proposal } from "../types";
import { useAcceptProposal, useRejectProposal } from "@/features/jobs/api/useProposals";
import { Button } from "@/shared/components/ui/button";
import { useUser } from "@/features/auth";
import { CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ProposalActionsProps {
  proposal: Proposal;
}

export function ProposalActions({ proposal }: ProposalActionsProps) {
  const { data: user } = useUser();
  const acceptProposal = useAcceptProposal();
  const rejectProposal = useRejectProposal();
  
  if (!user || user.role !== "CLIENT" || proposal.status !== "SUBMITTED" && proposal.status !== "VIEWED") {
    return null;
  }

  const handleAccept = async () => {
    try {
      await acceptProposal.mutateAsync(proposal.id);
      toast.success("Proposal accepted! You can now create a contract.");
    } catch (error: any) {
      toast.error(error?.message || error?.error?.message || "Failed to accept proposal");
    }
  };

  const handleReject = async () => {
    try {
      await rejectProposal.mutateAsync(proposal.id);
      toast.success("Proposal rejected");
    } catch (error: any) {
      toast.error(error?.message || error?.error?.message || "Failed to reject proposal");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button 
        onClick={handleAccept} 
        disabled={acceptProposal.isPending || rejectProposal.isPending}
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Accept & Create Contract
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => toast.info("Messaging not implemented yet")}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Message Artisan
      </Button>

      <Button 
        variant="ghost" 
        onClick={handleReject}
        disabled={acceptProposal.isPending || rejectProposal.isPending}
        className="text-destructive hover:bg-destructive/10"
      >
        <XCircle className="mr-2 h-4 w-4" />
        Decline
      </Button>
    </div>
  );
}
