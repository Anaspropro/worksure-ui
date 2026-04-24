"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialAmount } from "@/components/ui/financial-amount";
import type { Contract, User } from "@/types";

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" as const },
  }),
};

export default function ContractsPanel({
  contracts,
  user,
  isBusy,
  onFundContract,
  onConfirmCompletion,
  onReleaseEscrow,
  onRefund,
  formatAmount,
}: {
  contracts: Contract[] | undefined;
  user: User;
  isBusy: boolean;
  onFundContract: (contractId: string, amount: number) => void;
  onConfirmCompletion: (contractId: string, isClient: boolean) => void;
  onReleaseEscrow: (contractId: string) => void;
  onRefund: (contractId: string) => void;
  formatAmount: (value: number) => string;
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Contracts</CardTitle>
        <CardDescription>Current contract status and escrow actions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {contracts?.length ? (
          contracts.map((contract, i) => (
            <motion.div
              key={contract.id}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="rounded-lg border border-border bg-surface p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-foreground">{contract.job.title}</p>
                <StatusBadge status={contract.escrowReleased ? "COMPLETED" : contract.status} />
              </div>
              <p className="mt-2 text-sm font-medium text-amount-primary">
                <FinancialAmount amount={contract.amount} size="sm" />
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Client confirm: {String(contract.clientConfirmedCompletion)} / Artisan confirm:{" "}
                {String(contract.artisanConfirmedCompletion)}
              </p>

              {contract.status === "DRAFT" && user.id === contract.clientId ? (
                <div className="mt-3">
                  <Button size="sm" onClick={() => onFundContract(contract.id, contract.amount)} disabled={isBusy}>
                    Fund contract
                  </Button>
                </div>
              ) : null}

              {contract.status === "ACTIVE" && user.id === contract.clientId ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onConfirmCompletion(contract.id, true)} disabled={isBusy}>
                    Confirm completion
                  </Button>
                </div>
              ) : null}

              {contract.status === "ACTIVE" && user.id === contract.artisanId ? (
                <div className="mt-3">
                  <Button size="sm" variant="secondary" onClick={() => onConfirmCompletion(contract.id, false)} disabled={isBusy}>
                    Confirm delivery
                  </Button>
                </div>
              ) : null}

              {contract.status === "ACTIVE" &&
              contract.clientConfirmedCompletion &&
              contract.artisanConfirmedCompletion &&
              !contract.escrowReleased &&
              user.id === contract.clientId ? (
                <div className="mt-3">
                  <Button size="sm" onClick={() => onReleaseEscrow(contract.id)} disabled={isBusy}>
                    Release escrow
                  </Button>
                </div>
              ) : null}

              {contract.status === "ACTIVE" &&
              !contract.escrowReleased &&
              user.id === contract.clientId ? (
                <div className="mt-3">
                  <Button size="sm" variant="outline" onClick={() => onRefund(contract.id)} disabled={isBusy}>
                    Refund
                  </Button>
                </div>
              ) : null}
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No contracts yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
