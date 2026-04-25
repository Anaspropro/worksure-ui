"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import AppShell from "@/components/app-shell/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import ContractChatPanel from "@/components/features/contracts/ContractChatPanel";
import { useUser } from "@/hooks/useAuth";
import {
  useConfirmCompletion,
  useContract,
  useFundContract,
  useRefundContract,
  useReleaseEscrow,
} from "@/hooks/useContracts";
import { formatCurrency, formatDate } from "@/lib/formatters";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function ContractDetailWorkspace({
  contractId,
}: {
  contractId: string;
}) {
  const userQuery = useUser();
  const user = userQuery.data;
  const contractQuery = useContract(contractId, { enabled: Boolean(user) });
  const fundContractMutation = useFundContract();
  const confirmCompletionMutation = useConfirmCompletion();
  const releaseEscrowMutation = useReleaseEscrow();
  const refundContractMutation = useRefundContract();

  if (!user) {
    return null;
  }

  const contract = contractQuery.data;

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
          <Card className="border-border bg-card">
            <CardHeader className="gap-3">
              <Button asChild variant="ghost" size="sm" className="w-fit">
                <Link href="/contracts">
                  <ArrowLeft className="size-4" />
                  Back to contracts
                </Link>
              </Button>
              <div className="space-y-1">
                <CardTitle className="text-3xl tracking-tight">Contract Detail</CardTitle>
                <CardDescription className="max-w-3xl text-base leading-7">
                  Review the full escrow state, confirmations, and next action for this agreement.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {!contract ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Loading contract details...
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle>{contract.job.title}</CardTitle>
                      <StatusBadge status={contract.status} />
                    </div>
                    <CardDescription>{contract.job.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
                    <p>Contract amount: {formatCurrency(contract.amount)}</p>
                    <p>Escrow released: {contract.escrowReleased ? "Yes" : "No"}</p>
                    <p>Funded at: {formatDate(contract.fundedAt)}</p>
                    <p>Started at: {formatDate(contract.startedAt)}</p>
                    <p>Completed at: {formatDate(contract.completedAt)}</p>
                    <p>Escrow released at: {formatDate(contract.escrowReleasedAt)}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
                <Card className="border-border bg-primary/5">
                  <CardHeader>
                    <CardTitle>Action checklist</CardTitle>
                    <CardDescription>Money moves only after the right confirmations are visible.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>Client confirmed: {contract.clientConfirmedCompletion ? "Yes" : "No"}</p>
                    <p>Artisan confirmed: {contract.artisanConfirmedCompletion ? "Yes" : "No"}</p>
                    <p>Proposal amount: {formatCurrency(contract.proposal.amount)}</p>
                    <p>Proposal status: {contract.proposal.status}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </section>

            <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Available actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {contract.status === "DRAFT" && user.id === contract.clientId ? (
                    <Button
                      onClick={() =>
                        fundContractMutation.mutate({
                          contractId: contract.id,
                          email: user.email,
                          callbackUrl: window.location.href,
                        })
                      }
                      disabled={fundContractMutation.status === "pending"}
                    >
                      Fund escrow
                    </Button>
                  ) : null}
                  {contract.status === "ACTIVE" && user.id === contract.clientId ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        confirmCompletionMutation.mutate({
                          contractId: contract.id,
                          isClient: true,
                        })
                      }
                      disabled={confirmCompletionMutation.status === "pending"}
                    >
                      Confirm as client
                    </Button>
                  ) : null}
                  {contract.status === "ACTIVE" && user.id === contract.artisanId ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        confirmCompletionMutation.mutate({
                          contractId: contract.id,
                          isClient: false,
                        })
                      }
                      disabled={confirmCompletionMutation.status === "pending"}
                    >
                      Confirm as artisan
                    </Button>
                  ) : null}
                  {contract.status === "ACTIVE" &&
                  contract.clientConfirmedCompletion &&
                  contract.artisanConfirmedCompletion &&
                  !contract.escrowReleased &&
                  user.id === contract.clientId ? (
                    <Button
                      onClick={() => releaseEscrowMutation.mutate(contract.id)}
                      disabled={releaseEscrowMutation.status === "pending"}
                    >
                      Release payment
                    </Button>
                  ) : null}
                  {contract.status === "ACTIVE" && !contract.escrowReleased && user.id === contract.clientId ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        refundContractMutation.mutate({
                          contractId: contract.id,
                          reason: "Client requested refund",
                        })
                      }
                      disabled={refundContractMutation.status === "pending"}
                    >
                      Refund contract
                    </Button>
                  ) : null}
                  {contract.status === "COMPLETED" ? (
                    <Button asChild variant="outline">
                      <Link href="/reviews">Leave or view reviews</Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>

            <ContractChatPanel contract={contract} user={user} />
          </>
        )}
      </main>
    </AppShell>
  );
}
