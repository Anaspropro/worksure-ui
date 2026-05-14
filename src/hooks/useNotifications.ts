"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch, proxyFetchRaw } from "@/api-client";
import type { ApiPagination, Notification, NotificationStats } from "@/types";

type NotificationsResponse = {
  notifications: Notification[];
  pagination: ApiPagination;
};

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () =>
      proxyFetchRaw<NotificationsResponse>("/notifications").then(
        (response) => response.notifications,
      ),
  });
}

export function useMyNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications", "me"],
    queryFn: () => proxyFetchRaw<Notification[]>("/notifications/me"),
  });
}

export function useNotificationStats() {
  return useQuery<NotificationStats>({
    queryKey: ["notifications", "stats"],
    queryFn: () => proxyFetchRaw<NotificationStats>("/notifications/stats/me"),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      proxyFetch(`/notifications/${notificationId}/delete`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
