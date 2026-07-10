import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReconciliationReports, useRunReconciliation } from "../hooks/useAdminFinances";
import { formatDate } from "@/lib/formatters";
import { Loader2, RefreshCw, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useAdminSystemHealth } from "@/features/admin/api/useAdmin";

export function ReconciliationPanel() {
  const { data: reportsData, isLoading: reportsLoading } = useReconciliationReports();
  const runReconciliationMutation = useRunReconciliation();
  const { data: healthData, isLoading: healthLoading } = useAdminSystemHealth({ refetchInterval: 60000 });
  const [isRunning, setIsRunning] = useState(false);

  const reports = reportsData?.data || [];
  
  const handleRunReconciliation = () => {
    setIsRunning(true);
    const toastId = toast.loading("Running manual reconciliation...");
    runReconciliationMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Reconciliation triggered successfully", { id: toastId });
        setIsRunning(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to run reconciliation", { id: toastId });
        setIsRunning(false);
      },
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Action Panel */}
      <div className="md:col-span-4 space-y-4">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="size-5 text-primary" />
              Manual Reconciliation
            </CardTitle>
            <CardDescription>
              Trigger an immediate reconciliation of internal ledger balances vs payment gateway balances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleRunReconciliation} 
              disabled={isRunning || runReconciliationMutation.status === "pending"}
              className="w-full shadow-sm"
            >
              {isRunning ? (
                <><Loader2 className="size-4 mr-2 animate-spin" /> Running...</>
              ) : (
                <><RefreshCw className="size-4 mr-2" /> Trigger Reconciliation</>
              )}
            </Button>
            <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground border border-border/50">
              <p className="flex items-start gap-2">
                <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Reconciliation usually runs automatically via cron jobs. Manual runs are only needed for immediate verification.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Health Snapshot */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              System Financial Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <div className="flex justify-center p-2"><Loader2 className="size-4 animate-spin text-muted-foreground" /></div>
            ) : healthData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Database status</span>
                  <Badge variant={healthData.database.status === "connected" ? "default" : "destructive"}>
                    {healthData.database.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">External Gateway</span>
                  <Badge variant={healthData.uptime > 0 ? "default" : "secondary"}>
                    {healthData.uptime > 0 ? 'connected' : 'unknown'}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Health data unavailable</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reports Panel */}
      <div className="md:col-span-8">
        <Card className="border-border bg-card shadow-sm h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-muted-foreground" />
              Reconciliation Logs
            </CardTitle>
            <CardDescription>Recent automated and manual reconciliation runs.</CardDescription>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                <p>No reconciliation logs found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 rounded-lg border bg-surface/30 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{report.action}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(report.performedAt)}</p>
                      </div>
                      <Badge variant="outline" className="bg-background">
                        {report.entityType}
                      </Badge>
                    </div>
                    {report.metadata && (
                      <pre className="text-xs bg-muted/80 p-2 rounded overflow-x-auto text-muted-foreground mt-2 border border-border/50">
                        {typeof report.metadata === 'string' 
                          ? report.metadata 
                          : JSON.stringify(report.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
