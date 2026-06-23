"use client";

import Link from "next/link";
import { useState, useDeferredValue, useMemo } from "react";
import { BriefcaseBusiness, ChevronLeft, ChevronRight, FilePlus2, Search, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useJobs } from "@/hooks/useJobs";
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
  user: any;
  search: string;
  setSearch: (s: string) => void;
  onApplyToJob: (jobId: string) => void;
}) {
  const [jobsPage, setJobsPage] = useState(1);
  const deferredSearch = useDeferredValue(search);
  const ITEMS_PER_PAGE = 5;

  useMemo(() => {
    setJobsPage(1);
  }, [deferredSearch]);

  const jobsQuery = useJobs({
    clientId: user?.role === "CLIENT" ? user.id : undefined,
    status: user?.role === "ARTISAN" ? "OPEN" : undefined,
    search: deferredSearch.trim() || undefined,
    limit: ITEMS_PER_PAGE,
    page: jobsPage,
  });

  const jobsResponse = jobsQuery.data;
  const jobs = jobsResponse?.jobs ?? [];
  const totalJobsPages = jobsResponse?.pagination?.totalPages ?? 1;
  const isLoading = jobsQuery.isLoading;

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
        <CardContent className="space-y-3">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : jobs.length ? (
            <>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-lg border border-border bg-background/70 p-4 hover:border-primary/20 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{job.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {formatCurrency(job.budget)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                      {job.category ?? "General"}
                    </span>
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                  {isArtisan && user.artisanVerified && job.status === "OPEN" && (
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onApplyToJob(job.id)}
                      >
                        <Send className="size-3.5 mr-1.5" />
                        Apply to this job
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {totalJobsPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJobsPage((p) => Math.max(1, p - 1))}
                    disabled={jobsPage === 1}
                  >
                    <ChevronLeft className="size-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {jobsPage} of {totalJobsPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJobsPage((p) => Math.min(totalJobsPages, p + 1))}
                    disabled={jobsPage === totalJobsPages}
                  >
                    Next <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
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
