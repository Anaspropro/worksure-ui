"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does the escrow system work?",
    a: "When a client funds a contract, the money is held securely in WorkSure's escrow. The artisan can see the funds are available, which gives them confidence to start. Payment is only released when both parties confirm the work is complete.",
  },
  {
    q: "How are artisans verified?",
    a: "Every artisan goes through a KYC process including identity verification, skill assessment, and portfolio review. Only verified artisans can submit proposals and accept contracts.",
  },
  {
    q: "What happens if there's a dispute?",
    a: "WorkSure has a built-in dispute resolution system. An admin reviews the evidence from both parties and makes a fair decision. Funds remain in escrow until the dispute is resolved.",
  },
  {
    q: "How much does WorkSure charge?",
    a: "WorkSure charges a small platform fee (5%) on completed contracts. There are no hidden fees — the exact amounts are shown before you fund escrow.",
  },
  {
    q: "How fast do artisans get paid?",
    a: "Once the client confirms work completion, payment is released instantly to the artisan's WorkSure wallet. They can withdraw to their bank at any time.",
  },
  {
    q: "Is my money safe?",
    a: "Yes. All escrow funds are held in segregated accounts and protected by our financial infrastructure. Your money is never mixed with WorkSure operating funds.",
  },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <button
                className="flex w-full items-center justify-between p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-foreground pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`size-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" as const }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
