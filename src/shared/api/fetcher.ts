import type { UserRole } from "@/types";

const INTERNAL_API_PREFIX = "/api/proxy";
const SESSION_HINT_KEY = "auth_present";
const SESSION_HINT_VALUE = "1";

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

