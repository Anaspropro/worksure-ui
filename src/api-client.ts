import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, AuthSuccess, User, UserRole, AuditLog, SystemLog, SystemHealth, ReconciliationReport } from "@/types";

const INTERNAL_API_PREFIX = "/api/proxy";
const SESSION_HINT_KEY = "auth_present";
const SESSION_HINT_VALUE = "1";

type MeResponse = {
  data?: {
    role?: UserRole;
  };
};

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "CLIENT":
      return "/dashboard/client";
    case "ARTISAN":
      return "/dashboard/artisan";
    case "ADMIN":
      return "/admin";
    default:
      return "/dashboard";
  }
}



export function hasSessionHint(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${SESSION_HINT_KEY}=`));

  return match?.split("=")[1] === SESSION_HINT_VALUE;
}

export function markSessionHint(): void {
  if (typeof window === "undefined") {
    return;
  }

  document.cookie = `${SESSION_HINT_KEY}=${SESSION_HINT_VALUE}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export function clearSessionHint(): void {
  if (typeof window === "undefined") {
    return;
  }

  document.cookie = `${SESSION_HINT_KEY}=; path=/; max-age=0; samesite=lax`;
}

function getPayloadData<T>(value: unknown): T {
  if (value && typeof value === "object" && "data" in value) {
    return (value as { data: T }).data;
  }

  return value as T;
}

function getPayloadMessage(value: unknown): string | undefined {
  if (value && typeof value === "object" && "message" in value) {
    const maybe = (value as { message?: unknown }).message;
    if (typeof maybe === "string") return maybe;
  }

  return undefined;
}

function getPayloadCode(value: unknown): string | undefined {
  if (value && typeof value === "object" && "code" in value) {
    const maybe = (value as { code?: unknown }).code;
    if (typeof maybe === "string") return maybe;
  }

  return undefined;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function proxyFetchEnvelope<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const payload = await proxyFetchRaw<ApiEnvelope<T> | T>(path, init);

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload as ApiEnvelope<T>;
  }

  return { data: payload as T };
}

export async function proxyFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const payload = await proxyFetchRaw<unknown>(path, init);
  return getPayloadData<T>(payload);
}

export async function proxyFetchRaw<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${INTERNAL_API_PREFIX}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers(init.headers as HeadersInit);

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message = getPayloadMessage(payload) ?? response.statusText;
    const code = getPayloadCode(payload);
    throw new ApiError(message, response.status, code);
  }

  return payload as T;
}

export async function login(email: string, password: string): Promise<AuthSuccess> {
  const data = await proxyFetch<AuthSuccess>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!data?.accessToken) {
    throw new Error("Login failed: missing access token");
  }

  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: UserRole,
): Promise<AuthSuccess> {
  const data = await proxyFetch<AuthSuccess>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!data?.accessToken) {
    throw new Error("Register failed: missing access token");
  }

  return data;
}

export async function getProfile(): Promise<User> {
  return proxyFetch<User>("/auth/me");
}

export async function logoutRequest(): Promise<void> {
  await proxyFetch("/auth/logout", {
    method: "POST",
  });
}

export async function getAuditLogs(page = 1, limit = 20): Promise<ApiEnvelope<AuditLog[]>> {
  return proxyFetchEnvelope<AuditLog[]>(`/admin/audit?page=${page}&limit=${limit}`);
}

export async function getReconciliationReports(page = 1, limit = 20): Promise<ApiEnvelope<AuditLog[]>> {
  return proxyFetchEnvelope<AuditLog[]>(`/admin/reconciliation/reports?page=${page}&limit=${limit}`);
}

export async function triggerReconciliation(): Promise<ReconciliationReport> {
  return proxyFetch<ReconciliationReport>("/admin/reconciliation/trigger", {
    method: "POST",
  });
}

export async function getSystemHealth(): Promise<SystemHealth> {
  return proxyFetch<SystemHealth>("/admin/monitoring/health");
}

export async function getSystemLogs(page = 1, limit = 20): Promise<ApiEnvelope<SystemLog[]>> {
  return proxyFetchEnvelope<SystemLog[]>(`/admin/monitoring/logs?page=${page}&limit=${limit}`);
}
