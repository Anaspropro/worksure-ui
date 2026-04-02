import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobsPanel({
  roleView,
  jobs,
  formatAmount,
}: {
  roleView: string;
  jobs: Array<{ id: string; title: string; description: string; budget: number; status: string }>;
  formatAmount: (value: number) => string;
}) {
  return (
    <Card className="border-border/90 bg-white">
      <CardHeader>
        <CardTitle>{roleView === "CLIENT" ? "Your jobs" : "Open jobs"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.length ? (
          jobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-foreground">{job.title}</p>
                <StatusBadge status={job.status} />
              </div>
              <p className="mt-2 text-sm text-text-secondary">{job.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary">Budget</Badge>
                <span className="text-sm font-medium text-secondary">{formatAmount(job.budget)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-secondary">No jobs to show yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
