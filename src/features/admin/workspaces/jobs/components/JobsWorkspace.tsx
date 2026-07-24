"use client";

import { useState } from "react";
import { useAdminJobs, useAdminJobMutations } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import {
  AlertCircle,
  Ban,
  Eye,
  Briefcase,
  Calendar,
  Wallet,
  User,
  FileText,
  Clock,
  Copy,
  Building2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

export function JobsWorkspace() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "parties" | "moderation">("overview");
  
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
        onSuccess: () => {
          toast.success("Job has been force closed");
          if (selectedJob?.id === jobId) {
            setSelectedJob((prev: any) => prev ? { ...prev, status: "FORCE_CLOSED" } : null);
          }
        },
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
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
                className="px-3 py-2 border rounded-md text-sm bg-background"
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
                  className="px-3 py-2 border rounded-md text-sm w-64 bg-background"
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No jobs found.</TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job: any) => (
                    <TableRow 
                      key={job.id} 
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedJob(job);
                        setActiveTab("overview");
                      }}
                    >
                      <TableCell>
                        <div className="font-medium flex items-center gap-2">
                          <span className="font-semibold text-foreground">{job.title}</span>
                          {job.flagged && (
                            <Badge variant="destructive" className="flex items-center gap-1 text-[10px]">
                              <AlertCircle className="size-3" /> Flagged
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate max-w-sm">
                          {job.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={job.status === "FORCE_CLOSED" ? "destructive" : job.status === "COMPLETED" ? "default" : "outline"}
                          className={job.status === "COMPLETED" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {formatCurrency(job.amount)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(job.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2 items-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedJob(job);
                              setActiveTab("overview");
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            View
                          </Button>
                          {job.status !== "COMPLETED" && job.status !== "FORCE_CLOSED" && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleForceClose(job.id)}
                              disabled={forceCloseJob.isPending}
                            >
                              <Ban className="h-4 w-4 mr-1.5" />
                              Force Close
                            </Button>
                          )}
                        </div>
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

      {/* DETAILED JOB POP-UP MODAL */}
      <Dialog open={Boolean(selectedJob)} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-border shadow-2xl bg-card overflow-hidden flex flex-col">
          {selectedJob && (
            <>
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 text-white flex items-center justify-center border-2 border-white/20 shadow-lg flex-shrink-0">
                      <Briefcase className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight text-white">{selectedJob.title}</h2>
                        <Badge 
                          variant="outline" 
                          className="bg-white/10 text-white border-white/20 font-mono text-xs"
                        >
                          {selectedJob.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                          <strong className="text-white">{formatCurrency(selectedJob.amount)}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                          Posted {format(new Date(selectedJob.createdAt), "PPP")}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(selectedJob.id, "Job ID")}
                          className="flex items-center gap-1 font-mono text-[11px] hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-all"
                          title="Click to copy ID"
                        >
                          <Copy className="h-3 w-3" />
                          ID: {selectedJob.id.slice(0, 8)}...
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {selectedJob.flagged && (
                      <Badge variant="destructive" className="px-3 py-1 text-xs flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Flagged
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b bg-muted/20 px-6 flex gap-6 text-sm font-medium">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "overview"
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4" /> Overview & Specs
                </button>
                <button
                  onClick={() => setActiveTab("parties")}
                  className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "parties"
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User className="h-4 w-4" /> Engagement & Parties
                </button>
                <button
                  onClick={() => setActiveTab("moderation")}
                  className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === "moderation"
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Ban className="h-4 w-4" /> Moderation & Actions
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <Card className="bg-card p-4 border border-border">
                        <div className="flex justify-between items-start text-muted-foreground mb-1">
                          <span className="text-xs font-medium">Budget / Amount</span>
                          <Wallet className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          {formatCurrency(selectedJob.amount)}
                        </div>
                      </Card>

                      <Card className="bg-card p-4 border border-border">
                        <div className="flex justify-between items-start text-muted-foreground mb-1">
                          <span className="text-xs font-medium">Status</span>
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-sm font-bold text-foreground">
                          <Badge variant="outline">{selectedJob.status}</Badge>
                        </div>
                      </Card>

                      <Card className="bg-card p-4 border border-border">
                        <div className="flex justify-between items-start text-muted-foreground mb-1">
                          <span className="text-xs font-medium">Category</span>
                          <FileText className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div className="text-sm font-semibold text-foreground truncate">
                          {selectedJob.category || "General Services"}
                        </div>
                      </Card>
                    </div>

                    <Card className="border border-border p-5 space-y-3">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Job Description & Requirements
                      </h3>
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/20 p-4 rounded-lg border border-border">
                        {selectedJob.description || "No description provided."}
                      </div>
                    </Card>
                  </div>
                )}

                {/* PARTIES TAB */}
                {activeTab === "parties" && (
                  <div className="space-y-6">
                    <Card className="border border-border p-5 space-y-4">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 border-b pb-3">
                        <Building2 className="h-4 w-4 text-indigo-500" />
                        Client Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-xs text-muted-foreground block font-medium">Client ID</span>
                          <span className="font-mono text-xs text-foreground">{selectedJob.clientId}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block font-medium">Job Status</span>
                          <Badge variant="outline">{selectedJob.status}</Badge>
                        </div>
                      </div>
                    </Card>

                    <Card className="border border-border p-5 space-y-4">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 border-b pb-3">
                        <User className="h-4 w-4 text-emerald-600" />
                        Assigned Artisan / Contractor
                      </h3>
                      {selectedJob.artisanId ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground block font-medium">Artisan ID</span>
                            <span className="font-mono text-xs text-foreground">{selectedJob.artisanId}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block font-medium">Contract ID</span>
                            <span className="font-mono text-xs text-foreground">{selectedJob.contractId || "N/A"}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-center py-4 text-muted-foreground border border-dashed rounded-lg">
                          No artisan assigned yet. Job is currently open for proposals.
                        </div>
                      )}
                    </Card>
                  </div>
                )}

                {/* MODERATION TAB */}
                {activeTab === "moderation" && (
                  <div className="space-y-6">
                    <Card className="border border-border p-5 space-y-4">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 border-b pb-3">
                        <Ban className="h-4 w-4 text-destructive" />
                        Moderation Controls & Enforcement
                      </h3>

                      {selectedJob.status === "FORCE_CLOSED" ? (
                        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg space-y-2">
                          <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                            <AlertTriangle className="h-4 w-4" /> This Job Has Been Force Closed
                          </div>
                          {selectedJob.forceCloseReason && (
                            <p className="text-xs text-muted-foreground">
                              Reason: {selectedJob.forceCloseReason}
                            </p>
                          )}
                          {selectedJob.forceClosedAt && (
                            <p className="text-[11px] text-muted-foreground">
                              Closed on: {format(new Date(selectedJob.forceClosedAt), "PPP p")}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-muted-foreground">
                            Force closing a job immediately halts all operations, cancels pending proposals, and records an administrative audit log entry.
                          </p>
                          {selectedJob.status !== "COMPLETED" && (
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => handleForceClose(selectedJob.id)}
                              disabled={forceCloseJob.isPending}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Force Close Job Listing
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>
                  </div>
                )}
              </div>

              {/* Action Footer Bar */}
              <div className="p-4 bg-muted/30 border-t flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>

                {selectedJob.status !== "COMPLETED" && selectedJob.status !== "FORCE_CLOSED" && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleForceClose(selectedJob.id)}
                    disabled={forceCloseJob.isPending}
                  >
                    <Ban className="h-4 w-4 mr-1.5" />
                    Force Close
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
