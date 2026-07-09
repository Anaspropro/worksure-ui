export type ProposalStatus = "PENDING" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "WITHDRAWN" | "REVISION_REQUESTED";

export interface Proposal {
  id: string;
  jobId: string;
  artisanId: string;
  artisanName: string; // resolved
  artisanAvatar?: string; // resolved
  coverLetter: string;
  bidAmount: number;
  estimatedDuration: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
  attachments?: { id: string; url: string; name: string }[];
}

export interface ProposalEvent {
  id: string;
  proposalId: string;
  type: string;
  actorRole: "CLIENT" | "ARTISAN" | "SYSTEM";
  description: string;
  timestamp: string;
}
