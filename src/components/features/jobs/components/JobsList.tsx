"use client";

import Link from "next/link";
import { useDeferredValue } from "react";
import { BriefcaseBusiness, FilePlus2, Search, Send } from "lucide-react";
import type { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useInfiniteJobs } from "@/hooks/useJobs";
import { formatCurrency, formatDate } from "@/lib/formatters";

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-background/70 p-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-full" />
        </div>
        <div className="h-6 w-16 bg-muted rounded-full" />
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-3 bg-muted rounded w-20" />
        <div className="h-3 bg-muted rounded w-16" />
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/30 p-10 text-center">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="size-6 text-primary" />
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function JobsList({
  user,
  search,
  setSearch,
  onApplyToJob,
}: {
  user: User;
  search: string;
  setSearch: (s: string) => void;
  onApplyToJob: (jobId: string) => void;
}) {
  const deferredSearch = useDeferredValue(search);
  const ITEMS_PER_PAGE = 5;

  const jobsQuery = useInfiniteJobs({
    clientId: user?.role === "CLIENT" ? user.id : undefined,
    status: user?.role === "ARTISAN" ? "OPEN" : undefined,
    search: deferredSearch.trim() || undefined,
    limit: ITEMS_PER_PAGE,
  });

  const jobs = jobsQuery.data?.pages.flatMap((page) => page.data || page.jobs || []) ?? [];
  const isLoading = jobsQuery.isLoading;
  const isFetchingNextPage = jobsQuery.isFetchingNextPage;
  const hasNextPage = jobsQuery.hasNextPage;

  const isClient = user?.role === "CLIENT";
  const isArtisan = user?.role === "ARTISAN";

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs w-full mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle>
            {isClient ? "Your posted jobs" : "Open jobs in the marketplace"}
          </CardTitle>
          <CardDescription>
            {isClient
              ? "Jobs you've published. Artisans will submit proposals to these."
              : "Select a job to submit your proposal with a price and delivery plan."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : jobs.length ? (
            <ul className="divide-y divide-border/50">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="group relative flex flex-col gap-4 p-5 sm:p-6 bg-card hover:bg-muted/30 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {job.title}
                        </p>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <span className="text-xl font-bold text-foreground">
                        {formatCurrency(job.budget)}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Posted {formatDate(job.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                        {job.category ?? "General"}
                      </span>
                    </div>

                    {isArtisan && user.artisanVerified && job.status === "OPEN" && (
                      <Button
                        size="sm"
                        className="shadow-sm"
                        onClick={() => onApplyToJob(job.id)}
                      >
                        <Send className="size-3.5 mr-1.5" />
                        Apply to this job
                      </Button>
                    )}
                  </div>
                </li>
              ))}
              {hasNextPage && (
                <li className="flex items-center justify-center p-4 bg-muted/10">
                  <Button
                    variant="outline"
                    className="bg-background w-full sm:w-auto"
                    onClick={() => jobsQuery.fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load more jobs"}
                  </Button>
                </li>
              )}
            </ul>
          ) : (
            <EmptyState
              icon={BriefcaseBusiness}
              title={isClient ? "No jobs posted yet" : "No open jobs available"}
              description={
                isClient
                  ? "Post your first job to start receiving proposals from verified artisans."
                  : "Check back soon — new jobs are posted regularly."
              }
              action={
                isClient ? (
                  <Button asChild size="sm">
                    <Link href="/jobs/create">
                      <FilePlus2 className="size-4" />
                      Post your first job
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
