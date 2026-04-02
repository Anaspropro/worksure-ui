"use client";

import { useState } from "react";
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
  const [jobBudget, setJobBudget] = useState(0);
  const [jobDescription, setJobDescription] = useState("");
  const [proposalJobId, setProposalJobId] = useState("");
  const [proposalAmount, setProposalAmount] = useState(0);
  const [proposalMessage, setProposalMessage] = useState("");

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
          jobBudget={jobBudget}
          setJobTitle={setJobTitle}
          setJobDescription={setJobDescription}
          setJobBudget={setJobBudget}
          onCreateJob={() =>
            createJobMutation.mutate({
              title: jobTitle,
              description: jobDescription,
              budget: jobBudget,
              category: "general",
            })
          }
          isBusy={isBusy}
        />
      ) : null}

      {roleView === "ARTISAN" ? (
        <ArtisanWorkspaceSection
          jobs={jobs}
          proposalJobId={proposalJobId}
          proposalAmount={proposalAmount}
          proposalMessage={proposalMessage}
          setProposalJobId={setProposalJobId}
          setProposalAmount={setProposalAmount}
          setProposalMessage={setProposalMessage}
          onSubmitProposal={() =>
            createProposalMutation.mutate({
              jobId: proposalJobId,
              amount: proposalAmount,
              message: proposalMessage,
            })
          }
          isBusy={isBusy}
          formatAmount={formatAmount}
        />
      ) : null}

      {roleView === "ADMIN" ? <AdminWorkspaceSection /> : null}

      <section className="grid gap-4 grid-cols-1">
        <JobsPanel roleView={roleView} jobs={visibleJobs} formatAmount={formatAmount} />
        <ProposalsPanel
          roleView={roleView}
          proposals={proposals}
          isBusy={isBusy}
          onAccept={(proposalId) => acceptProposalMutation.mutate(proposalId)}
          onCreateContract={(proposalId) => createContractMutation.mutate(proposalId)}
          formatAmount={formatAmount}
        />
        <ContractsPanel
          contracts={contracts}
          user={user}
          isBusy={isBusy}
          onFundContract={(contractId, amount) => fundContractMutation.mutate({ contractId, amount })}
          onConfirmCompletion={(contractId, isClient) => confirmCompletionMutation.mutate({ contractId, isClient })}
          onReleaseEscrow={(contractId) => releaseEscrowMutation.mutate(contractId)}
          onRefund={(contractId) =>
            refundContractMutation.mutate({
              contractId,
              reason: "Client requested refund",
            })
          }
          formatAmount={formatAmount}
        />
      </section>
    </main>
  );
}
