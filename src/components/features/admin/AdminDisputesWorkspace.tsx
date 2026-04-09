"use client";

import { useState } from "react";
import { toast } from "sonner";
import AppShell from "@/components/app-shell/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAdminDisputes, useResolveAdminDispute } from "@/hooks/useAdmin";
import { useUser } from "@/hooks/useAuth";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function AdminDisputesWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const disputesQuery = useAdminDisputes({ enabled: Boolean(user) });
  const resolveDisputeMutation = useResolveAdminDispute();
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  if (!user) {
    return null;
  }

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Dispute Resolution Workspace</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Review open disputes and decide whether escrow should return to the client or pay out to the artisan.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle>Dispute queue</CardTitle>
            <CardDescription>Admin actions here map directly to backend dispute endpoints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {disputesQuery.data?.data.length ? (
              disputesQuery.data.data.map((dispute) => (
                <div key={dispute.id} className="rounded-2xl border border-border bg-background/75 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">Dispute {dispute.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Contract: {dispute.contractId ?? "N/A"} - Amount: {formatCurrency(dispute.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Client: {dispute.clientId} - Artisan: {dispute.artisanId}
                      </p>
                    </div>
                    <Badge variant={dispute.status === "RESOLVED" ? "secondary" : "warning"}>{dispute.status}</Badge>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
                    <Textarea
                      value={notesById[dispute.id] ?? ""}
                      onChange={(event) =>
                        setNotesById((current) => ({
                          ...current,
                          [dispute.id]: event.target.value,
                        }))
                      }
                      placeholder="Resolution notes"
                      className="min-h-24"
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const toastId = toast.loading("Resolving dispute...");
                          resolveDisputeMutation.mutate(
                            {
                              disputeId: dispute.id,
                              decision: "REFUND_CLIENT",
                              notes: notesById[dispute.id],
                            },
                            {
                              onSuccess: () => toast.success("Client refund approved.", { id: toastId }),
                              onError: (error) => toast.error(error.message || "Unable to resolve dispute.", { id: toastId }),
                            },
                          );
                        }}
                        disabled={dispute.status === "RESOLVED" || resolveDisputeMutation.status === "pending"}
                      >
                        Refund client
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const toastId = toast.loading("Resolving dispute...");
                          resolveDisputeMutation.mutate(
                            {
                              disputeId: dispute.id,
                              decision: "PAY_ARTISAN",
                              notes: notesById[dispute.id],
                            },
                            {
                              onSuccess: () => toast.success("Artisan payout approved.", { id: toastId }),
                              onError: (error) => toast.error(error.message || "Unable to resolve dispute.", { id: toastId }),
                            },
                          );
                        }}
                        disabled={dispute.status === "RESOLVED" || resolveDisputeMutation.status === "pending"}
                      >
                        Pay artisan
                      </Button>
                    </div>
                  </div>

                  {dispute.resolution ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Resolved with {dispute.resolution.decision} on {formatDate(dispute.resolution.resolvedAt)}
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 p-6 text-sm text-muted-foreground">
                No disputes found right now.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
