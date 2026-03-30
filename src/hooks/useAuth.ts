"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearToken, getProfile, login, register, setToken } from "@/proxy";
import type { User } from "@/types";

export function useUser() {
  return useQuery<User, Error, User>(["user"], getProfile, {
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<
    { accessToken: string },
    Error,
    { email: string; password: string }
  >(
    ({ email, password }: { email: string; password: string }) => login(email, password),
    {
      onSuccess(data) {
        setToken(data.accessToken);
        queryClient.invalidateQueries(["user"]);
      },
    },
  );
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { name: string; email: string; password: string; role: User["role"] }
  >(
    ({ name, email, password, role }: { name: string; email: string; password: string; role: User["role"] }) =>
      register(name, email, password, role),
    {
      onSuccess() {
        queryClient.invalidateQueries(["user"]);
      },
    },
  );
}

export function useLogout() {
  return () => {
    clearToken();
    window.location.reload();
  };
}
