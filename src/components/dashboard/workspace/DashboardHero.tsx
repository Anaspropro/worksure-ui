"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { workflowSteps } from "@/components/dashboard/workspace/dashboard-copy";

function WorkflowIcon({ icon }: { icon: (typeof workflowSteps)[number]["icon"] }) {
  if (icon === "wallet") return <Wallet className="size-4 text-primary" />;
  if (icon === "progress") return <CircleDashed className="size-4 text-primary" />;
  return <CheckCircle2 className="size-4 text-success" />;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function DashboardHero({
  roleView,
  title,
  description,
}: {
  roleView: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      <Card className="border bg-card shadow-sm mb-6">
        <CardHeader className="space-y-4">
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="w-fit rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-primary">
              {roleView.toLowerCase()} dashboard
            </Badge>
          </motion.div>
          <motion.div variants={fadeUp} className="space-y-2">
            <CardTitle className="text-2xl tracking-tight text-foreground sm:text-3xl">{title}</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </CardDescription>
          </motion.div>
          <motion.div variants={fadeUp} className="grid gap-3 rounded-xl bg-muted/30 p-4 grid-cols-2 md:grid-cols-4">
            {workflowSteps.map(({ label, icon }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 border border-border shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.35 }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/8">
                  <WorkflowIcon icon={icon} />
                </div>
                <p className="text-sm font-medium text-foreground">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
