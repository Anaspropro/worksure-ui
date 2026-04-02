"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearToken,
  getProfile,
  login,
  logoutRequest,
  register,
  setToken,
} from "@/proxy";
import type { AuthSuccess, User } from "@/types/index";

export function useUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: getProfile,
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
      setToken(data.accessToken);
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
      setToken(data.accessToken);
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
      clearToken();
      queryClient.clear();
    },
  });
}
