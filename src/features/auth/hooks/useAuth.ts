"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { del } from "idb-keyval";
import {
  clearSessionHint,
  hasSessionHint,
  markSessionHint,
  getStoredUserSession,
} from "@/shared/api/fetcher";
import {
  login,
  register,
  getProfile,
  logoutRequest,
} from "../services/auth-service";
import { authKeys } from "@/shared/api/queryKeys";
import type { AuthSuccess, RegisterSuccess, User } from "@/types";

export function useUser() {
  const hasToken = hasSessionHint();

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const query = useQuery<User>({
    queryKey: authKeys.user(),
    queryFn: getProfile,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: getStoredUserSession,
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
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
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
    onSettled() {
      clearSessionHint();
      queryClient.clear();
      void del("reactQuery");
    },
  });
}
