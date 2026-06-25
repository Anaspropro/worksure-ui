"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.4, ease: "easeOut" as const },
  }),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ArtisanWorkspaceSection(_props: {
  jobs: unknown;
  proposalJobId: unknown;
  proposalAmountInput: unknown;
  proposalMessage: unknown;
  setProposalJobId: unknown;
  setProposalAmountInput: unknown;
  setProposalMessage: unknown;
  onSubmitProposal: unknown;
  isBusy: unknown;
  formatAmount: unknown;
  artisanVerified: unknown;
}) {

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
