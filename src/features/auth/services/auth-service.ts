import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import type { AuthSuccess, RegisterSuccess, User, UserRole } from "@/types";

export async function login(email: string, password: string): Promise<AuthSuccess> {
  try {
    const { data, error, response } = await apiClient.POST("/auth/login", {
      body: { email, password }
    });
    if (error) {
      const serverMessage = (error as { message?: string })?.message;
      const status = response?.status || 401;
      if (status >= 500) {
        throw new ApiError(
          serverMessage ||
            "Backend server is currently unavailable. Please try again later.",
          status,
        );
      }
      if (status === 404) {
        throw new ApiError(
          serverMessage ||
            "Authentication endpoint not found (404). Please ensure the backend server is reachable.",
          404,
        );
      }
      if (status === 401) {
        throw new ApiError(
          serverMessage ||
            "Invalid credentials provided. Please check your email and password.",
          401,
        );
      }
      throw new ApiError(serverMessage || "Login failed. Please try again.", status);
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
      const serverMessage = (error as { message?: string })?.message;
      const status = (response as unknown as { status?: number })?.status || 400;
      if (status >= 500) {
        throw new ApiError(
          serverMessage ||
            "Backend server is currently unavailable. Please try again later.",
          status,
        );
      }
      if (status === 404) {
        throw new ApiError(
          serverMessage || "Registration endpoint not found (404).",
          404,
        );
      }
      if (status === 409) {
        throw new ApiError(
          serverMessage || "An account with this email already exists.",
          409,
        );
      }
      throw new ApiError(
        serverMessage || "Registration failed. Please check your details and try again.",
        status,
      );
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
  const { error, response } = await apiClient.POST("/auth/verify-email", {
    body: { email, token: code } as any
  });
  if (error) {
    const serverMessage = (error as { message?: string })?.message;
    throw new ApiError(
      serverMessage || "Failed to verify email. Please check your verification code.",
      (response as Response)?.status || 400,
    );
  }
}

export async function resendVerification(email: string): Promise<void> {
  const { error, response } = await apiClient.POST("/auth/resend-verification", {
    body: { email } as any
  });
  if (error) {
    const serverMessage = (error as { message?: string })?.message;
    throw new ApiError(
      serverMessage || "Failed to resend verification code. Please try again later.",
      (response as Response)?.status || 400,
    );
  }
}
