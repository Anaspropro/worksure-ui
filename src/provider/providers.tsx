"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
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
          staleTime: 1000 * 60 * 5, // Data becomes stale after 5 minutes
        },
      },
    }),
  );

  const [persister] = useState<Persister | null>(() => {
    if (typeof window !== "undefined") {
      return createIDBPersister();
    }
    return null;
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {!persister ? (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ) : (
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          {children}
        </PersistQueryClientProvider>
      )}
    </ThemeProvider>
  );
}
