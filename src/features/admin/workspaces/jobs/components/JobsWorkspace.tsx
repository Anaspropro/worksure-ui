"use client";

import { useState } from "react";
import { useAdminJobs, useAdminJobMutations } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { AlertCircle, Ban } from "lucide-react";
import { toast } from "sonner";

export function JobsWorkspace() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const { data: jobsData, isLoading } = useAdminJobs({
    cursor,
    limit: 20,
    ...(search ? { search } : {}),
    ...(statusFilter ? { status: statusFilter } : {})
  });
  
  const { forceCloseJob } = useAdminJobMutations();

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  const jobs = jobsData?.data || [];
  const meta = jobsData?.meta;

  const handleForceClose = (jobId: string) => {
    if (confirm("Are you sure you want to FORCE CLOSE this job? This is an irreversible moderation action used for policy violations or severe disputes.")) {
      const reason = prompt("Enter reason for force closing (will be recorded in audit log):");
      forceCloseJob.mutate({ jobId, reason: reason || undefined }, {
        onSuccess: () => toast.success("Job has been force closed"),
        onError: (err: any) => toast.error(err.message || "Failed to force close job")
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setCursor(undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace Moderation</h1>
        <p className="text-muted-foreground mt-1">Monitor jobs and enforce platform policies.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Job Listings</CardTitle>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCursor(undefined);
                }}
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="FORCE_CLOSED">Force Closed</option>
              </select>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  className="px-3 py-2 border rounded-md text-sm w-64"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button type="submit" variant="secondary">Search</Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Moderation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No jobs found.</TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job: any) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="font-medium flex items-center gap-2">
                          {job.title}
                          {job.flagged && <AlertCircle className="size-4 text-destructive" />}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate max-w-sm">
                          {job.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={job.status === "FORCE_CLOSED" ? "destructive" : "outline"}
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(job.amount)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(job.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {job.status !== "COMPLETED" && job.status !== "FORCE_CLOSED" ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleForceClose(job.id)}
                            disabled={forceCloseJob.isPending}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Force Close
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            {job.status === "FORCE_CLOSED" ? "Moderated" : "Completed naturally"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {jobs.length} jobs {meta?.flagged ? `(${meta.flagged} flagged)` : ''}
            </div>
            <Button
              variant="outline"
              disabled={!meta?.nextCursor}
              onClick={() => setCursor((meta as any)?.nextCursor)}
            >
              Next Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
