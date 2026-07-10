export interface Dispute {
  id: string;
  contractId: string;
  initiatorId: string;
  respondentId: string;
  reason: string;
  description: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
  evidenceUrls: string[];
  amountClaimed?: number;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}
