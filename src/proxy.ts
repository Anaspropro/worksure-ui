import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, AuthSuccess, User, UserRole } from "@/types";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/wallet",
  "/profile",
  "/jobs",
  "/contracts",
  "/kyc",
  "/reviews",
  "/notifications",
];
const AUTH_PREFIXES = ["/auth/login", "/auth/register"];
const ADMIN_PREFIX = "/admin";
const API_URL =
  process.env.API_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith(ADMIN_PREFIX);
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

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
      return "/dashboard/admin";
    default:
      return "/dashboard";
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token");

  if (!API_URL && (isProtectedPath(pathname) || isAuthPath(pathname))) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("token");
    response.cookies.delete("refresh_token");
    return response;
  }

  if (isProtectedPath(pathname) || (isAuthPath(pathname) && token?.value)) {
    if (!token?.value) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
        cache: "no-store",
      });

      if (!meRes.ok) {
        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("token");
        response.cookies.delete("refresh_token");
        return response;
      }

      const body = (await meRes.json()) as MeResponse;
      const currentRole = body.data?.role;

      if (isAuthPath(pathname) && currentRole) {
        return NextResponse.redirect(new URL(getDashboardPathForRole(currentRole), request.url));
      }

      if (isAdminPath(pathname) && currentRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete("token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  return NextResponse.next();
}

const TOKEN_KEY = "token";

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${TOKEN_KEY}=`));

  if (match) {
    return decodeURIComponent(match.split("=")[1] || "");
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
  localStorage.removeItem(TOKEN_KEY);
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
  if (!API_URL) {
    throw new Error("API_URL environment variable is not configured");
  }

  const url = `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers(init.headers as HeadersInit);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new Error(getPayloadMessage(payload) ?? response.statusText);
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

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/jobs/:path*",
    "/contracts/:path*",
    "/kyc/:path*",
    "/reviews/:path*",
    "/notifications/:path*",
    "/auth/:path*",
  ],
};
