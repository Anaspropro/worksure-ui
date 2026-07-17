"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import type { ApiPagination, Notification, NotificationStats } from "@/types";

type NotificationsResponse = {
  notifications: Notification[];
  pagination: ApiPagination;
};

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/notifications", {
        params: { query: { page: "1", limit: "50" } as any }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      const resData = data as unknown as NotificationsResponse;
      return resData.notifications || (data as unknown as Notification[]); // Handle both possible formats
    },
  });
}

export function useMyNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications", "me"],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/notifications", {
        params: { query: { page: "1", limit: "50" } as any }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      const resData = data as unknown as NotificationsResponse;
      return resData.notifications || (data as unknown as Notification[]);
    },
  });
}

export function useNotificationStats() {
  return useQuery<NotificationStats>({
    queryKey: ["notifications", "stats"],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/notifications/unread-count");
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return { unreadCount: Number(data) } as unknown as NotificationStats;
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error, response } = await apiClient.PATCH("/notifications/mark", {
        body: { notificationIds: [notificationId] } as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
