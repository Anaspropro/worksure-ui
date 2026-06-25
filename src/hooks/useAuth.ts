"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearSessionHint,
  getProfile,
  hasSessionHint,
  login,
  markSessionHint,
  logoutRequest,
  register,
} from "@/api-client";
import type { AuthSuccess, RegisterSuccess, User } from "@/types/index";

export function useUser() {
  const hasToken = hasSessionHint();

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const query = useQuery<User>({
    queryKey: ["user"],
    queryFn: getProfile,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const isAuthLoading = !isHydrated || (hasToken && query.isPending);
  const isAuthenticated = !!query.data;

  return {
    ...query,
    isAuthLoading,
    isAuthenticated,
  };
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

  return useMutation<
    RegisterSuccess,
    Error,
    { name: string; email: string; password: string; role: User["role"] }
  >({
    mutationFn: async ({ name, email, password, role }: { name: string; email: string; password: string; role: User["role"] }) =>
      register(name, email, password, role),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutRequest();
    },
    onMutate() {
      clearSessionHint();
      queryClient.clear();
    },
    onSettled() {
      clearSessionHint();
      queryClient.clear();
    },
  });
}
