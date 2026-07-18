"use client";

import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
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



// ── Contract Queries ───────────────────────────────────────────────────

export async function getContracts(params: ContractsFilter = {}): Promise<ContractsResponse> {
  const { data, error, response } = await apiClient.GET("/contracts", {
    params: {
      query: {
        status: params.status,
        page: params.page,
        limit: params.limit,
      } as any
    }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data as unknown as ContractsResponse;
}

export async function getContractById(id: string): Promise<Contract> {
  const { data, error, response } = await apiClient.GET("/contracts/{id}", {
    params: { path: { id } }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return (data as any)?.data as unknown as Contract;
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
  const { data, error, response } = await apiClient.POST("/contracts", {
    body: { proposalId } as any
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return (data as any)?.data as unknown as Contract;
}

export async function fundContract(input: FundContractInput): Promise<FundContractResult> {
  const { data, error, response } = await apiClient.POST("/contracts/{id}/fund", {
    params: { path: { id: input.contractId } },
    body: input as any
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return (data as any)?.data as unknown as FundContractResult;
}

export async function verifyPayment(reference: string): Promise<unknown> {
  const { data, error, response } = await apiClient.POST("/payments/paystack/verify", {
    body: { reference } as any
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data;
}

export async function confirmCompletion(input: ConfirmCompletionInput): Promise<Contract> {
  const { data, error, response } = await apiClient.POST("/contracts/{id}/confirm-completion", {
    params: { path: { id: input.contractId } },
    body: { notes: input.notes } as any
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return (data as any)?.contract as unknown as Contract;
}

export async function releaseEscrow(contractId: string): Promise<{ message: string }> {
  const { data, error, response } = await apiClient.POST("/contracts/{id}/release-escrow", {
    params: { path: { id: contractId } },
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data as unknown as { message: string };
}

export async function refundContract(input: RefundInput): Promise<{ message: string }> {
  const { data, error, response } = await apiClient.POST("/contracts/{id}/refund", {
    params: { path: { id: input.contractId } },
    body: { reason: input.reason } as any
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data as unknown as { message: string };
}

// ── Admin Queries ──────────────────────────────────────────────────────

export type AdminContractsFilter = {
  search?: string;
  status?: string;
  cursor?: string;
  limit?: number;
};

export async function getAdminContracts(params: AdminContractsFilter = {}): Promise<AdminCollection<Contract>> {
  const { data, error, response } = await apiClient.GET("/admin/contracts", {
    params: { query: params as any }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data as unknown as AdminCollection<Contract>;
}

export async function getAdminContractStats(): Promise<AdminContractStats> {
  const { data, error, response } = await apiClient.GET("/admin/contracts/stats");
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return (data as any)?.data as unknown as AdminContractStats;
}

export async function resolveDispute(
  disputeId: string,
  decision: string,
  notes?: string,
): Promise<unknown> {
  const { data, error, response } = await apiClient.PATCH("/admin/disputes/{id}/resolve", {
    params: { path: { id: disputeId } },
    body: { decision, notes } as any
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data;
}
