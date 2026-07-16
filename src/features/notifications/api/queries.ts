import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: string) => [...notificationKeys.lists(), { filters }] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

// API Fetchers
const fetchNotifications = async ({ pageParam = 1 }) => {
  const { data } = await api.get(`/notifications?page=${pageParam}&limit=20`);
  return data; // Expected { data: Notification[], pagination: {...} }
};

const fetchUnreadCount = async () => {
  const { data } = await api.get('/notifications/unread-count');
  return data.unreadCount;
};

const fetchPreferences = async () => {
  const { data } = await api.get('/notifications/preferences');
  return data;
};

const markAsRead = async (notificationIds: string[]) => {
  const { data } = await api.patch('/notifications/mark', { notificationIds });
  return data;
};

const markAllAsRead = async () => {
  const { data } = await api.patch('/notifications/read-all');
  return data;
};

const updatePreference = async (payload: { channel: string; category: string; enabled: boolean }) => {
  const { data } = await api.patch('/notifications/preferences', payload);
  return data;
};

// Hooks
export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: notificationKeys.lists(),
    queryFn: fetchNotifications,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: fetchUnreadCount,
    refetchInterval: 60000, // Poll every minute as fallback
  });
};

export const usePreferences = () => {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: fetchPreferences,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useUpdatePreference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePreference,
    onMutate: async (newPref) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.preferences() });
      const previous = queryClient.getQueryData(notificationKeys.preferences());
      // Optimistic update
      queryClient.setQueryData(notificationKeys.preferences(), (old: any[]) => {
        if (!old) return [];
        const index = old.findIndex(p => p.channel === newPref.channel && p.category === newPref.category);
        if (index > -1) {
          const updated = [...old];
          updated[index] = { ...updated[index], enabled: newPref.enabled };
          return updated;
        }
        return [...old, newPref];
      });
      return { previous };
    },
    onError: (err, newPref, context) => {
      queryClient.setQueryData(notificationKeys.preferences(), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
    },
  });
};
