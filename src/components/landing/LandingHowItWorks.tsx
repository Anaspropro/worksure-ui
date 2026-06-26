"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import InteractiveEscrowVisualizer from "./InteractiveEscrowVisualizer";

const steps = [
  {
    num: "01",
    title: "Define Your Project",
    desc: "Draft a clear project brief outlining your requirements, budget, and timeline. Publish it instantly to our curated network.",
  },
  {
    num: "02",
    title: "Select the Best Talent",
    desc: "Receive applications from vetted professionals. Review their past work, client ratings, and proposed terms before making a decision.",
  },
  {
    num: "03",
    title: "Secure the Funds",
    desc: "Deposit the agreed amount into our secure escrow vault. The artisan is notified that funds are guaranteed, motivating them to start.",
  },
  {
    num: "04",
    title: "Approve and Release",
    desc: "Review the delivered work. Once you are 100% satisfied, approve the milestone and we release the payment instantly.",
  },
];

export default function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Simple. Secure. <span className="text-primary">Straightforward.</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-[2px] bg-primary/20" />
              )}
              <div className="relative z-10 mx-auto mb-5 size-16 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/20">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <InteractiveEscrowVisualizer />
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl px-8 shadow-lg shadow-primary/20"
          >
            <Link href="/auth/register">
              Start Now <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
