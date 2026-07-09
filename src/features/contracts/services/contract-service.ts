"use client";

import { proxyFetch, proxyFetchRaw } from "@/shared/api/fetcher";
import type { ApiPagination, Contract, ContractStatus, AdminContractStats, AdminCollection } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────

export type ContractsFilter = {
  status?: ContractStatus | string;
  page?: number;
  limit?: number;
};

export type ContractsResponse = {
  data: Contract[];
  pagination: ApiPagination;
};

export type FundContractInput = {
  contractId: string;
  email: string;
  callbackUrl?: string;
};

export type FundContractResult = {
  payment: unknown;
  authorizationUrl: string;
  reference: string;
};

export type ConfirmCompletionInput = {
  contractId: string;
  isClient: boolean;
  notes?: string;
};

export type RefundInput = {
  contractId: string;
  reason: string;
};

export type ContractTimelineEvent = {
  id: string;
  contractId: string;
  eventType: string;
  actor: {
    id: string;
    name: string;
    role: "CLIENT" | "ARTISAN" | "SYSTEM" | "ADMIN";
  };
  timestamp: string;
  description: string;
  metadata?: Record<string, unknown>;
  attachments?: { url: string; name: string; type: string }[];
};

// ── Query Parameter Builder ────────────────────────────────────────────

function buildQuery(params: Record<string, unknown> = {}): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  if (!query.has("limit")) {
    query.set("limit", "50");
  }
  return query.toString();
}

// ── Contract Queries ───────────────────────────────────────────────────

export async function getContracts(params: ContractsFilter = {}): Promise<ContractsResponse> {
  return proxyFetchRaw<ContractsResponse>(`/contracts?${buildQuery(params)}`);
}

export async function getContractById(id: string): Promise<Contract> {
  return proxyFetch<Contract>(`/contracts/${id}`);
}

/**
 * Derives timeline events from contract field timestamps.
 * This is a client-side fallback until the backend provides a dedicated timeline endpoint.
 */
