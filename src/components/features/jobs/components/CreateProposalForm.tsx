"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProposal } from "@/hooks/useProposals";
import { useRoleScopedJobs } from "@/hooks/useJobs";
import { formatCurrency } from "@/lib/formatters";

export function CreateProposalForm({
  user,
  initialJobId = "",
  onSuccess,
}: {
  user: any;
  initialJobId?: string;
  onSuccess?: () => void;
}) {
  const [proposalJobId, setProposalJobId] = useState(initialJobId);
  const [proposalAmountInput, setProposalAmountInput] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  
  const proposalAmount = Number(proposalAmountInput || 0);
  const createProposalMutation = useCreateProposal();

  // Fetch open jobs so the artisan can select which one to apply to
  const jobsQuery = useRoleScopedJobs({ role: "ARTISAN", userId: user?.id });
  const jobs = jobsQuery.data?.jobs ?? [];

  const handleCreateProposal = () => {
    const toastId = toast.loading("Submitting proposal...");
    createProposalMutation.mutate(
      {
        jobId: proposalJobId,
        amount: proposalAmount,
        message: proposalMessage.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Proposal submitted! The client will review it shortly.", { id: toastId });
          setProposalJobId("");
          setProposalAmountInput("");
          setProposalMessage("");
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message || "Unable to submit proposal.", { id: toastId });
        },
      },
    );
  };

  if (!user.artisanVerified) {
    return (
      <Card className="border-border/80 bg-card xl:order-2">
        <CardHeader>
          <CardTitle>Submit a proposal</CardTitle>
          <CardDescription>Pick a job and send your price with a delivery plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
            <p className="font-medium">Verification required</p>
            <p className="mt-1">
              Complete your KYC verification before submitting proposals.{" "}
              <Link href="/kyc/status" className="underline font-medium">
                Go to verification →
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 bg-card xl:order-2">
      <CardHeader>
        <CardTitle>Submit a proposal</CardTitle>
        <CardDescription>
          Pick a job and send your price with a delivery plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <select
          className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={proposalJobId}
          onChange={(e) => setProposalJobId(e.target.value)}
        >
          <option value="">Select a job to apply to</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} ({formatCurrency(job.budget)})
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Your proposed price (₦)"
          value={proposalAmountInput}
          onChange={(e) => setProposalAmountInput(e.target.value)}
        />
        <Textarea
          placeholder="Describe how you'll handle this work, your timeline, and relevant experience..."
          value={proposalMessage}
          onChange={(e) => setProposalMessage(e.target.value)}
          rows={4}
        />
        <Button
          disabled={
            !proposalJobId ||
            !proposalMessage.trim() ||
            proposalAmount <= 0 ||
            createProposalMutation.status === "pending"
          }
          onClick={handleCreateProposal}
          className="w-full"
        >
          {createProposalMutation.status === "pending" ? (
            <><Loader2 className="size-4 animate-spin mr-2" /> Submitting...</>
          ) : (
            <><Send className="size-4 mr-2" /> Submit proposal</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
