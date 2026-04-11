"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User } from "@/types";
import { useJobs, useCreateJob } from "@/hooks/useJobs";
import { useProposals, useCreateProposal, useAcceptProposal } from "@/hooks/useProposals";
import {
  useContracts,
  useCreateContract,
  useFundContract,
  useConfirmCompletion,
  useReleaseEscrow,
  useRefundContract,
} from "@/hooks/useContracts";
import AdminWorkspaceSection from "@/components/dashboard/workspace/AdminWorkspaceSection";
import ArtisanWorkspaceSection from "@/components/dashboard/workspace/ArtisanWorkspaceSection";
import ClientWorkspaceSection from "@/components/dashboard/workspace/ClientWorkspaceSection";
import ContractsPanel from "@/components/dashboard/workspace/ContractsPanel";
import DashboardHero from "@/components/dashboard/workspace/DashboardHero";
import DashboardStats from "@/components/dashboard/workspace/DashboardStats";
import JobsPanel from "@/components/dashboard/workspace/JobsPanel";
import ProposalsPanel from "@/components/dashboard/workspace/ProposalsPanel";
import { getScreenCopy } from "@/components/dashboard/workspace/dashboard-copy";
import { formatAmount } from "@/components/dashboard/workspace/format";

export default function WorkspaceDashboard({
  roleView,
  user,
}: {
  roleView: User["role"];
  user: User;
}) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobBudgetInput, setJobBudgetInput] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [proposalJobId, setProposalJobId] = useState("");
  const [proposalAmountInput, setProposalAmountInput] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const jobBudget = Number(jobBudgetInput || 0);
  const proposalAmount = Number(proposalAmountInput || 0);

  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: proposals, isLoading: proposalsLoading } = useProposals({
    userId: user.id,
    role: roleView,
  });
  const { data: contracts, isLoading: contractsLoading } = useContracts();

  const createJobMutation = useCreateJob();
  const createProposalMutation = useCreateProposal();
  const acceptProposalMutation = useAcceptProposal();
  const createContractMutation = useCreateContract();
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();
  const refundContractMutation = useRefundContract();

  const isBusy =
    jobsLoading ||
    proposalsLoading ||
    contractsLoading ||
    createJobMutation.status === "pending" ||
    createProposalMutation.status === "pending" ||
    acceptProposalMutation.status === "pending" ||
    createContractMutation.status === "pending" ||
    fundContractMutation.status === "pending" ||
    confirmCompletionMutation.status === "pending" ||
    releaseEscrowMutation.status === "pending" ||
    refundContractMutation.status === "pending";

  const screenCopy = getScreenCopy(roleView);
  const visibleJobs = roleView === "CLIENT" ? jobs?.filter((job) => job.client?.id === user.id) ?? [] : jobs ?? [];
  const activeContracts = contracts?.filter((contract) => contract.status === "ACTIVE") ?? [];
  const escrowReadyContracts =
    contracts?.filter(
      (contract) =>
        contract.status === "ACTIVE" &&
        contract.clientConfirmedCompletion &&
        contract.artisanConfirmedCompletion &&
        !contract.escrowReleased,
    ) ?? [];

  const handleCreateJob = () => {
    const toastId = toast.loading("Publishing job...");
    createJobMutation.mutate(
      {
        title: jobTitle.trim(),
        description: jobDescription.trim(),
        budget: jobBudget,
        category: "general",
      },
      {
        onSuccess: () => {
          toast.success("Job published successfully.", { id: toastId });
          setJobTitle("");
          setJobDescription("");
          setJobBudgetInput("");
        },
        onError: (error) => {
          toast.error(error.message || "Unable to publish job.", { id: toastId });
        },
      },
    );
  };

  const handleSubmitProposal = () => {
    const toastId = toast.loading("Submitting proposal...");
    createProposalMutation.mutate(
      {
        jobId: proposalJobId,
        amount: proposalAmount,
        message: proposalMessage.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Proposal submitted successfully.", { id: toastId });
          setProposalJobId("");
          setProposalAmountInput("");
          setProposalMessage("");
        },
        onError: (error) => {
          toast.error(error.message || "Unable to submit proposal.", { id: toastId });
        },
      },
    );
  };

  return (
    <main className="space-y-6">
      <section className="">
        <DashboardHero roleView={roleView} title={screenCopy.title} description={screenCopy.description} />
        <DashboardStats
          jobsCount={jobs?.length ?? 0}
          emphasisLabel={screenCopy.emphasis}
          emphasisValue={roleView === "ADMIN" ? activeContracts.length : contracts?.length ?? 0}
          readyToRelease={escrowReadyContracts.length}
        />
      </section>

      {roleView === "CLIENT" ? (
        <ClientWorkspaceSection
          jobTitle={jobTitle}
          jobDescription={jobDescription}
          jobBudgetInput={jobBudgetInput}
          setJobTitle={setJobTitle}
          setJobDescription={setJobDescription}
          setJobBudgetInput={setJobBudgetInput}
          onCreateJob={handleCreateJob}
          isBusy={isBusy}
        />
      ) : null}

      {roleView === "ARTISAN" ? (
        <ArtisanWorkspaceSection
          jobs={jobs}
          proposalJobId={proposalJobId}
          proposalAmountInput={proposalAmountInput}
          proposalMessage={proposalMessage}
          setProposalJobId={setProposalJobId}
          setProposalAmountInput={setProposalAmountInput}
          setProposalMessage={setProposalMessage}
          onSubmitProposal={handleSubmitProposal}
          isBusy={isBusy}
          formatAmount={formatAmount}
          artisanVerified={Boolean(user.artisanVerified)}
        />
      ) : null}

      {roleView === "ADMIN" ? <AdminWorkspaceSection /> : null}

      <section className="grid gap-4 grid-cols-2">
        <JobsPanel roleView={roleView} jobs={visibleJobs} formatAmount={formatAmount} />
        <ProposalsPanel
          roleView={roleView}
          proposals={proposals}
          isBusy={isBusy}
          onAccept={(proposalId) =>
            acceptProposalMutation.mutate(proposalId, {
              onSuccess: () => toast.success("Proposal accepted."),
              onError: (error) => toast.error(error.message || "Unable to accept proposal."),
            })
          }
          onCreateContract={(proposalId) =>
            createContractMutation.mutate(proposalId, {
              onSuccess: () => toast.success("Contract created."),
              onError: (error) => toast.error(error.message || "Unable to create contract."),
            })
          }
          formatAmount={formatAmount}
        />
        <ContractsPanel
          contracts={contracts}
          user={user}
          isBusy={isBusy}
          onFundContract={(contractId, amount) =>
            fundContractMutation.mutate(
              { contractId, amount },
              {
                onSuccess: () => toast.success("Contract funded."),
                onError: (error) => toast.error(error.message || "Unable to fund contract."),
              },
            )
          }
          onConfirmCompletion={(contractId, isClient) =>
            confirmCompletionMutation.mutate(
              { contractId, isClient },
              {
                onSuccess: () => toast.success("Completion confirmed."),
                onError: (error) => toast.error(error.message || "Unable to confirm completion."),
              },
            )
          }
          onReleaseEscrow={(contractId) =>
            releaseEscrowMutation.mutate(contractId, {
              onSuccess: () => toast.success("Escrow released."),
              onError: (error) => toast.error(error.message || "Unable to release escrow."),
            })
          }
          onRefund={(contractId) =>
            refundContractMutation.mutate({
              contractId,
              reason: "Client requested refund",
            }, {
              onSuccess: () => toast.success("Refund initiated."),
              onError: (error) => toast.error(error.message || "Unable to refund contract."),
            })
          }
          formatAmount={formatAmount}
        />
      </section>
    </main>
  );
}
