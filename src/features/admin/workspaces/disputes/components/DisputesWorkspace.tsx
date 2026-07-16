"use client";

import { useState } from "react";
import { useAdminDisputes, useAdminDisputeMutations } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { AlertCircle, User, Briefcase, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function DisputesWorkspace() {
  const [cursor, setCursor] = useState<string | undefined>();
  
  const { data: disputesData, isLoading } = useAdminDisputes({
    cursor,
    limit: 20
  });
  
  const { resolveDispute } = useAdminDisputeMutations();

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  const disputes = disputesData?.data || [];
  const meta = disputesData?.meta;

  const handleResolve = (disputeId: string, decision: string) => {
    if (confirm(`Are you sure you want to resolve this dispute in favor of the ${decision === 'CLIENT_WINS' ? 'Client' : 'Artisan'}? This action is irreversible and will move funds.`)) {
      const notes = prompt("Enter resolution notes (optional):");
      resolveDispute.mutate({ disputeId, decision, notes: notes || undefined }, {
        onSuccess: () => toast.success("Dispute resolved successfully"),
        onError: (err: any) => toast.error(err.message || "Failed to resolve dispute")
      });
    }
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
        <h1 className="text-3xl font-bold tracking-tight">Dispute Resolution Operations</h1>
        <p className="text-muted-foreground mt-1">Review evidence and resolve open disputes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{meta?.active || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Resolved Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.resolved || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disputes Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract / Opened At</TableHead>
                  <TableHead>Involved Parties</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Admin Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No disputes found.</TableCell>
                  </TableRow>
                ) : (
                  disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell>
                        <div className="font-medium flex items-center gap-2">
                          <Briefcase className="size-4 text-muted-foreground" />
                          {dispute.contractTitle}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Opened: {format(new Date(dispute.createdAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex items-center gap-2">
                          <User className="size-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Client:</span> {dispute.clientName}
                        </div>
                        <div className="text-sm flex items-center gap-2 mt-1">
                          <User className="size-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Artisan:</span> {dispute.artisanName}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(dispute.amount)}
                      </TableCell>
                      <TableCell>
                        {dispute.status === "OPEN" ? (
                          <Badge variant="destructive">Open</Badge>
                        ) : (
                          <Badge variant="outline">
                            {dispute.resolutionDecision === "CLIENT_WINS" ? "Client Won" : "Artisan Won"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {dispute.status === "OPEN" ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleResolve(dispute.id, 'ARTISAN_WINS')}
                              disabled={resolveDispute.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Artisan Wins
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              onClick={() => handleResolve(dispute.id, 'CLIENT_WINS')}
                              disabled={resolveDispute.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Client Wins
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" disabled>Resolved</Button>
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
              Showing {disputes.length} disputes
            </div>
            <Button
              variant="outline"
              disabled={!meta?.nextCursor}
              onClick={() => setCursor(meta?.nextCursor)}
            >
              Next Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
