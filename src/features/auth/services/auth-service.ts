import apiClient from "@/shared/api/client";
import { ApiError, proxyFetch } from "@/shared/api/fetcher";
import type { AuthSuccess, RegisterSuccess, User, UserRole } from "@/types";

export async function login(email: string, password: string): Promise<AuthSuccess> {
  try {
    const { data, error, response } = await apiClient.POST("/auth/login", {
      body: { email, password }
    });
    if (error) {
      throw new ApiError((error as { message?: string })?.message || "Invalid credentials provided. Please check your email and password.", response?.status || 401);
    }
    if (!data || !(data as { data?: { user?: unknown } })?.data?.user) {
      throw new ApiError("Server not available. Please try again later.", 503);
    }
    return (data as { data: AuthSuccess }).data;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("Server not available. Please check your connection.", 503);
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: UserRole,
): Promise<RegisterSuccess> {
  try {
    const { data, error, response } = await apiClient.POST("/auth/register", {
      body: { name, email, password, role }
    });
    if (error) {
      throw new ApiError((error as { message?: string })?.message || "Registration failed. This email might already be in use.", (response as unknown as { status?: number })?.status || 400);
    }
    if (!data || !(data as { data?: { user?: unknown } })?.data?.user) {
      throw new ApiError("Server not available. Please try again later.", 503);
    }
    return (data as { data: RegisterSuccess }).data;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("Server not available. Please check your connection.", 503);
  }
}

export async function getProfile(): Promise<User> {
  try {
    const { data, error, response } = await apiClient.GET("/auth/me");
    if (error || !data) throw new ApiError("Session expired or server not available.", response?.status || 401);
    return (data as { data: User }).data;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("Server not available.", 503);
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    const { error, response } = await apiClient.POST("/auth/logout");
    if (error) throw new ApiError("Logout failed", response?.status || 500);
  } catch {
    // Ignore logout network errors
  }
}

export async function verifyEmail(email: string, code: string): Promise<void> {
  await proxyFetch("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, token: code }),
  });
}

export async function resendVerification(email: string): Promise<void> {
  await proxyFetch("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
