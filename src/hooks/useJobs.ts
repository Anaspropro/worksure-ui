"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/proxy";
import type { Job } from "@/types";

export function useJobs() {
  return useQuery<Job[], Error, Job[]>(
    ["jobs", "open"],
    () => proxyFetch<{ jobs: Job[] }>("/jobs?status=OPEN&limit=50").then((x) => x.jobs),
    {
      staleTime: 1000 * 30,
    },
  );
}

export function useCreateJob() {
  const qc = useQueryClient();

  return useMutation<Job, Error, { title: string; description: string; budget: number; category: string }>(
    (data) =>
      proxyFetch<Job>("/jobs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    {
      onSuccess() {
        qc.invalidateQueries(["jobs", "open"]);
      },
    },
  );
}
