"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" as const },
  }),
};

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
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>{roleView === "CLIENT" ? "Your jobs" : "Open jobs"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.length ? (
          jobs.map((job, i) => (
            <motion.div
              key={job.id}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="rounded-lg border border-border bg-surface p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-foreground">{job.title}</p>
                <StatusBadge status={job.status} />
              </div>
              <p className="mt-2 text-sm text-text-secondary">{job.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary">Budget</Badge>
                <span className="text-sm font-medium text-muted-foreground">{formatAmount(job.budget)}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-text-secondary">No jobs to show yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
