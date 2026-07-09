export interface DeliverableFile {
  url: string;
  name: string;
  type: string;       // MIME type
  size: number;        // bytes
  uploadedAt: string;
}

export interface Deliverable {
  id: string;
  contractId: string;
  submittedBy: string;
  submittedAt: string;
  status: "SUBMITTED" | "APPROVED" | "REVISION_REQUESTED" | "RESUBMITTED";
  files: DeliverableFile[];
  description?: string;
  revisionNote?: string;
}

export interface RevisionRequest {
  id: string;
  contractId: string;
  requestedBy: string;
  requestedAt: string;
  reason: string;
  resolvedAt?: string;
}
