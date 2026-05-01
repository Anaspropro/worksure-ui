"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearSessionHint,
  getProfile,
  hasSessionHint,
  login,
  markSessionHint,
  logoutRequest,
  register,
} from "@/proxy";
import type { AuthSuccess, User } from "@/types/index";

export function useUser() {
  const hasToken = hasSessionHint();

  return useQuery<User>({
    queryKey: ["user"],
    queryFn: getProfile,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthSuccess, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess(data) {
      markSessionHint();
      queryClient.setQueryData(["user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<
    AuthSuccess,
    Error,
    { name: string; email: string; password: string; role: User["role"] }
  >({
    mutationFn: async ({ name, email, password, role }: { name: string; email: string; password: string; role: User["role"] }) =>
      register(name, email, password, role),
    onSuccess(data) {
      markSessionHint();
      queryClient.setQueryData(["user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutRequest();
    },
    onSettled() {
      clearSessionHint();
      queryClient.clear();
    },
  });
}