export function deriveTimelineFromContract(contract: Contract): ContractTimelineEvent[] {
  const events: ContractTimelineEvent[] = [];

  // Contract Created
  if (contract.proposal?.createdAt) {
    events.push({
      id: `${contract.id}-created`,
      contractId: contract.id,
      eventType: "CONTRACT_CREATED",
      actor: { id: contract.clientId, name: contract.client?.name ?? "Client", role: "CLIENT" },
      timestamp: contract.proposal.createdAt,
      description: `Contract created for "${contract.job?.title}"`,
    });
  }

  // Escrow Funded
  if (contract.fundedAt) {
    events.push({
      id: `${contract.id}-funded`,
      contractId: contract.id,
      eventType: "ESCROW_FUNDED",
      actor: { id: contract.clientId, name: contract.client?.name ?? "Client", role: "CLIENT" },
      timestamp: contract.fundedAt,
      description: `Escrow funded — ${contract.currency} ${contract.amount.toLocaleString()}`,
    });
  }

  // Work Started
  if (contract.startedAt) {
    events.push({
      id: `${contract.id}-started`,
      contractId: contract.id,
      eventType: "WORK_STARTED",
      actor: { id: contract.artisanId, name: contract.artisan?.name ?? "Artisan", role: "ARTISAN" },
      timestamp: contract.startedAt,
      description: "Work started on contract",
    });
  }

  // Client Confirmed
  if (contract.clientConfirmedCompletion) {
    events.push({
      id: `${contract.id}-client-confirmed`,
      contractId: contract.id,
      eventType: "CLIENT_CONFIRMED",
      actor: { id: contract.clientId, name: contract.client?.name ?? "Client", role: "CLIENT" },
      timestamp: contract.completedAt ?? contract.startedAt ?? new Date().toISOString(),
      description: "Client confirmed completion",
    });
  }

  // Artisan Confirmed
  if (contract.artisanConfirmedCompletion) {
    events.push({
      id: `${contract.id}-artisan-confirmed`,
      contractId: contract.id,
      eventType: "ARTISAN_CONFIRMED",
      actor: { id: contract.artisanId, name: contract.artisan?.name ?? "Artisan", role: "ARTISAN" },
      timestamp: contract.completedAt ?? contract.startedAt ?? new Date().toISOString(),
      description: "Artisan confirmed completion",
    });
  }

  // Escrow Released
  if (contract.escrowReleasedAt) {
    events.push({
      id: `${contract.id}-released`,
      contractId: contract.id,
      eventType: "ESCROW_RELEASED",
      actor: { id: "system", name: "System", role: "SYSTEM" },
      timestamp: contract.escrowReleasedAt,
      description: `Escrow released — ${contract.currency} ${contract.amount.toLocaleString()}`,
    });
  }

  // Contract Completed
  if (contract.completedAt && contract.escrowReleased) {
    events.push({
      id: `${contract.id}-completed`,
      contractId: contract.id,
      eventType: "CONTRACT_COMPLETED",
      actor: { id: "system", name: "System", role: "SYSTEM" },
      timestamp: contract.completedAt,
      description: "Contract completed successfully",
    });
  }

  // Disputed
  if (contract.status === "DISPUTED") {
    events.push({
      id: `${contract.id}-disputed`,
      contractId: contract.id,
      eventType: "DISPUTE_OPENED",
      actor: { id: "system", name: "System", role: "SYSTEM" },
      timestamp: new Date().toISOString(),
      description: "Dispute opened on contract",
    });
  }

  // Cancelled
  if (contract.status === "CANCELLED") {
    events.push({
      id: `${contract.id}-cancelled`,
      contractId: contract.id,
      eventType: "CONTRACT_CANCELLED",
      actor: { id: "system", name: "System", role: "SYSTEM" },
      timestamp: new Date().toISOString(),
      description: "Contract cancelled",
    });
  }

  // Refunded
  if (contract.status === "REFUNDED") {
    events.push({
      id: `${contract.id}-refunded`,
      contractId: contract.id,
      eventType: "CONTRACT_REFUNDED",
      actor: { id: "system", name: "System", role: "SYSTEM" },
      timestamp: new Date().toISOString(),
      description: `Contract refunded — ${contract.currency} ${contract.amount.toLocaleString()}`,
    });
  }

  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// ── Contract Mutations ─────────────────────────────────────────────────

export async function createContract(proposalId: string): Promise<Contract> {
  return proxyFetch<Contract>("/contracts", {
    method: "POST",
    body: JSON.stringify({ proposalId }),
  });
}

export async function fundContract(input: FundContractInput): Promise<FundContractResult> {
  return proxyFetch<FundContractResult>(`/contracts/${input.contractId}/fund`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function verifyPayment(reference: string): Promise<unknown> {
  return proxyFetch<unknown>("/payments/paystack/verify", {
    method: "POST",
    body: JSON.stringify({ reference }),
  });
}

export async function confirmCompletion(input: ConfirmCompletionInput): Promise<Contract> {
  return proxyFetch<Contract>(`/contracts/${input.contractId}/confirm-completion`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function releaseEscrow(contractId: string): Promise<{ message: string }> {
  return proxyFetch<{ message: string }>(`/contracts/${contractId}/release-escrow`, {
    method: "POST",
  });
}

export async function refundContract(input: RefundInput): Promise<{ message: string }> {
  return proxyFetch<{ message: string }>(`/contracts/${input.contractId}/refund`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ── Admin Queries ──────────────────────────────────────────────────────

export type AdminContractsFilter = {
  search?: string;
  status?: string;
  cursor?: string;
  limit?: number;
};

export async function getAdminContracts(params: AdminContractsFilter = {}): Promise<AdminCollection<Contract>> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.limit) query.set("limit", params.limit.toString());
  const qs = query.toString() ? `?${query.toString()}` : "";
  return proxyFetchRaw<AdminCollection<Contract>>(`/admin/contracts${qs}`);
}

export async function getAdminContractStats(): Promise<AdminContractStats> {
  return proxyFetch<AdminContractStats>("/admin/contracts/stats");
}

export async function resolveDispute(
  disputeId: string,
  decision: string,
  notes?: string,
): Promise<unknown> {
  return proxyFetch(`/admin/disputes/${disputeId}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ decision, notes }),
  });
}
