"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  ChevronRight,
  Filter,
  Search,
  Calendar,
  User,
  Tag,
  X,
  MapPin
} from "lucide-react";
import { useAdminJobs } from "@/hooks/useAdmin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@/types";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function AdminJobsWorkspace() {
  const [statusFilter] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const currentCursor = cursors[page - 1];
  const itemsPerPage = 20;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset page on search
      setCursors([undefined]);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: jobsResponse, isLoading: jobsLoading } = useAdminJobs({
    status: statusFilter,
    cursor: currentCursor,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
  });
  const jobs = jobsResponse?.data || [];

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BriefcaseBusiness className="size-8 text-primary" />
          Job Registry
        </h1>
        <p className="text-text-secondary max-w-2xl">
          Complete record of all project postings, artisan engagements, and system-wide work requests.
        </p>
      </div>
      {/* ── Stats Overview ────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    System-wide postings
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <div className="h-2 w-2 rounded-full bg-warning" />
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {jobs.filter(j => j.status === 'OPEN').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Awaiting artisans
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <div className="h-2 w-2 rounded-full bg-info" />
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {jobs.filter(j => j.status === 'IN_PROGRESS').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active contracts
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="h-2 w-2 rounded-full bg-primary" />
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {jobs.filter(j => j.status === 'COMPLETED').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Successfully finished
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Job List ─────────────────────────────────────────── */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>System Jobs</CardTitle>
              <CardDescription>Monitor and moderate all job postings across the platform</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-9 bg-background"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Job Details</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Budget</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-4 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                ) : jobs?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground italic">
                      No jobs match your criteria.
                    </td>
                  </tr>
                ) : (
                  jobs?.map((job: Job) => (
                    <tr key={job.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                        {job.id.split('-')[0].toUpperCase()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-foreground">{job.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 uppercase tracking-wider">
                            <Tag className="size-2.5 mr-1" />
                            {job.category || 'General'}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center">
                            <Calendar className="size-2.5 mr-1" />
                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="size-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="size-3 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{job.client?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-foreground">
                        ₦{(job.budget ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className={`capitalize ${getStatusBg(job.status)}`}>
                          {job.status.toLowerCase().replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className=" transition-opacity"
                          onClick={() => setSelectedJob(job)}
                        >
                          View details
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || jobsLoading}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button variant="outline" size="sm" onClick={() => {
              if (jobsResponse?.meta?.nextCursor && page === cursors.length) {
                setCursors(prev => [...prev, jobsResponse.meta!.nextCursor as string]);
              }
              setPage(p => p + 1);
            }} disabled={!jobsResponse?.meta?.nextCursor || jobsLoading}>Next</Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Job Details Modal ──────────────────────────────────────── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                <p className="text-sm text-muted-foreground font-mono mt-1">ID: {selectedJob.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Description</h3>
                <p className="text-sm leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <div>
                    <Badge variant="secondary" className={`capitalize ${getStatusBg(selectedJob.status)}`}>
                      {selectedJob.status.toLowerCase().replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Budget</span>
                  <div className="font-semibold">₦{(selectedJob.budget ?? 0).toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Category</span>
                  <div className="flex items-center text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {selectedJob.category || 'N/A'}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Location</span>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedJob.location || 'Remote'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Client Details</h3>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{selectedJob.client?.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedJob.client?.email}</p>
                  </div>
                </div>
              </div>

              {selectedJob.artisan?.id && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">Assigned Artisan</h3>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                      <BriefcaseBusiness className="h-5 w-5 text-info" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{selectedJob.artisan?.name || 'Assigned Artisan'}</p>
                      <p className="text-xs text-muted-foreground font-mono">ID: {selectedJob.artisan?.id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function getStatusBg(status: string) {
  switch (status) {
    case "OPEN": return "bg-success-50 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-400";
    case "IN_PROGRESS": return "bg-info-50 text-info-700 border-info-200 dark:bg-info-900/30 dark:text-info-400";
    case "COMPLETED": return "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400";
    case "CANCELLED": return "bg-muted text-muted-foreground border-border";
    case "DISPUTED": return "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-900/30 dark:text-danger-400";
    default: return "bg-muted/50 text-muted-foreground";
  }
}
