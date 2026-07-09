"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import ContractChatPanel from "@/components/features/contracts/ContractChatPanel";
import { useUser } from "@/features/auth";
import {
  useConfirmCompletion,
  useContract,
  useFundContract,
  useRefundContract,
  useReleaseEscrow,
  useVerifyContractPayment,
} from "@/hooks/useContracts";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
  const verifyPaymentMutation = useVerifyContractPayment();
  const paystackProcessedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    const status = searchParams.get("status");

    if (reference && !paystackProcessedRef.current && (!status || status === "success")) {
      paystackProcessedRef.current = true;
      verifyPaymentMutation.mutate(
        { reference },
        {
          onSuccess: () => {
            toast.success("Contract payment verified and escrow funded.");
            window.history.replaceState({}, "", window.location.pathname);
            void contractQuery.refetch();
          },
          onError: (error: Error) => {
            toast.error(error.message || "Contract payment verification failed.");
          },
        },
      );
    }
  }, [verifyPaymentMutation, contractQuery]);

  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  if (!user) {
    return null;
  }

  const contract = contractQuery.data;

  return (
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
          <motion.div custom={0.5} variants={sectionVariants} initial="hidden" animate="visible" className="mb-6">
            <Card className="border-border bg-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border sm:hidden" />
                  <div className="hidden sm:block absolute top-1/2 left-10 right-10 h-0.5 -translate-y-1/2 bg-border" />
                  
                  {[
                    { status: "DRAFT", label: "Draft", desc: "Awaiting funds" },
                    { status: "FUNDED", label: "Funded", desc: "Escrow locked" },
                    { status: "ACTIVE", label: "In Progress", desc: "Work ongoing" },
                    { status: "COMPLETED", label: "Completed", desc: "Funds released" },
                  ].map((step, idx) => {
                    const statusOrder = { DRAFT: 0, FUNDED: 1, ACTIVE: 2, COMPLETED: 3, CANCELLED: -1, REFUNDED: -1 };
                    const currentOrder = statusOrder[contract.status as keyof typeof statusOrder] ?? -1;
                    const stepOrder = statusOrder[step.status as keyof typeof statusOrder];
                    
                    const isPast = stepOrder < currentOrder && currentOrder !== -1;
                    const isCurrent = stepOrder === currentOrder;
                    
                    return (
                      <div key={step.status} className="relative z-10 flex flex-row sm:flex-col items-center gap-4 sm:gap-3 py-4 sm:py-0 bg-card sm:bg-transparent pl-12 sm:pl-0 w-full sm:w-1/4">
                        <div className={`flex items-center justify-center size-10 rounded-full border-2 transition-all duration-500 ${
                          isPast ? "bg-primary border-primary text-primary-foreground" :
                          isCurrent ? "bg-background border-primary text-primary ring-4 ring-primary/20" :
                          "bg-muted border-border text-muted-foreground"
                        }`}>
                          {isPast ? <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> :
                           <span className="text-sm font-bold">{idx + 1}</span>}
                        </div>
                        <div className="text-left sm:text-center">
                          <p className={`text-sm font-bold ${isCurrent ? "text-primary" : isPast ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

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
                    onClick={() => {
                      setConfirmAction({
                        title: "Fund Contract Escrow",
                        description: `Are you sure you want to fund this contract for ${formatCurrency(contract.amount)}? The money will be locked in escrow.`,
                        onConfirm: () => {
                          const toastId = toast.loading("Initializing payment...");
                          fundContractMutation.mutate({
                            contractId: contract.id,
                            email: user.email,
                            callbackUrl: window.location.href,
                          }, {
                            onSuccess: (data) => {
                              toast.dismiss(toastId);
                              if (data.authorizationUrl) {
                                window.location.href = data.authorizationUrl;
                              }
                            },
                            onError: (error) => {
                              toast.error(error.message || "Failed to initialize payment.", { id: toastId });
                            }
                          });
                        }
                      });
                    }}
                    disabled={fundContractMutation.status === "pending"}
                  >
                    Fund escrow
                  </Button>
                ) : null}
                {contract.status === "ACTIVE" && user.id === contract.clientId ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setConfirmAction({
                        title: "Confirm Completion",
                        description: "Are you sure you want to confirm completion as client? This indicates you are satisfied with the work done.",
                        onConfirm: () =>
                          confirmCompletionMutation.mutate({
                            contractId: contract.id,
                            isClient: true,
                          })
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
                      setConfirmAction({
                        title: "Submit Work",
                        description: "Are you sure you want to submit your work and ask the client to release the escrow?",
                        onConfirm: () =>
                          confirmCompletionMutation.mutate({
                            contractId: contract.id,
                            isClient: false,
                          })
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
                    onClick={() =>
                      setConfirmAction({
                        title: "Release Escrow Payment",
                        description: `Are you sure you want to release the escrow payment of ${formatCurrency(contract.amount)} to the artisan? This action is irreversible.`,
                        onConfirm: () => releaseEscrowMutation.mutate(contract.id)
                      })
                    }
                    disabled={releaseEscrowMutation.status === "pending"}
                  >
                    Release payment
                  </Button>
                ) : null}
                {contract.status === "ACTIVE" && !contract.escrowReleased && user.id === contract.clientId ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setConfirmAction({
                        title: "Request Refund",
                        description: "Are you sure you want to request a refund for this contract? This will cancel the agreement.",
                        onConfirm: () =>
                          refundContractMutation.mutate({
                            contractId: contract.id,
                            reason: "Client requested refund",
                          })
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

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-foreground">{confirmAction.title}</h3>
            <p className="text-sm text-muted-foreground">{confirmAction.description}</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setConfirmAction(null)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  confirmAction.onConfirm();
                  setConfirmAction(null);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
