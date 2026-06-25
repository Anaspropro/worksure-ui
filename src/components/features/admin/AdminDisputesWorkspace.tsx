"use client";

import { useState, useMemo } from "react";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminDisputes, useResolveAdminDispute } from "@/hooks/useAdmin";
import type { AdminDisputeRecord } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Button, 
  Input, 
  Badge,  
  Textarea 
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const }
  })
};

export default function AdminDisputesWorkspace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const currentCursor = cursors[page - 1];
  const itemsPerPage = 20;

  const { data: disputes, isLoading } = useAdminDisputes({
    cursor: currentCursor,
    limit: itemsPerPage,
  });
  const resolveMutation = useResolveAdminDispute();

  const filteredDisputes = useMemo(() => {
    return disputes?.data.filter(d => {
      const typedDispute = d as { contractId?: string; clientName?: string; artisanName?: string };
      return (
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        typedDispute.contractId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        typedDispute.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        typedDispute.artisanName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [disputes, searchTerm]);

  const selectedDispute = filteredDisputes?.find(d => d.id === selectedDisputeId);

  const handleResolve = async (decision: "REFUND_CLIENT" | "PAY_ARTISAN") => {
    if (!selectedDisputeId) return;

    const toastId = toast.loading("Resolving dispute...");
    try {
      await resolveMutation.mutateAsync({
        disputeId: selectedDisputeId,
        decision,
        notes: resolutionNotes
      });
      toast.success("Dispute resolved successfully", { id: toastId });
      setSelectedDisputeId(null);
      setResolutionNotes("");
    } catch {
      toast.error("Failed to resolve dispute", { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 space-y-4">
            <Badge variant="outline" className="rounded-full border-white/20 bg-card/10 px-3 py-1 text-white backdrop-blur-md">
              Admin Governance
            </Badge>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Dispute Resolution</h1>
                <CardDescription className="max-w-2xl text-base text-muted-foreground leading-relaxed">
                  Monitor and resolve conflicts between clients and artisans with fairness and visibility.
                </CardDescription>
              </div>
              <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-card/10 border border-white/20 backdrop-blur-md lg:flex">
                <ShieldAlert className="size-8 text-warning" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Layout ────────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by ID, name, or contract..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="size-4" />
                Filter
              </Button>
            </div>

            {/* Disputes List */}
            <div className="grid gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))
              ) : filteredDisputes?.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-12 text-center border-dashed">
                  <AlertTriangle className="size-12 text-muted-foreground/40 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No active disputes found</p>
                </Card>
              ) : (
                filteredDisputes?.map((dispute, i) => (
                  <motion.div
                    key={dispute.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md border-border/60 ${selectedDisputeId === dispute.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      onClick={() => setSelectedDisputeId(dispute.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground uppercase">#{dispute.id.split('-')[0]}</span>
                              <Badge variant={dispute.status === "RESOLVED" ? "secondary" : "warning"}>{dispute.status}</Badge>
                            </div>
                            <h3 className="font-semibold text-lg">{dispute.contractTitle || "Untitled Contract"}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5"><XCircle className="size-3.5" /> {dispute.clientName || dispute.clientId}</span>
                              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5" /> {dispute.artisanName || dispute.artisanId}</span>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="font-bold text-lg text-primary">₦{dispute.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(dispute.createdAt), "MMM d, yyyy")}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {page}</span>
              <Button variant="outline" size="sm" onClick={() => {
                if (disputes?.meta?.nextCursor && page === cursors.length) {
                  setCursors(prev => [...prev, disputes.meta!.nextCursor as string]);
                }
                setPage(p => p + 1);
              }} disabled={!disputes?.meta?.nextCursor || isLoading}>Next</Button>
            </div>
          </div>

          {/* ── Detail Panel ─────────────────────────────────────────── */}
          <aside className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedDispute ? (
                <motion.div
                  key={selectedDispute.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="sticky top-8 border-border/60 bg-card shadow-xl">
                    <CardHeader className="border-b bg-muted/30">
                      <CardTitle className="text-lg">Dispute Details</CardTitle>
                      <CardDescription>Review evidence and resolve</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="rounded-lg bg-danger/5 border border-danger/10 p-4">
                          <p className="text-sm font-medium text-danger mb-1 flex items-center gap-2">
                            <AlertTriangle className="size-4" />
                            Complaint Reason
                          </p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {disputeReason(selectedDispute) || "No specific reason provided."}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <History className="size-4" />
                            Context
                          </p>
                          <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Contract ID:</span>
                              <span className="font-medium">#{(selectedDispute as { contractId?: string }).contractId?.split('-')[0]}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date Opened:</span>
                              <span className="font-medium">{format(new Date(selectedDispute.createdAt), "PPp")}</span>
                            </div>
                          </div>
                        </div>

                        {selectedDispute.status !== "RESOLVED" && (
                          <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center gap-2">
                                <MessageSquare className="size-4" />
                                Resolution Notes
                              </label>
                              <Textarea 
                                placeholder="Explain your decision..."
                                className="min-h-24 resize-none"
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Button 
                                variant="destructive" 
                                className="w-full"
                                disabled={resolveMutation.isPending}
                                onClick={() => handleResolve("REFUND_CLIENT")}
                              >
                                Refund Client
                              </Button>
                              <Button 
                                className="w-full bg-success hover:bg-success/90"
                                disabled={resolveMutation.isPending}
                                onClick={() => handleResolve("PAY_ARTISAN")}
                              >
                                Pay Artisan
                              </Button>
                            </div>
                          </div>
                        )}

                        {selectedDispute.status === "RESOLVED" && (
                          <div className="rounded-lg bg-success/5 border border-success/10 p-4">
                            <p className="text-sm font-medium text-success mb-1 flex items-center gap-2">
                              <CheckCircle2 className="size-4" />
                              Resolved Decision
                            </p>
                            <p className="text-sm font-bold uppercase mb-2">
                              {(selectedDispute as { resolution?: { decision?: string } }).resolution?.decision?.replace('_', ' ')}
                            </p>
                            {(selectedDispute as { resolution?: { notes?: string } }).resolution?.notes && (
                              <p className="text-sm text-muted-foreground italic">
                                &ldquo;{(selectedDispute as { resolution?: { notes?: string } }).resolution?.notes}&rdquo;
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="flex flex-col items-center justify-center py-24 text-center border-dashed bg-muted/10">
                  <ShieldAlert className="size-12 text-muted-foreground/20 mb-4" />
                  <p className="text-sm text-muted-foreground max-w-[200px]">
                    Select a dispute from the list to review details and take action.
                  </p>
                </Card>
              )}
            </AnimatePresence>
          </aside>
        </div>
    </div>
  );
}

function disputeReason(dispute: AdminDisputeRecord & { reason?: string; message?: string }) {
  return dispute.reason || dispute.message || "";
}
