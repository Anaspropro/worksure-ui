"use client";

import { useState } from "react";
import { Scale, Calculator } from "lucide-react";
import { toast } from "sonner";
import { useAdminReconciliationReports, useTriggerReconciliation } from "@/hooks/useAdmin";
import { formatDate } from "@/lib/formatters";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminReconciliationWorkspace() {
  const [page] = useState(1);
  const { data: reportsResponse, isLoading } = useAdminReconciliationReports(page, 20);
  const triggerMutation = useTriggerReconciliation();

  const reports = reportsResponse?.data || [];
  const total = reportsResponse?.meta?.total || 0;

  const handleTrigger = () => {
    triggerMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Manual reconciliation triggered successfully.");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to trigger reconciliation.");
      }
    });
  };

  const getStatusBadge = (action: string) => {
    if (action.includes("SUCCESS")) {
      return <Badge variant="secondary" className="bg-success-50 text-success-700 border-success-200">Success</Badge>;
    } else if (action.includes("DISCREPANCY")) {
      return <Badge variant="destructive">Discrepancy</Badge>;
    }
    return <Badge variant="outline">{action}</Badge>;
  };

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Reconciliation Center
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Compare total internal ledger obligations against the actual dedicated Paystack account balance.
        </p>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleTrigger} 
          disabled={triggerMutation.status === "pending"}
          className="gap-2"
        >
          <Calculator className="size-4" />
          {triggerMutation.status === "pending" ? "Reconciling..." : "Trigger Manual Reconciliation"}
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Reconciliation Reports</CardTitle>
              <CardDescription>
                Total records: {isLoading ? "Loading..." : String(total)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Timestamp</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ledger Obligations</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Paystack Actual</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Discrepancy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-4 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground italic">
                      No reconciliation reports found.
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        {formatDate(report.performedAt)}
                        <div className="text-[10px] opacity-70 mt-0.5">{report.action.includes('NIGHTLY') ? 'Auto (Nightly)' : 'Manual'}</div>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(report.action)}
                      </td>
                      <td className="px-4 py-4 text-right font-mono">
                        {(report.metadata?.totalObligations as number | undefined)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-right font-mono">
                        {(report.metadata?.actualPaystackBalance as number | undefined)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-right font-mono">
                        {(report.metadata?.discrepancy as number | undefined) !== undefined 
                          ? <span className={(report.metadata?.discrepancy as number) !== 0 ? "text-destructive font-bold" : "text-success"}>
                              {(report.metadata?.discrepancy as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
