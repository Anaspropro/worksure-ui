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

export default function ArtisanWorkspaceSection({
  jobs,
  proposalJobId,
  proposalAmountInput,
  proposalMessage,
  setProposalJobId,
  setProposalAmountInput,
  setProposalMessage,
  onSubmitProposal,
  isBusy,
  formatAmount,
  artisanVerified,
}: {
  jobs: Array<{ id: string; title: string; budget: number }> | undefined;
  proposalJobId: string;
  proposalAmountInput: string;
  proposalMessage: string;
  setProposalJobId: (value: string) => void;
  setProposalAmountInput: (value: string) => void;
  setProposalMessage: (value: string) => void;
  onSubmitProposal: () => void;
  isBusy: boolean;
  formatAmount: (value: number) => string;
  artisanVerified: boolean;
}) {
  const proposalAmount = Number(proposalAmountInput || 0);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {/* Removed Submit a proposal card as requested */}

      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <Card className="border-border bg-primary/5">
          <CardHeader>
            <CardTitle>Artisan trust signals</CardTitle>
            <CardDescription>
              Use funded contracts and visible status changes to reduce uncertainty about payout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-text-secondary">
            <p>Bid on active work with a clear scope and amount.</p>
            <p>Track accepted proposals as contracts with visible escrow status.</p>
            <p>Confirm delivery once the funded work is complete.</p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
