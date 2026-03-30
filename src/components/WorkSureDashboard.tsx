"use client";

import { useMemo, useState } from "react";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useUser,
  useLogin,
  useRegister,
  useLogout,
} from "@/hooks/useAuth";
import {
  useJobs,
  useCreateJob,
} from "@/hooks/useJobs";
import {
  useProposals,
  useCreateProposal,
  useAcceptProposal,
} from "@/hooks/useProposals";
import {
  useContracts,
  useCreateContract,
  useFundContract,
  useConfirmCompletion,
  useReleaseEscrow,
  useRefundContract,
} from "@/hooks/useContracts";

export default function WorkSureDashboard() {
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [role, setRole] = useState<"CLIENT" | "ARTISAN">("CLIENT");

  const [jobTitle, setJobTitle] = useState("");
  const [jobBudget, setJobBudget] = useState(0);
  const [jobDescription, setJobDescription] = useState("");

  const [proposalJobId, setProposalJobId] = useState("");
  const [proposalAmount, setProposalAmount] = useState(0);
  const [proposalMessage, setProposalMessage] = useState("");

  const userQuery = useUser();
  const user = userQuery.data as User | undefined;
  const fetchingUser = userQuery.isLoading;
  const userId = user?.id;
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: proposals, isLoading: proposalsLoading } = useProposals(userId);
  const { data: contracts, isLoading: contractsLoading } = useContracts();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logout = useLogout();

  const createJobMutation = useCreateJob();
  const createProposalMutation = useCreateProposal();
  const acceptProposalMutation = useAcceptProposal();
  const createContractMutation = useCreateContract();
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();
  const refundContractMutation = useRefundContract();

  const isBusy =
    fetchingUser ||
    jobsLoading ||
    proposalsLoading ||
    contractsLoading ||
    loginMutation.status === "pending" ||
    registerMutation.status === "pending";

  const userLabel = useMemo(() => {
    if (!user) return "Guest";
    return `${user.name} (${user.role.toLowerCase()})`;
  }, [user]);

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <section className="mx-auto w-full max-w-6xl space-y-4">
        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">WorkSure Escrow Marketplace</h1>
            <div>
              <Badge variant="secondary">{user ? "Signed In" : "Public"}</Badge>
              <span className="ml-2 text-sm text-slate-600">{userLabel}</span>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Use this interface to run the full model: job posting, proposals, contracts, escrow funding,
            completion confirmation and release.
          </p>
        </Card>

        {!user ? (
          <Card className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Authentication</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
              <Input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>

            <fieldset className="flex items-center gap-4">
              <legend className="text-sm font-medium text-slate-700">Role</legend>
              {(["CLIENT", "ARTISAN"] as const).map((option) => (
                <label key={option} className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="role"
                    value={option}
                    checked={role === option}
                    onChange={() => setRole(option)}
                    className="h-4 w-4"
                  />
                  {option}
                </label>
              ))}
            </fieldset>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => registerMutation.mutate({ name: authEmail.split("@")[0], email: authEmail, password: authPassword, role })}
                disabled={isBusy || !authEmail || !authPassword}
              >
                Register
              </Button>
              <Button
                onClick={() => loginMutation.mutate({ email: authEmail, password: authPassword })}
                disabled={isBusy || !authEmail || !authPassword}
              >
                Login
              </Button>
            </div>
            {(loginMutation.error || registerMutation.error) && (
              <p className="text-sm text-red-600">{String((loginMutation.error || registerMutation.error) as Error)}</p>
            )}
          </Card>
        ) : (
          <>
            <div className="flex justify-end gap-4">
              <Button variant="destructive" onClick={logout} disabled={isBusy}>
                Logout
              </Button>
              <Button onClick={() => window.location.reload()} disabled={isBusy}>
                Refresh data
              </Button>
            </div>

            <section className="grid gap-4 lg:grid-cols-2">
              <Card className="space-y-3 p-5">
                <h2 className="font-semibold">Post a Job</h2>
                <Input placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                <Textarea
                  placeholder="Job Description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Budget"
                  value={jobBudget}
                  onChange={(e) => setJobBudget(Number(e.target.value))}
                />
                <Button
                  onClick={() =>
                    createJobMutation.mutate({
                      title: jobTitle,
                      description: jobDescription,
                      budget: jobBudget,
                      category: "general",
                    })
                  }
                  disabled={isBusy || !jobTitle || jobBudget <= 0}
                >
                  Create Job
                </Button>
              </Card>

              <Card className="space-y-3 p-5">
                <h2 className="font-semibold">Submit Proposal</h2>
                <select
                  className="w-full rounded border p-2"
                  value={proposalJobId}
                  onChange={(e) => setProposalJobId(e.target.value)}
                >
                  <option value="">Select a job</option>
                  {jobs?.map((job) => (
                    <option value={job.id} key={job.id}>
                      {job.title} ({job.budget})
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Proposal amount"
                  value={proposalAmount}
                  onChange={(e) => setProposalAmount(Number(e.target.value))}
                />
                <Textarea
                  placeholder="Proposal message"
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                />
                <Button
                  onClick={() =>
                    createProposalMutation.mutate({
                      jobId: proposalJobId,
                      amount: proposalAmount,
                      message: proposalMessage,
                    })
                  }
                  disabled={isBusy || !proposalJobId || proposalAmount <= 0 || !proposalMessage}
                >
                  Submit Proposal
                </Button>
              </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <Card className="space-y-3 p-5">
                <h2 className="font-semibold">Open Jobs</h2>
                {jobs?.length ? (
                  jobs.map((job) => (
                    <div key={job.id} className="rounded border p-3">
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-slate-600">{job.description}</p>
                      <Badge>{job.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No jobs yet</p>
                )}
              </Card>

              <Card className="space-y-3 p-5">
                <h2 className="font-semibold">Proposals</h2>
                {proposals?.length ? (
                  proposals.map((proposal) => (
                    <div key={proposal.id} className="rounded border p-3">
                      <p className="font-semibold">{proposal.job.title}</p>
                      <p className="text-xs text-slate-500">{proposal.amount} - {proposal.status}</p>
                      <p className="text-sm text-slate-600">{proposal.message}</p>
                      {user?.role === "CLIENT" && proposal.status === "PENDING" && (
                        <Button size="sm" onClick={() => acceptProposalMutation.mutate(proposal.id)} disabled={isBusy}>
                          Accept
                        </Button>
                      )}
                      {proposal.status === "ACCEPTED" && user?.role === "CLIENT" && (
                        <Button size="sm" onClick={() => createContractMutation.mutate(proposal.id)} disabled={isBusy}>
                          Create Contract
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No proposals yet</p>
                )}
              </Card>

              <Card className="space-y-3 p-5">
                <h2 className="font-semibold">Contracts</h2>
                {contracts?.length ? (
                  contracts.map((contract) => (
                    <div key={contract.id} className="rounded border p-3">
                      <p className="font-semibold">{contract.job.title}</p>
                      <p className="text-xs text-slate-500">{contract.status} | {contract.amount}</p>
                      <p className="text-xs text-slate-500">Client confirm: {String(contract.clientConfirmedCompletion)} / Artisan confirm: {String(contract.artisanConfirmedCompletion)}</p>
                      {contract.status === "DRAFT" && user?.id === contract.clientId && (
                        <Button size="sm" onClick={() => fundContractMutation.mutate({ contractId: contract.id, amount: contract.amount })} disabled={isBusy}>
                          Fund
                        </Button>
                      )}
                      {contract.status === "ACTIVE" && user?.id === contract.clientId && (
                        <Button size="sm" onClick={() => confirmCompletionMutation.mutate({ contractId: contract.id, isClient: true })} disabled={isBusy}>
                          Confirm Completion (Client)
                        </Button>
                      )}
                      {contract.status === "ACTIVE" && user?.id === contract.artisanId && (
                        <Button size="sm" onClick={() => confirmCompletionMutation.mutate({ contractId: contract.id, isClient: false })} disabled={isBusy}>
                          Confirm Completion (Artisan)
                        </Button>
                      )}
                      {contract.status === "ACTIVE" && contract.clientConfirmedCompletion && contract.artisanConfirmedCompletion && !contract.escrowReleased && user?.id === contract.clientId && (
                        <Button size="sm" onClick={() => releaseEscrowMutation.mutate(contract.id)} disabled={isBusy}>
                          Release Escrow
                        </Button>
                      )}
                      {contract.status === "ACTIVE" && !contract.escrowReleased && user?.id === contract.clientId && (
                        <Button size="sm" onClick={() => refundContractMutation.mutate({ contractId: contract.id, reason: "Client requested refund" })} disabled={isBusy}>
                          Refund
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No contracts yet</p>
                )}
              </Card>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
