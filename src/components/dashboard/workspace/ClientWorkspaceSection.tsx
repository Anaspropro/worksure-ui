"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function ClientWorkspaceSection({
  jobTitle,
  jobDescription,
  jobBudgetInput,
  setJobTitle,
  setJobDescription,
  setJobBudgetInput,
  onCreateJob,
  isBusy,
}: {
  jobTitle: string;
  jobDescription: string;
  jobBudgetInput: string;
  setJobTitle: (value: string) => void;
  setJobDescription: (value: string) => void;
  setJobBudgetInput: (value: string) => void;
  onCreateJob: () => void;
  isBusy: boolean;
}) {
  const jobBudget = Number(jobBudgetInput || 0);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Post a job</CardTitle>
            <CardDescription>
              Create new work opportunities for artisans in the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Job title" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} />
            <Textarea placeholder="Describe the work" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
            <Input type="number" placeholder="Budget" value={jobBudgetInput} onChange={(event) => setJobBudgetInput(event.target.value)} />
            <Button onClick={onCreateJob} disabled={isBusy || !jobTitle || jobBudget <= 0}>
              Create job
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="border-border bg-primary/5">
          <CardHeader>
            <CardTitle>Client payment rules</CardTitle>
            <CardDescription>
              Keep money-related actions obvious and deliberate in every contract.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-text-secondary">
            <p>Fund escrow only after reviewing the proposal and contract amount.</p>
            <p>Confirm completion only when the delivered work matches the agreement.</p>
            <p>Release or refund from the contract card so status always stays visible.</p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
