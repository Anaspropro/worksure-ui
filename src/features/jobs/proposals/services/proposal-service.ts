import { Proposal, ProposalEvent, ProposalStatus } from "../types";
import { SubmitProposalPayload } from "../schemas";

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    jobId: "job-1",
    artisanId: "artisan-123",
    artisanName: "Alice Smith",
    coverLetter: "I have 5 years of experience building scalable React applications and have successfully implemented TanStack Query in production multiple times.",
    bidAmount: 4800,
    estimatedDuration: "2 months",
    status: "PENDING",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "prop-2",
    jobId: "job-1",
    artisanId: "artisan-456",
    artisanName: "Bob Jones",
    coverLetter: "I've built similar marketplace platforms and can ensure a robust and clean architecture for your Job Domain.",
    bidAmount: 5200,
    estimatedDuration: "3 months",
    status: "UNDER_REVIEW",
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
];

export async function getJobProposals(jobId: string): Promise<Proposal[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_PROPOSALS.filter(p => p.jobId === jobId);
}

export async function getProposalById(id: string): Promise<Proposal> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const proposal = MOCK_PROPOSALS.find(p => p.id === id);
  if (!proposal) throw new Error("Proposal not found");
  return proposal;
}

export async function submitProposal(jobId: string, payload: SubmitProposalPayload): Promise<Proposal> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newProp: Proposal = {
    ...payload,
    id: `prop-${Math.random().toString(36).substr(2, 9)}`,
    jobId,
    artisanId: "artisan-current",
    artisanName: "Current User", // mock resolved name
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_PROPOSALS.push(newProp);
  return newProp;
}

export async function updateProposalStatus(id: string, status: ProposalStatus): Promise<Proposal> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const proposal = MOCK_PROPOSALS.find(p => p.id === id);
  if (!proposal) throw new Error("Proposal not found");
  proposal.status = status;
  proposal.updatedAt = new Date().toISOString();
  return proposal;
}

export async function getProposalTimeline(id: string): Promise<ProposalEvent[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: "pevt-1",
      proposalId: id,
      type: "PROPOSAL_SUBMITTED",
      actorRole: "ARTISAN",
      description: "Proposal submitted",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    }
  ];
}
