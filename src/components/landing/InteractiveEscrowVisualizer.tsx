"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Wallet,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    id: "draft",
    label: "01. Create Draft",
    title: "Define Clear Project Terms",
    description: "The client posts a job and drafts a smart contract detailing milestones, deadlines, and the final payout amount. Both parties sign digitally.",
    badge: "Milestone Setup",
    color: "primary"
  },
  {
    id: "fund",
    label: "02. Lock Escrow",
    title: "Secure Payment in Escrow",
    description: "The client deposits funds into a secure, bank-grade escrow vault. The artisan is notified that the payment is 100% guaranteed, giving them confidence to start.",
    badge: "Payment Secured",
    color: "warning"
  },
  {
    id: "work",
    label: "03. Vetted Deliverables",
    title: "Complete & Submit Milestones",
    description: "The artisan completes the defined milestones and uploads deliverables/proof of work directly on the platform for client review.",
    badge: "Under Review",
    color: "info"
  },
  {
    id: "release",
    label: "04. Instant Payout",
    title: "Approve & Release Funds",
    description: "Once the client reviews and approves the work, they click 'Release'. The escrow vault instantly releases the payout directly to the artisan's bank account.",
    badge: "Disbursed",
    color: "success"
  }
] as const;

export default function InteractiveEscrowVisualizer() {
  const [activeStep, setActiveStep] = useState<"draft" | "fund" | "work" | "release">("draft");

  const currentStepData = steps.find(s => s.id === activeStep)!;
  const activeIndex = steps.findIndex(s => s.id === activeStep);

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden max-w-5xl mx-auto">
      <CardContent className="p-6 md:p-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        
        {/* Step Selector Navigation */}
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-r border-border/80 shrink-0">
          {steps.map((step) => {
            const isActive = step.id === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-semibold transition-all shrink-0 select-none ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeVisualStep"
                    className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20"
                    transition={{ type: "spring", damping: 20, stiffness: 220 }}
                  />
                )}
                <span className="relative z-10">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Panel */}
        <div className="grid gap-8 md:grid-cols-[1fr_280px] items-center">
          
          {/* Explanation Text */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-left"
              >
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary rounded-full px-3 py-1 font-medium text-xs">
                  {currentStepData.badge}
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {currentStepData.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                  {currentStepData.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Quick Actions / Indicators */}
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={() => {
                  const nextIndex = (activeIndex + 1) % steps.length;
                  setActiveStep(steps[nextIndex].id);
                }}
                variant="outline"
                size="sm"
                className="rounded-xl gap-2 font-semibold h-10 px-4"
              >
                Next Step <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Interactive Flow Diagram Visuals */}
          <div className="relative h-[280px] w-full rounded-2xl bg-muted/20 border border-border/80 flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
            
            <AnimatePresence mode="wait">
              {activeStep === "draft" && (
                <motion.div
                  key="v-draft"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex flex-col items-center gap-3 text-center"
                >
                  <div className="relative size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                    <FileText className="size-8 text-primary animate-pulse" />
                    <Sparkles className="absolute -top-1.5 -right-1.5 size-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-foreground">Contract Proposal</p>
                    <p className="text-xs text-muted-foreground font-mono">Status: DRAFT</p>
                  </div>
                  <div className="rounded-lg bg-card border border-border px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                    ₦50,000 Milestone
                  </div>
                </motion.div>
              )}

              {activeStep === "fund" && (
                <motion.div
                  key="v-fund"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex flex-col items-center gap-4 text-center w-full"
                >
                  <div className="flex items-center gap-6 justify-center w-full max-w-[220px] relative">
                    {/* Wallet node */}
                    <div className="size-12 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                      <Wallet className="size-5 text-muted-foreground" />
                    </div>
                    {/* Flowing money particle */}
                    <motion.div 
                      initial={{ left: "15%" }}
                      animate={{ left: "75%" }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                      className="absolute size-3 rounded-full bg-primary shadow-[0_0_10px_#10B981]"
                    />
                    {/* Vault node */}
                    <div className="size-16 rounded-2xl bg-warning/10 border border-warning/30 flex items-center justify-center shadow-lg shadow-warning/10 relative">
                      <Lock className="size-7 text-warning" />
                      <ShieldCheck className="absolute -top-1 -right-1 size-5 text-success" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-foreground">Escrow Locked</p>
                    <p className="text-xs text-warning font-mono font-bold">Safe Deposit Vault</p>
                  </div>
                </motion.div>
              )}

              {activeStep === "work" && (
                <motion.div
                  key="v-work"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex flex-col items-center gap-3 text-center"
                >
                  <div className="size-16 rounded-2xl bg-info/10 border border-info/20 flex items-center justify-center relative shadow-lg shadow-info/5">
                    <FileText className="size-8 text-info" />
                    <motion.div
                      className="absolute inset-0 border-2 border-info border-t-transparent rounded-2xl"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                  </div>
                  <div className="space-y-2 w-full max-w-[160px]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-info font-mono">80%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-info"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">Artisan submitted deliverables</p>
                </motion.div>
              )}

              {activeStep === "release" && (
                <motion.div
                  key="v-release"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex flex-col items-center gap-4 text-center w-full"
                >
                  <div className="flex items-center gap-6 justify-center w-full max-w-[220px] relative">
                    {/* Vault node */}
                    <div className="size-12 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                      <Lock className="size-5 text-muted-foreground" />
                    </div>
                    {/* Flowing money particle */}
                    <motion.div 
                      initial={{ left: "15%" }}
                      animate={{ left: "75%" }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      className="absolute size-3 rounded-full bg-success shadow-[0_0_10px_#22C55E]"
                    />
                    {/* Artisan wallet node */}
                    <div className="size-16 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-center shadow-lg shadow-success/10 relative">
                      <CheckCircle2 className="size-7 text-success" />
                      <ArrowUpRight className="absolute -top-1 -right-1 size-5 text-success" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-foreground">Disbursed Instantly</p>
                    <p className="text-xs text-success font-mono font-bold">₦50,000 Transferred</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </CardContent>
    </Card>
  );
}
