"use client";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState, useEffect } from "react";
import { get, set, del } from "idb-keyval";
import type { Persister, PersistedClient } from "@tanstack/react-query-persist-client";

function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery"): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  };
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
          gcTime: 1000 * 60 * 60 * 24 * 7, // Keep data in garbage collection for 7 days offline
          staleTime: 1000 * 60, // Data becomes stale after 1 minute
        },
      },
    }),
  );

  const [persister, setPersister] = useState<Persister | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPersister(createIDBPersister());
    }
  }, []);

  if (!persister) {
    // SSR or Initial load before persister is ready
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
